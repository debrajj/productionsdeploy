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
    console.log('🔍 Fetching products with variants...');
    
    const response = await makeRequest(`${API_BASE}/products?limit=100`);
    const data = await response.json();
    
    console.log(`📊 Found ${data.totalDocs} products`);
    
    let fixedCount = 0;
    
    for (const product of data.docs) {
      let needsUpdate = false;
      let updateData = {};
      
      // Fix variants if they're strings
      if (product.variants && typeof product.variants === 'string') {
        try {
          const parsedVariants = JSON.parse(product.variants);
          if (Array.isArray(parsedVariants)) {
            updateData.variants = parsedVariants;
            needsUpdate = true;
            console.log(`🔧 Fixing variants for: ${product.name}`);
          }
        } catch (e) {
          console.log(`❌ Failed to parse variants for ${product.name}:`, e.message);
        }
      }
      
      // Fix ingredients if they're strings
      if (product.ingredients && typeof product.ingredients === 'string') {
        // Convert comma-separated string to array
        const ingredientsArray = product.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing);
        updateData.ingredients = ingredientsArray;
        needsUpdate = true;
        console.log(`🔧 Fixing ingredients for: ${product.name}`);
      }
      
      if (needsUpdate) {
        try {
          const updateResponse = await makeRequest(`${API_BASE}/products/${product.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated ${product.name}`);
            fixedCount++;
          } else {
            console.log(`❌ Failed to update ${product.name}: ${updateResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Error updating ${product.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} products with variant/ingredient issues`);
    console.log('🔄 Refresh your frontend to see the variants and flavors in product details');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVariants();