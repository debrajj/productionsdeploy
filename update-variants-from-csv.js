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

// Products with variants from CSV
const productsWithVariants = [
  {
    name: 'AVVATAR Whey Protein',
    simpleFlavors: 'Chocolate,Vanilla,Strawberry',
    variants: '[{"flavor":"Chocolate","weight":"1kg","price":2999},{"flavor":"Vanilla","weight":"1kg","price":2999},{"flavor":"Strawberry","weight":"1kg","price":2999},{"flavor":"Chocolate","weight":"2kg","price":5499}]'
  },
  {
    name: 'MUSCLETECH Mass Gainer',
    simpleFlavors: 'Chocolate,Vanilla',
    variants: '[{"flavor":"Chocolate","weight":"3kg","price":3299},{"flavor":"Vanilla","weight":"3kg","price":3299},{"flavor":"Chocolate","weight":"6kg","price":5999}]'
  },
  {
    name: 'ON (OPTIMUM NUTRITION) Pre-Workout',
    simpleFlavors: 'Fruit Punch,Blue Razz',
    variants: '[{"flavor":"Fruit Punch","weight":"300g","price":2499},{"flavor":"Blue Razz","weight":"300g","price":2499},{"flavor":"Watermelon","weight":"300g","price":2499}]'
  },
  {
    name: 'BSN Amino Acids',
    simpleFlavors: 'Orange,Lemon'
  },
  {
    name: 'DYMATIZE Protein',
    simpleFlavors: 'Chocolate,Vanilla,Cookies'
  },
  {
    name: 'GHOST Protein',
    simpleFlavors: 'Cereal Milk,Peanut Butter',
    variants: '[{"flavor":"Cereal Milk","weight":"2kg","price":3299},{"flavor":"Peanut Butter","weight":"2kg","price":3299},{"flavor":"Cereal Milk","weight":"1kg","price":1899}]'
  },
  {
    name: 'LABRADA Mass Gainer',
    simpleFlavors: 'Chocolate,Vanilla,Strawberry',
    variants: '[{"flavor":"Chocolate","weight":"6kg","price":4199},{"flavor":"Vanilla","weight":"6kg","price":4199},{"flavor":"Strawberry","weight":"6kg","price":4199},{"flavor":"Chocolate","weight":"3kg","price":2499}]'
  }
];

async function updateVariants() {
  try {
    console.log('🔍 Updating products with variants and flavors...');
    
    let updatedCount = 0;
    
    for (const productData of productsWithVariants) {
      try {
        // Find product by name
        const searchResponse = await makeRequest(`${API_BASE}/products?where[name][contains]=${encodeURIComponent(productData.name)}&limit=1`);
        const searchResult = await searchResponse.json();
        
        if (!searchResult.docs || searchResult.docs.length === 0) {
          console.log(`❌ Product not found: ${productData.name}`);
          continue;
        }
        
        const product = searchResult.docs[0];
        console.log(`\n📦 Updating: ${product.name}`);
        
        let updateData = {};
        
        // Add simple flavors
        if (productData.simpleFlavors) {
          updateData.simpleFlavors = productData.simpleFlavors;
          console.log(`   ✅ Adding simpleFlavors: ${productData.simpleFlavors}`);
        }
        
        // Add variants if they exist
        if (productData.variants) {
          try {
            const parsedVariants = JSON.parse(productData.variants);
            updateData.variants = parsedVariants;
            console.log(`   ✅ Adding ${parsedVariants.length} variants`);
          } catch (e) {
            console.log(`   ❌ Failed to parse variants: ${e.message}`);
          }
        }
        
        if (Object.keys(updateData).length > 0) {
          const updateResponse = await makeRequest(`${API_BASE}/products/${product.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });
          
          if (updateResponse.ok) {
            console.log(`   ✅ Successfully updated ${product.name}`);
            updatedCount++;
          } else {
            const errorText = await updateResponse.text();
            console.log(`   ❌ Failed to update ${product.name}: ${updateResponse.status} - ${errorText}`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Error processing ${productData.name}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} products with variants/flavors`);
    console.log('🔄 Refresh your frontend and check product detail pages to see variants and flavors');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateVariants();