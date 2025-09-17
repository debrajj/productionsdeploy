const API_BASE = 'http://localhost:3000/api';

async function testVariantsAPI() {
  try {
    console.log('Testing product variants API...');
    
    // Test the product-variants endpoint
    const variantsResponse = await fetch(`${API_BASE}/product-variants`);
    const variantsData = await variantsResponse.json();
    
    console.log('Product Variants API Response:');
    console.log(JSON.stringify(variantsData, null, 2));
    
    // Test getting a few products to see their variant data
    console.log('\nTesting products API...');
    const productsResponse = await fetch(`${API_BASE}/products?limit=3`);
    const productsData = await productsResponse.json();
    
    if (productsData.docs && productsData.docs.length > 0) {
      console.log('\nSample products with variant data:');
      productsData.docs.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}:`);
        console.log(`   - simpleFlavors: ${product.simpleFlavors || 'None'}`);
        console.log(`   - simpleWeights: ${product.simpleWeights || 'None'}`);
        console.log(`   - variants: ${product.variants ? JSON.stringify(product.variants) : 'None'}`);
        console.log(`   - price: ₹${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing APIs:', error.message);
  }
}

testVariantsAPI();