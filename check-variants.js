const API_BASE = 'http://localhost:3000/api';

const https = require('https');
const http = require('http');
const { URL } = require('url');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve(jsonData) });
        } catch (e) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, text: () => Promise.resolve(data) });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function checkVariants() {
  try {
    console.log('🔍 Checking products with variants...');
    
    const response = await makeRequest(`${API_BASE}/products?limit=10`);
    const data = await response.json();
    
    console.log(`📊 Checking first 10 products out of ${data.totalDocs}`);
    
    for (const product of data.docs) {
      console.log(`\n📦 Product: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   simpleFlavors: ${product.simpleFlavors || 'none'}`);
      console.log(`   simpleWeights: ${product.simpleWeights || 'none'}`);
      console.log(`   variants type: ${typeof product.variants}`);
      console.log(`   variants value: ${JSON.stringify(product.variants)}`);
      console.log(`   ingredients type: ${typeof product.ingredients}`);
      console.log(`   ingredients value: ${product.ingredients}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVariants();