const API_BASE = 'http://localhost:3000/api';

async function testProductLoading() {
  try {
    console.log('🧪 Testing Product Loading...\n');
    
    // 1. Test products list
    console.log('1. Testing products list...');
    const listResponse = await fetch(`${API_BASE}/products?limit=3`);
    const listData = await listResponse.json();
    
    if (listData.docs && listData.docs.length > 0) {
      console.log(`✅ Products list working - ${listData.docs.length} products found`);
      
      // Show first few products with their slugs and variant data
      listData.docs.forEach((product, index) => {
        console.log(`\n   ${index + 1}. ${product.name}`);
        console.log(`      - ID: ${product.id}`);
        console.log(`      - Slug: "${product.slug}"`);
        console.log(`      - Price: ₹${product.price}`);
        console.log(`      - simpleFlavors: ${product.simpleFlavors || 'None'}`);
        console.log(`      - simpleWeights: ${product.simpleWeights || 'None'}`);
      });
      
      // 2. Test individual product by ID
      const firstProduct = listData.docs[0];
      console.log(`\n2. Testing product by ID: ${firstProduct.id}`);
      
      const byIdResponse = await fetch(`${API_BASE}/products/${firstProduct.id}`);
      if (byIdResponse.ok) {
        const byIdData = await byIdResponse.json();
        console.log(`✅ Product by ID working`);
        console.log(`   - Name: ${byIdData.name}`);
        console.log(`   - Variants: simpleFlavors="${byIdData.simpleFlavors || 'None'}", simpleWeights="${byIdData.simpleWeights || 'None'}"`);
      } else {
        console.log(`❌ Product by ID failed: ${byIdResponse.status}`);
      }
      
      // 3. Test product by slug
      if (firstProduct.slug && firstProduct.slug !== 'false' && firstProduct.slug !== 'true') {
        console.log(`\n3. Testing product by slug: "${firstProduct.slug}"`);
        
        const bySlugResponse = await fetch(`${API_BASE}/products?where[slug][equals]=${firstProduct.slug}&limit=1`);
        if (bySlugResponse.ok) {
          const bySlugData = await bySlugResponse.json();
          if (bySlugData.docs && bySlugData.docs.length > 0) {
            console.log(`✅ Product by slug working`);
            console.log(`   - Found: ${bySlugData.docs[0].name}`);
          } else {
            console.log(`❌ Product by slug - no results found`);
          }
        } else {
          console.log(`❌ Product by slug failed: ${bySlugResponse.status}`);
        }
      }
      
      // 4. Test variants API
      console.log(`\n4. Testing variants API...`);
      const variantsResponse = await fetch(`${API_BASE}/product-variants`);
      if (variantsResponse.ok) {
        const variantsData = await variantsResponse.json();
        console.log(`✅ Variants API working`);
        console.log(`   - Flavors: ${variantsData.data.flavors.length} (${variantsData.data.flavors.join(', ')})`);
        console.log(`   - Weights: ${variantsData.data.weights.length} (${variantsData.data.weights.join(', ')})`);
      } else {
        console.log(`❌ Variants API failed: ${variantsResponse.status}`);
      }
      
      // 5. Test frontend URLs
      console.log(`\n5. Frontend URLs to test:`);
      listData.docs.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. http://localhost:8080/product/${product.id} (by ID)`);
        if (product.slug && product.slug !== 'false' && product.slug !== 'true') {
          console.log(`      http://localhost:8080/product/${product.slug} (by slug)`);
        }
      });
      
    } else {
      console.log('❌ No products found in list');
    }
    
    console.log('\n✅ Product loading test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductLoading();