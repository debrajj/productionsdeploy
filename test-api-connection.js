#!/usr/bin/env node

if (!process.env.BACKEND_URL) {
  console.error('❌ BACKEND_URL environment variable is required');
  console.log('Set it like: BACKEND_URL=https://yourdomain.com node test-api-connection.js');
  process.exit(1);
}

const BASE_URL = process.env.BACKEND_URL;

const testEndpoints = [
  `${BASE_URL}/api/health`,
  `${BASE_URL}/api/products`,
  `${BASE_URL}/api/categories`,
  `${BASE_URL}/api/announcements`
];

const postEndpoints = [
  {
    url: `${BASE_URL}/api/test-order`,
    method: 'POST',
    data: {}
  }
];

async function testAPI(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    console.log('---');
    
    return { url, status: response.status, success: response.ok, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('---');
    return { url, error: error.message, success: false };
  }
}

async function testPOST(endpoint) {
  try {
    console.log(`Testing POST: ${endpoint.url}`);
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endpoint.data)
    });
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    console.log('---');
    
    return { url: endpoint.url, status: response.status, success: response.ok, data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('---');
    return { url: endpoint.url, error: error.message, success: false };
  }
}

async function runTests() {
  console.log('🚀 Testing Backend API Endpoints...\n');
  
  const results = [];
  
  // Test GET endpoints
  for (const endpoint of testEndpoints) {
    const result = await testAPI(endpoint);
    results.push(result);
  }
  
  // Test POST endpoints
  console.log('\n🔄 Testing POST Endpoints...\n');
  for (const endpoint of postEndpoints) {
    const result = await testPOST(endpoint);
    results.push(result);
  }
  
  console.log('\n📋 Summary:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status || 'ERROR'}`);
  });
  
  const workingEndpoints = results.filter(r => r.success).length;
  console.log(`\n${workingEndpoints}/${results.length} endpoints working`);
  
  if (workingEndpoints === 0) {
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check if port 3000 is available');
    console.log('3. Verify .env configuration');
  }
}

runTests().catch(console.error);