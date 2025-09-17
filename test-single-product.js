const API_BASE = 'http://localhost:3000/api';

async function testSingleProduct() {
  try {
    // Get a product first
    const listResponse = await fetch(`${API_BASE}/products?limit=1`);
    const listData = await listResponse.json();
    
    if (!listData.docs || listData.docs.length === 0) {
      console.log('No products found');
      return;
    }
    
    const product = listData.docs[0];
    console.log('Testing product:', product.name);
    console.log('ID:', product.id);
    console.log('Slug:', product.slug);
    
    // Test by ID
    console.log('\n1. Testing by ID...');
    const byIdResponse = await fetch(`${API_BASE}/products/${product.id}`);
    console.log('Status:', byIdResponse.status);
    
    if (byIdResponse.ok) {
      const byIdData = await byIdResponse.json();
      console.log('✅ By ID works:', byIdData.name);
    } else {
      console.log('❌ By ID failed');
    }
    
    // Test by slug
    console.log('\n2. Testing by slug...');
    const bySlugResponse = await fetch(`${API_BASE}/products?where[slug][equals]=${encodeURIComponent(product.slug)}&limit=1`);
    console.log('Status:', bySlugResponse.status);
    
    if (bySlugResponse.ok) {
      const bySlugData = await bySlugResponse.json();
      if (bySlugData.docs && bySlugData.docs.length > 0) {
        console.log('✅ By slug works:', bySlugData.docs[0].name);
      } else {
        console.log('❌ By slug - no results');
      }
    } else {
      console.log('❌ By slug failed');
    }
    
    console.log('\nFrontend URLs to test:');
    console.log(`http://localhost:8080/product/${product.id}`);
    console.log(`http://localhost:8080/product/${product.slug}`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSingleProduct();