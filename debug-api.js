const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🔍 Testing API endpoints...\n');

  try {
    // Test best sellers
    console.log('1. Testing Best Sellers API:');
    const bestSellersUrl = `${API_BASE}/products?where%5BbestSeller%5D%5Bequals%5D=true&limit=8&depth=2`;
    console.log(`URL: ${bestSellersUrl}`);
    
    const bestSellersRes = await fetch(bestSellersUrl);
    const bestSellersData = await bestSellersRes.json();
    
    console.log(`Status: ${bestSellersRes.status}`);
    console.log(`Total products: ${bestSellersData.totalDocs || 0}`);
    console.log(`Products returned: ${bestSellersData.docs?.length || 0}`);
    
    if (bestSellersData.docs && bestSellersData.docs.length > 0) {
      const firstProduct = bestSellersData.docs[0];
      console.log('First product sample:');
      console.log({
        id: firstProduct.id,
        name: firstProduct.name,
        bestSeller: firstProduct.bestSeller,
        price: firstProduct.price,
        image: firstProduct.image
      });
    }
    console.log('\n');

    // Test loved by experts
    console.log('2. Testing Loved by Experts API:');
    const expertsUrl = `${API_BASE}/products?where%5BlovedByExperts%5D%5Bequals%5D=true&limit=4&depth=2`;
    console.log(`URL: ${expertsUrl}`);
    
    const expertsRes = await fetch(expertsUrl);
    const expertsData = await expertsRes.json();
    
    console.log(`Status: ${expertsRes.status}`);
    console.log(`Total products: ${expertsData.totalDocs || 0}`);
    console.log(`Products returned: ${expertsData.docs?.length || 0}`);
    
    if (expertsData.docs && expertsData.docs.length > 0) {
      const firstProduct = expertsData.docs[0];
      console.log('First product sample:');
      console.log({
        id: firstProduct.id,
        name: firstProduct.name,
        lovedByExperts: firstProduct.lovedByExperts,
        price: firstProduct.price,
        image: firstProduct.image
      });
    }
    console.log('\n');

    // Test all products
    console.log('3. Testing All Products API:');
    const allUrl = `${API_BASE}/products?limit=100&depth=2`;
    console.log(`URL: ${allUrl}`);
    
    const allRes = await fetch(allUrl);
    const allData = await allRes.json();
    
    console.log(`Status: ${allRes.status}`);
    console.log(`Total products: ${allData.totalDocs || 0}`);
    console.log(`Products returned: ${allData.docs?.length || 0}`);
    
    if (allData.docs && allData.docs.length > 0) {
      // Count products by flags
      const bestSellers = allData.docs.filter(p => p.bestSeller === true);
      const lovedByExperts = allData.docs.filter(p => p.lovedByExperts === true);
      const featured = allData.docs.filter(p => p.featured === true);
      const trending = allData.docs.filter(p => p.trending === true);
      
      console.log('Product flags summary:');
      console.log(`- Best Sellers: ${bestSellers.length}`);
      console.log(`- Loved by Experts: ${lovedByExperts.length}`);
      console.log(`- Featured: ${featured.length}`);
      console.log(`- Trending: ${trending.length}`);
      
      console.log('\nSample products with flags:');
      allData.docs.slice(0, 5).forEach((product, i) => {
        console.log(`${i + 1}. ${product.name}`);
        console.log(`   - bestSeller: ${product.bestSeller}`);
        console.log(`   - lovedByExperts: ${product.lovedByExperts}`);
        console.log(`   - featured: ${product.featured}`);
        console.log(`   - trending: ${product.trending}`);
      });
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testAPI();