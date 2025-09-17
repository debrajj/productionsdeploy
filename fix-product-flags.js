const API_BASE = 'http://localhost:3000/api';

// Use native fetch if available, otherwise use a simple HTTP client
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

async function fixProductFlags() {
  try {
    console.log('🔍 Checking products in database...');
    
    // Get all products
    const response = await makeRequest(`${API_BASE}/products?limit=20`);
    const data = await response.json();
    
    console.log(`📊 Found ${data.totalDocs} total products`);
    
    if (!data.docs || data.docs.length === 0) {
      console.log('❌ No products found in database');
      return;
    }
    
    // Show current status
    console.log('\n📋 Current product flags:');
    data.docs.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   bestSeller: ${product.bestSeller || false}`);
      console.log(`   lovedByExperts: ${product.lovedByExperts || false}`);
      console.log(`   featured: ${product.featured || false}`);
      console.log(`   trending: ${product.trending || false}`);
    });
    
    // Update first 8 products as best sellers
    console.log('\n🏆 Setting first 8 products as Best Sellers...');
    for (let i = 0; i < Math.min(8, data.docs.length); i++) {
      const product = data.docs[i];
      try {
        const updateResponse = await makeRequest(`${API_BASE}/products/${product.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bestSeller: true,
            featured: true
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Updated ${product.name} as Best Seller`);
        } else {
          console.log(`❌ Failed to update ${product.name}: ${updateResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${product.name}:`, error.message);
      }
    }
    
    // Update first 4 products as loved by experts
    console.log('\n❤️ Setting first 4 products as Loved by Experts...');
    for (let i = 0; i < Math.min(4, data.docs.length); i++) {
      const product = data.docs[i];
      try {
        const updateResponse = await makeRequest(`${API_BASE}/products/${product.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lovedByExperts: true,
            trending: true
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Updated ${product.name} as Loved by Experts`);
        } else {
          console.log(`❌ Failed to update ${product.name}: ${updateResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${product.name}:`, error.message);
      }
    }
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    const bestSellersResponse = await makeRequest(`${API_BASE}/products?where[bestSeller][equals]=true`);
    const bestSellersData = await bestSellersResponse.json();
    console.log(`🏆 Best Sellers count: ${bestSellersData.totalDocs}`);
    
    const expertsResponse = await makeRequest(`${API_BASE}/products?where[lovedByExperts][equals]=true`);
    const expertsData = await expertsResponse.json();
    console.log(`❤️ Loved by Experts count: ${expertsData.totalDocs}`);
    
    console.log('\n✅ Product flags updated successfully!');
    console.log('🔄 Refresh your frontend to see the products in Best Sellers and Loved by Experts sections.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixProductFlags();