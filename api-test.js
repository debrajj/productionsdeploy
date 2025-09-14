#!/usr/bin/env node

const API_BASE = process.env.BACKEND_URL;
const API_ENDPOINT = `${API_BASE}/api`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Test helper function
async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await fetch(url);
    const isSuccess = response.status === expectedStatus;
    
    if (isSuccess) {
      log.success(`${name}: ${response.status}`);
      return { success: true, status: response.status, data: await response.json().catch(() => null) };
    } else {
      log.error(`${name}: Expected ${expectedStatus}, got ${response.status}`);
      return { success: false, status: response.status, error: response.statusText };
    }
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test suite
async function runAPITests() {
  log.header('🚀 O2 NUTRITION API HEALTH CHECK');
  log.info(`Testing API Base: ${API_BASE}`);
  log.info(`Testing API Endpoint: ${API_ENDPOINT}`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    endpoints: []
  };

  // Test cases
  const tests = [
    // Core Health Check
    { name: 'Health Check', url: `${API_BASE}/health` },
    
    // Admin Panel
    { name: 'Admin Panel', url: `${API_BASE}/admin`, expectedStatus: 200 },
    
    // Products API
    { name: 'Products List', url: `${API_ENDPOINT}/products?limit=5` },
    { name: 'Products Search', url: `${API_ENDPOINT}/products?where[name][contains]=protein&limit=3` },
    { name: 'Featured Products', url: `${API_ENDPOINT}/products?where[featured][equals]=true&limit=3` },
    { name: 'Trending Products', url: `${API_ENDPOINT}/products?where[trending][equals]=true&limit=3` },
    { name: 'Best Seller Products', url: `${API_ENDPOINT}/products?where[bestSeller][equals]=true&limit=3` },
    
    // Categories API
    { name: 'Categories List', url: `${API_ENDPOINT}/categories?where[isActive][equals]=true` },
    
    // Brands API (if exists)
    { name: 'Brands List', url: `${API_ENDPOINT}/brands` },
    
    // Goals API (if exists)
    { name: 'Goals List', url: `${API_ENDPOINT}/goals?where[isActive][equals]=true` },
    
    // Announcements API
    { name: 'Announcements', url: `${API_ENDPOINT}/announcements?where[isActive][equals]=true` },
    
    // Coupons API
    { name: 'Coupons List', url: `${API_ENDPOINT}/coupons?where[isActive][equals]=true` },
    
    // Orders API
    { name: 'Orders Endpoint', url: `${API_ENDPOINT}/orders?limit=1` },
    
    // Media API
    { name: 'Media Endpoint', url: `${API_ENDPOINT}/media?limit=1` },
    
    // Globals
    { name: 'Hero Banner Global', url: `${API_ENDPOINT}/globals/hero-banner-global` },
    
    // Subscribers API
    { name: 'Subscribers Endpoint', url: `${API_ENDPOINT}/subscribers?limit=1` }
  ];

  log.header('📋 TESTING API ENDPOINTS');

  for (const test of tests) {
    results.total++;
    const result = await testEndpoint(test.name, test.url, test.expectedStatus);
    
    if (result.success) {
      results.passed++;
      results.endpoints.push({ ...test, status: 'PASS', response: result });
    } else {
      results.failed++;
      results.endpoints.push({ ...test, status: 'FAIL', error: result.error });
    }
  }

  // Test CORS
  log.header('🌐 TESTING CORS CONFIGURATION');
  try {
    const corsTest = await fetch(`${API_ENDPOINT}/products?limit=1`, {
      method: 'OPTIONS',
      headers: {
        'Origin': process.env.FRONTEND_URL,
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    if (corsTest.ok) {
      log.success('CORS Configuration: Working');
      results.passed++;
    } else {
      log.error('CORS Configuration: Failed');
      results.failed++;
    }
    results.total++;
  } catch (error) {
    log.error(`CORS Test: ${error.message}`);
    results.failed++;
    results.total++;
  }

  // Summary
  log.header('📊 TEST RESULTS SUMMARY');
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    log.header('❌ FAILED ENDPOINTS');
    results.endpoints
      .filter(e => e.status === 'FAIL')
      .forEach(e => log.error(`${e.name}: ${e.error || 'Unknown error'}`));
  }

  // Recommendations
  log.header('💡 RECOMMENDATIONS');
  
  if (results.failed === 0) {
    log.success('All APIs are working seamlessly! 🎉');
  } else {
    log.warning('Some endpoints failed. Check the following:');
    console.log('1. Ensure backend server is running on port 3000');
    console.log('2. Verify database connection (MongoDB Atlas)');
    console.log('3. Check environment variables in .env files');
    console.log('4. Ensure CORS origins are properly configured');
    console.log('5. Verify Payload CMS collections are properly set up');
  }

  return results;
}

// Environment check
async function checkEnvironment() {
  log.header('🔧 ENVIRONMENT CHECK');
  
  // Check if server is reachable
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      log.success('Backend server is reachable');
      return true;
    } else {
      log.error('Backend server returned error status');
      return false;
    }
  } catch (error) {
    log.error('Backend server is not reachable');
    log.info('Make sure to start the backend server first:');
    console.log('  cd backend && npm run dev');
    return false;
  }
}

// Run tests
async function main() {
  const isServerRunning = await checkEnvironment();
  
  if (!isServerRunning) {
    process.exit(1);
  }
  
  const results = await runAPITests();
  
  // Exit with error code if tests failed
  if (results.failed > 0) {
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node api-test.js [options]

Options:
  --help, -h     Show this help message
  
Environment Variables:
  API_BASE       Base URL for the API (default: http://localhost:3000)
  
Examples:
  node api-test.js
  API_BASE=http://your-vps-ip:3000 node api-test.js
  `);
  process.exit(0);
}

main().catch(console.error);