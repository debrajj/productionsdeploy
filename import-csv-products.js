const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createWriteStream } = require('fs');

// Function to convert string boolean to actual boolean
function convertBoolean(value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
}

// Function to process CSV and convert to proper format
async function processCsvFile() {
  const inputFile = path.join(__dirname, 'BULK-PRODUCTS-75-BRANDS.csv');
  const outputFile = path.join(__dirname, 'BULK-PRODUCTS-PROCESSED.csv');
  
  console.log('Processing CSV file...');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (row) => {
        // Convert boolean fields
        const processedRow = {
          ...row,
          featured: convertBoolean(row.featured),
          trending: convertBoolean(row.trending),
          bestSeller: convertBoolean(row.bestSeller),
          lovedByExperts: convertBoolean(row.lovedByExperts),
          onSale: convertBoolean(row.onSale),
          // Ensure numeric fields are properly formatted
          price: parseFloat(row.price) || 0,
          originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
          rating: row.rating ? parseFloat(row.rating) : null,
          reviews: row.reviews ? parseInt(row.reviews) : null,
        };
        
        results.push(processedRow);
      })
      .on('end', () => {
        console.log(`Processed ${results.length} products`);
        
        // Write processed data back to CSV
        const headers = Object.keys(results[0]);
        const csvContent = [
          headers.join(','),
          ...results.map(row => 
            headers.map(header => {
              const value = row[header];
              // Handle null/undefined values
              if (value === null || value === undefined) return '';
              // Quote strings that contain commas
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');
        
        fs.writeFileSync(outputFile, csvContent);
        console.log(`Processed CSV saved to: ${outputFile}`);
        
        // Now import to database
        importToDatabase(results).then(resolve).catch(reject);
      })
      .on('error', reject);
  });
}

// Function to import processed data to database
async function importToDatabase(products) {
  console.log('Starting database import...');
  
  const API_BASE = 'http://localhost:3000/api';
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const product of products) {
    try {
      // Prepare product data for API
      const productData = {
        name: product.name,
        slug: generateSlug(product.name),
        imageType: 'url',
        imageUrl: product.mainImage,
        price: product.price,
        originalPrice: product.originalPrice,
        onSale: product.onSale,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        trending: product.trending,
        bestSeller: product.bestSeller,
        lovedByExperts: product.lovedByExperts,
        shopByGoal: product.shopByGoal,
        simpleFlavors: product.simpleFlavors,
        nutritionInfo: product.nutritionInfo,
        ingredients: product.ingredients,
        // Handle additional images if present
        additionalImages: product.images ? 
          product.images.split(',').map(url => ({
            imageType: 'url',
            imageUrl: url.trim()
          })) : [],
        // Handle variants if present
        variants: product.variants ? 
          (typeof product.variants === 'string' ? 
            JSON.parse(product.variants) : product.variants) : []
      };
      
      // Make API call to create product
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        successCount++;
        console.log(`✓ Imported: ${product.name}`);
      } else {
        const errorText = await response.text();
        errorCount++;
        errors.push(`${product.name}: ${errorText}`);
        console.log(`✗ Failed: ${product.name} - ${errorText}`);
      }
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      errorCount++;
      errors.push(`${product.name}: ${error.message}`);
      console.log(`✗ Error: ${product.name} - ${error.message}`);
    }
  }
  
  console.log('\n=== Import Summary ===');
  console.log(`✓ Successfully imported: ${successCount} products`);
  console.log(`✗ Failed to import: ${errorCount} products`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
}

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Run the process
processCsvFile()
  .then(() => {
    console.log('Process completed successfully!');
  })
  .catch((error) => {
    console.error('Process failed:', error);
  });