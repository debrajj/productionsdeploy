// Test script to check Optimum Nutrition products
const { getBrandSlug, getBrandFromSlug } = require('./backend/shared-brands.js');

console.log('Testing brand slug conversion:');
console.log('Brand: ON (OPTIMUM NUTRITION)');
console.log('Slug:', getBrandSlug('ON (OPTIMUM NUTRITION)'));
console.log('Back to brand:', getBrandFromSlug('on-optimum-nutrition'));
console.log('');

// Test API call
async function testOptimumNutritionProducts() {
  try {
    console.log('Testing API call for all products...');
    const response = await fetch('http://localhost:3000/api/products?limit=10');
    
    if (!response.ok) {
      console.error('API call failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Total products found:', data.totalDocs);
    
    // Filter for Optimum Nutrition products
    const onProducts = data.docs.filter(product => 
      product.brand === 'ON (OPTIMUM NUTRITION)' || 
      (product.brand === 'other' && product.customBrand === 'ON (OPTIMUM NUTRITION)')
    );
    
    console.log('Optimum Nutrition products found:', onProducts.length);
    
    if (onProducts.length > 0) {
      console.log('Optimum Nutrition products:');
      onProducts.forEach(product => {
        console.log(`- ${product.name} (Brand: ${product.brand}${product.customBrand ? ', Custom: ' + product.customBrand : ''})`);
      });
    } else {
      console.log('No Optimum Nutrition products found');
      console.log('Available brands in first 10 products:');
      data.docs.forEach(product => {
        console.log(`- ${product.name}: Brand="${product.brand}"${product.customBrand ? ', Custom="' + product.customBrand + '"' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testOptimumNutritionProducts();