const fs = require('fs');
const csv = require('csv-parser');

const API_BASE = 'http://localhost:3000/api';
const csvFile = './BULK-PRODUCTS-75-BRANDS-FIXED.csv';

async function importProducts() {
  const products = [];
  
  // Read the fixed CSV
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        // Transform CSV row to match backend schema
        const product = {
          name: row.name,
          price: parseInt(row.price) || 0,
          originalPrice: parseInt(row.originalPrice) || undefined,
          category: row.category,
          subcategory: row.subcategory,
          brand: row.brand,
          description: row.description,
          imageType: 'url',
          imageUrl: row.mainImage,
          rating: parseFloat(row.rating) || 4.0,
          reviews: parseInt(row.reviews) || 0,
          simpleFlavors: row.simpleFlavors,
          simpleWeights: row.simpleWeights,
          featured: row.featured === 'true' || row.featured === true,
          trending: row.trending === 'true' || row.trending === true,
          bestSeller: row.bestSeller === 'true' || row.bestSeller === true,
          lovedByExperts: row.lovedByExperts === 'true' || row.lovedByExperts === true,
          onSale: row.onSale === 'true' || row.onSale === true,
          shopByGoal: row.shopByGoal,
          nutritionInfo: row.nutritionInfo,
          ingredients: row.ingredients,
          certifications: row.certifications,
          nutritionImageType: 'url',
          nutritionImageUrl: row.nutritionImage,
          slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        };

        // Handle additional images
        if (row.images) {
          try {
            const imageUrls = row.images.split(',').map(url => url.trim()).filter(url => url);
            product.additionalImages = imageUrls.map(url => ({
              imageType: 'url',
              imageUrl: url
            }));
          } catch (e) {
            console.log(`Error parsing images for ${product.name}: ${e.message}`);
          }
        }

        products.push(product);
      })
      .on('end', async () => {
        console.log(`Loaded ${products.length} products from CSV`);
        
        // Import products one by one
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          try {
            console.log(`Importing ${i + 1}/${products.length}: ${product.name}`);
            
            const response = await fetch(`${API_BASE}/products`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(product)
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log(`✅ Successfully imported: ${product.name}`);
              successCount++;
            } else {
              const errorText = await response.text();
              console.log(`❌ Failed to import ${product.name}: ${response.status} - ${errorText}`);
              errorCount++;
            }
          } catch (error) {
            console.log(`❌ Error importing ${product.name}: ${error.message}`);
            errorCount++;
          }
          
          // Add small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\n📊 Import Summary:`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📝 Total: ${products.length}`);
        
        resolve();
      })
      .on('error', reject);
  });
}

// Run the import
importProducts().catch(console.error);