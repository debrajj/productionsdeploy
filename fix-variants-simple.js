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

async function fixVariants() {
  try {
    console.log('🔍 Checking AVVATAR Whey Protein variants...');
    
    // Find AVVATAR Whey Protein
    const searchResponse = await makeRequest(`${API_BASE}/products?where[name][contains]=AVVATAR&limit=1`);
    const searchResult = await searchResponse.json();
    
    if (!searchResult.docs || searchResult.docs.length === 0) {
      console.log('❌ AVVATAR Whey Protein not found');
      return;
    }
    
    const product = searchResult.docs[0];
    console.log(`📦 Found: ${product.name}`);
    console.log(`   Current variants:`, product.variants);
    console.log(`   Current simpleFlavors:`, product.simpleFlavors);
    
    // Clear simpleFlavors so variants show
    const updateData = {
      simpleFlavors: ""
    };
    
    const updateResponse = await makeRequest(`${API_BASE}/products/${product.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (updateResponse.ok) {
      console.log(`✅ Cleared simpleFlavors from ${product.name}`);
      console.log('🔄 Now check the product detail page - variants should show with pricing');
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Failed to update: ${updateResponse.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVariants();