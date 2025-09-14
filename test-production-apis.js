#!/usr/bin/env node

// Production API Test Suite
const PRODUCTION_BASE = process.env.PROD_API_BASE || 'http://YOUR_VPS_IP:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://YOUR_VPS_IP:8080';

const colors = {
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', 
  blue: '\x1b[34m', reset: '\x1b[0m', bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

async function testProductionAPIs() {
  log.header('🌐 PRODUCTION API CONNECTIVITY TEST');
  log.info(`Production Backend: ${PRODUCTION_BASE}`);
  log.info(`Frontend URL: ${FRONTEND_URL}`);

  const criticalTests = [
    // Core functionality
    { name: 'Health Check', url: `${PRODUCTION_BASE}/health` },
    { name: 'Products API', url: `${PRODUCTION_BASE}/api/products?limit=1` },
    { name: 'Categories API', url: `${PRODUCTION_BASE}/api/categories?limit=1` },
    { name: 'Hero Banner', url: `${PRODUCTION_BASE}/api/globals/hero-banner-global` },
    
    // Frontend-Backend connectivity
    { name: 'CORS Test', url: `${PRODUCTION_BASE}/api/products?limit=1`, 
      headers: { 'Origin': FRONTEND_URL } },
    
    // Media serving
    { name: 'Media API', url: `${PRODUCTION_BASE}/api/media?limit=1` },
    
    // Admin access
    { name: 'Admin Panel', url: `${PRODUCTION_BASE}/admin` }
  ];

  let passed = 0, failed = 0;

  for (const test of criticalTests) {
    try {
      const response = await fetch(test.url, { headers: test.headers || {} });
      
      if (response.ok) {
        log.success(`${test.name}: Connected (${response.status})`);
        passed++;
      } else {
        log.error(`${test.name}: Failed (${response.status})`);
        failed++;
      }
    } catch (error) {
      log.error(`${test.name}: ${error.message}`);
      failed++;
    }
  }

  log.header('📊 PRODUCTION TEST RESULTS');
  console.log(`Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`Failed: ${colors.red}${failed}${colors.reset}`);
  
  if (failed === 0) {
    log.success('🎉 All production APIs are working seamlessly!');
  } else {
    log.warning('⚠️  Some APIs failed. Check server configuration.');
  }

  return { passed, failed, total: passed + failed };
}

// Quick connectivity test
async function quickConnectivityTest() {
  log.header('⚡ QUICK CONNECTIVITY TEST');
  
  const endpoints = [
    `${PRODUCTION_BASE}/health`,
    `${PRODUCTION_BASE}/api/products?limit=1`,
    `${PRODUCTION_BASE}/admin`
  ];

  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await fetch(endpoint, { method: 'HEAD' });
      const time = Date.now() - start;
      
      if (response.ok) {
        log.success(`${endpoint} - ${time}ms`);
      } else {
        log.error(`${endpoint} - ${response.status}`);
      }
    } catch (error) {
      log.error(`${endpoint} - Connection failed`);
    }
  }
}

if (require.main === module) {
  (async () => {
    await quickConnectivityTest();
    await testProductionAPIs();
  })();
}

module.exports = { testProductionAPIs, quickConnectivityTest };