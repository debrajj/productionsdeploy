// Debug script to test the exact API calls the frontend makes
const API_BASE = 'http://localhost:3000/api';

async function testFrontendAPIs() {
  console.log('🧪 Testing Frontend API Calls...\n');
  
  try {
    // Test Best Sellers (exact same call as frontend)
    console.log('🏆 Testing Best Sellers API...');
    const bestSellersUrl = `${API_BASE}/products?where%5BbestSeller%5D%5Bequals%5D=true&depth=2&limit=8`;
    console.log('URL:', bestSellersUrl);
    
    const bestSellersResponse = await fetch(bestSellersUrl);
    const bestSellersData = await bestSellersResponse.json();
    
    console.log(`Status: ${bestSellersResponse.status}`);
    console.log(`Total Docs: ${bestSellersData.totalDocs}`);
    console.log(`Products Found: ${bestSellersData.docs?.length || 0}`);
    
    if (bestSellersData.docs && bestSellersData.docs.length > 0) {
      console.log(`Sample Product: ${bestSellersData.docs[0].name}`);
      console.log(`Best Seller: ${bestSellersData.docs[0].bestSeller}`);
    }
    
    // Test Loved by Experts
    console.log('\n👨🔬 Testing Loved by Experts API...');
    const expertsUrl = `${API_BASE}/products?where%5BlovedByExperts%5D%5Bequals%5D=true&depth=2&limit=4`;
    console.log('URL:', expertsUrl);
    
    const expertsResponse = await fetch(expertsUrl);
    const expertsData = await expertsResponse.json();
    
    console.log(`Status: ${expertsResponse.status}`);
    console.log(`Total Docs: ${expertsData.totalDocs}`);
    console.log(`Products Found: ${expertsData.docs?.length || 0}`);
    
    if (expertsData.docs && expertsData.docs.length > 0) {
      console.log(`Sample Product: ${expertsData.docs[0].name}`);
      console.log(`Loved by Experts: ${expertsData.docs[0].lovedByExperts}`);
    }
    
    console.log('\n✅ API Test Complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Use Node.js fetch if available, otherwise show instructions
if (typeof fetch !== 'undefined') {
  testFrontendAPIs();
} else {
  console.log('Run this in a browser console or install node-fetch');
  console.log('\nOr test these URLs directly in your browser:');
  console.log('Best Sellers:', `${API_BASE}/products?where%5BbestSeller%5D%5Bequals%5D=true&limit=3`);
  console.log('Loved by Experts:', `${API_BASE}/products?where%5BlovedByExperts%5D%5Bequals%5D=true&limit=3`);
}