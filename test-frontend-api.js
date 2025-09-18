// Simple test to check what the frontend API is doing
console.log('Testing Frontend API Calls...\n');

const API_BASE = 'http://localhost:3000/api';

// Test Best Sellers
const bestSellersUrl = `${API_BASE}/products?where[bestSeller][equals]=true&depth=2&limit=8`;
console.log('Best Sellers URL:', bestSellersUrl);

// Test Loved by Experts  
const expertsUrl = `${API_BASE}/products?where[lovedByExperts][equals]=true&depth=2&limit=4`;
console.log('Loved by Experts URL:', expertsUrl);

console.log('\n🔧 To fix the issue:');
console.log('1. Make sure your backend server is running: cd backend && npm run dev');
console.log('2. Test these URLs in your browser');
console.log('3. Check if they return products with the correct boolean values');

console.log('\n📝 Expected response format:');
console.log('{');
console.log('  "docs": [');
console.log('    {');
console.log('      "id": "...",');
console.log('      "name": "Product Name",');
console.log('      "bestSeller": true,');
console.log('      "lovedByExperts": true');
console.log('    }');
console.log('  ],');
console.log('  "totalDocs": 45');
console.log('}');