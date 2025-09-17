const API_BASE = 'http://localhost:3000/api';

function generateUniqueSlug(name, id) {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Add last 6 characters of ID to make it unique
  const uniqueSuffix = id.slice(-6);
  return `${baseSlug}-${uniqueSuffix}`;
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
        const newSlug = generateUniqueSlug(product.name, product.id);
        
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
    
    // Test a few products after fixing
    if (fixedCount > 0) {
      console.log('\n🧪 Testing fixed products...');
      const testResponse = await fetch(`${API_BASE}/products?limit=3`);
      const testData = await testResponse.json();
      
      testData.docs.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} -> slug: "${product.slug}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fixing slugs:', error.message);
  }
}

fixProductSlugs();