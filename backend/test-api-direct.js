const fetch = require('node-fetch');

async function testAPI() {
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    console.log('Testing Best Sellers API...');
    const response = await fetch(`${baseUrl}/products?where[bestSeller][equals]=true&limit=5`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Found: ${data.totalDocs || data.docs?.length || 0} products`);
    if (data.docs && data.docs.length > 0) {
      console.log(`Sample: ${data.docs[0].name}`);
    }
    
    console.log('\nTesting Loved by Experts API...');
    const response2 = await fetch(`${baseUrl}/products?where[lovedByExperts][equals]=true&limit=5`);
    const data2 = await response2.json();
    console.log(`Status: ${response2.status}`);
    console.log(`Found: ${data2.totalDocs || data2.docs?.length || 0} products`);
    if (data2.docs && data2.docs.length > 0) {
      console.log(`Sample: ${data2.docs[0].name}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Make sure backend is running: npm run dev');
  }
}

testAPI();