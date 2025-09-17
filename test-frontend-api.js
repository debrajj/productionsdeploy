// Test the exact API calls that the frontend makes
const API_BASE = 'http://localhost:3000/api';

async function testAPIs() {
  console.log('Testing Best Seller Products API...');
  try {
    const bestSellersResponse = await fetch(`${API_BASE}/products?where%5BbestSeller%5D%5Bequals%5D=true&limit=8&depth=2`);
    const bestSellersData = await bestSellersResponse.json();
    console.log(`✓ Best Sellers: Found ${bestSellersData.docs?.length || 0} products`);
    if (bestSellersData.docs?.length > 0) {
      console.log('  - First product:', bestSellersData.docs[0].name);
    }
  } catch (error) {
    console.log('✗ Best Sellers API failed:', error.message);
  }

  console.log('\nTesting Loved by Experts Products API...');
  try {
    const expertsResponse = await fetch(`${API_BASE}/products?where%5BlovedByExperts%5D%5Bequals%5D=true&limit=4&depth=2`);
    const expertsData = await expertsResponse.json();
    console.log(`✓ Loved by Experts: Found ${expertsData.docs?.length || 0} products`);
    if (expertsData.docs?.length > 0) {
      console.log('  - First product:', expertsData.docs[0].name);
    }
  } catch (error) {
    console.log('✗ Loved by Experts API failed:', error.message);
  }

  console.log('\nTesting General Products API...');
  try {
    const allResponse = await fetch(`${API_BASE}/products?limit=5`);
    const allData = await allResponse.json();
    console.log(`✓ All Products: Found ${allData.docs?.length || 0} products`);
    if (allData.docs?.length > 0) {
      const product = allData.docs[0];
      console.log(`  - Sample product: ${product.name}`);
      console.log(`    bestSeller: ${product.bestSeller}`);
      console.log(`    lovedByExperts: ${product.lovedByExperts}`);
    }
  } catch (error) {
    console.log('✗ General Products API failed:', error.message);
  }
}

testAPIs();