const fs = require('fs');
const csv = require('csv-parser');

const API_BASE = 'http://localhost:3000/api';
const csvFile = './BULK-PRODUCTS-75-BRANDS-FIXED.csv';

// Valid shopByGoal values from the backend schema
const validGoals = ['MUSCLE_GAIN', 'WEIGHT_LOSS', 'ENERGY_PERFORMANCE', 'HEALTH_WELLNESS'];

function mapGoal(goal) {
  if (!goal) return undefined;
  
  const goalUpper = goal.toUpperCase();
  if (validGoals.includes(goalUpper)) return goalUpper;
  
  // Map common variations
  if (goalUpper.includes('MUSCLE')) return 'MUSCLE_GAIN';
  if (goalUpper.includes('WEIGHT') || goalUpper.includes('LOSS')) return 'WEIGHT_LOSS';
  if (goalUpper.includes('ENERGY') || goalUpper.includes('PERFORMANCE')) return 'ENERGY_PERFORMANCE';
  if (goalUpper.includes('WELLNESS') || goalUpper.includes('HEALTH')) return 'HEALTH_WELLNESS';
  
  return undefined;
}

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
          category: row.category,
          subcategory: row.subcategory,
          brand: row.brand,
          description: row.description || 'Premium quality supplement for your fitness goals.',
          imageType: 'url',
          imageUrl: row.mainImage,
          rating: parseFloat(row.rating) || 4.0,
          reviews: parseInt(row.reviews) || 0,
          simpleFlavors: row.simpleFlavors || undefined,
          simpleWeights: row.simpleWeights || undefined,
          featured: row.featured === 'true' || row.featured === true,
          trending: row.trending === 'true' || row.trending === true,
          bestSeller: row.bestSeller === 'true' || row.bestSeller === true,
          lovedByExperts: row.lovedByExperts === 'true' || row.lovedByExperts === true,
          onSale: row.onSale === 'true' || row.onSale === true,
          shopByGoal: mapGoal(row.shopByGoal),
          nutritionInfo: row.nutritionInfo || undefined,
          ingredients: row.ingredients || undefined,
          slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        };

        // Only add originalPrice if it exists and is different from price
        if (row.originalPrice && parseInt(row.originalPrice) > product.price) {
          product.originalPrice = parseInt(row.originalPrice);
        }

        // Only add nutrition image if it exists
        if (row.nutritionImage) {
          product.nutritionImageType = 'url';
          product.nutritionImageUrl = row.nutritionImage;
        }

        products.push(product);
      })
      .on('end', async () => {
        console.log(`Loaded ${products.length} products from CSV`);
        
        // Import products one by one
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < Math.min(10, products.length); i++) { // Import only first 10 for testing
          const product = products[i];
          try {
            console.log(`Importing ${i + 1}/10: ${product.name}`);
            console.log(`  - simpleFlavors: ${product.simpleFlavors || 'None'}`);
            console.log(`  - simpleWeights: ${product.simpleWeights || 'None'}`);
            console.log(`  - shopByGoal: ${product.shopByGoal || 'None'}`);
            
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
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`\n📊 Import Summary:`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📝 Total processed: ${Math.min(10, products.length)}`);
        
        resolve();
      })
      .on('error', reject);
  });
}

// Run the import
importProducts().catch(console.error);