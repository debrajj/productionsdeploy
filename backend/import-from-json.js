import fs from 'fs';
import path from 'path';

// Read the JSON file
const jsonPath = '../frontend/src/data/homeproduct.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function uploadToPayload() {
  const baseUrl = `${process.env.BACKEND_URL}/api`;
  
  console.log(`Found ${data.products.length} products to upload...`);
  
  for (const product of data.products) {
    const payloadProduct = {
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice || null,
      onSale: product.onSale || false,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      customCategory: product.category,
      customSubcategory: product.subcategory,
      customBrand: product.brand,
      featured: product.featured || false,
      trending: product.trending || false,
      bestSeller: product.bestSeller || false,
      lovedByExperts: product.lovedByExperts || false,
      description: product.description,
      rating: product.rating || 0,
      reviews: product.reviews || 0
    };
    
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadProduct)
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${product.name}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed: ${product.name} - ${response.status}: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${product.name} - ${error.message}`);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🎉 Import complete!');
}

uploadToPayload();