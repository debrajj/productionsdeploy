const API_BASE = 'http://localhost:3000/api';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function fixProductSlugs() {
  try {
    console.log('Fetching all products to fix slugs...');
    
    // Get all products
    const response = await fetch(`${API_BASE}/products?limit=100`);
    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      console.log('No products found');
      return;
    }
    
    console.log(`Found ${data.docs.length} products`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const product of data.docs) {
      // Check if slug needs fixing
      if (!product.slug || product.slug === 'false' || product.slug === 'true' || product.slug.length < 3) {
        const newSlug = generateSlug(product.name);
        
        console.log(`Fixing slug for "${product.name}": "${product.slug}" -> "${newSlug}"`);
        
        try {
          const updateResponse = await fetch(`${API_BASE}/products/${product.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              slug: newSlug
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Fixed slug for: ${product.name}`);
            fixedCount++;
          } else {
            const errorText = await updateResponse.text();
            console.log(`❌ Failed to fix slug for ${product.name}: ${updateResponse.status} - ${errorText}`);
            errorCount++;
          }
        } catch (error) {
          console.log(`❌ Error fixing slug for ${product.name}: ${error.message}`);
          errorCount++;
        }
        
        // Add delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n📊 Slug Fix Summary:`);
    console.log(`✅ Fixed: ${fixedCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📝 Total products: ${data.docs.length}`);
    
  } catch (error) {
    console.error('❌ Error fixing slugs:', error.message);
  }
}

fixProductSlugs();