#!/usr/bin/env node

/**
 * Debug script to test product loading issues
 * Run with: node debug-product-loading.js
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testProductLoading() {
  console.log('🔍 Testing Product Loading Issues...\n');

  // Test 1: Check if backend is running
  console.log('1. Testing backend connectivity...');
  try {
    const response = await fetch(`${API_BASE}/products?limit=1`);
    if (response.ok) {
      console.log('✅ Backend is running and accessible');
      const data = await response.json();
      console.log(`   Found ${data.totalDocs || 0} products total`);
    } else {
      console.log(`❌ Backend returned status: ${response.status}`);
      const text = await response.text();
      console.log(`   Error: ${text}`);
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure backend is running on port 3000');
    return;
  }

  // Test 2: Get a sample product by ID
  console.log('\n2. Testing product by ID...');
  try {
    const productsResponse = await fetch(`${API_BASE}/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (productsData.docs && productsData.docs.length > 0) {
      const sampleProduct = productsData.docs[0];
      console.log(`   Testing with product ID: ${sampleProduct.id}`);
      
      const productResponse = await fetch(`${API_BASE}/products/${sampleProduct.id}?depth=2`);
      if (productResponse.ok) {
        const productData = await productResponse.json();
        console.log('✅ Product loaded successfully by ID');
        console.log(`   Product: ${productData.name}`);
        console.log(`   Image: ${productData.image}`);
        console.log(`   Price: ₹${productData.price}`);
      } else {
        console.log(`❌ Failed to load product by ID: ${productResponse.status}`);
        const errorText = await productResponse.text();
        console.log(`   Error: ${errorText}`);
      }
    } else {
      console.log('❌ No products found in database');
    }
  } catch (error) {
    console.log(`❌ Error testing product by ID: ${error.message}`);
  }

  // Test 3: Test product by slug
  console.log('\n3. Testing product by slug...');
  try {
    const productsResponse = await fetch(`${API_BASE}/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (productsData.docs && productsData.docs.length > 0) {
      const sampleProduct = productsData.docs[0];
      if (sampleProduct.slug) {
        console.log(`   Testing with slug: ${sampleProduct.slug}`);
        
        const slugResponse = await fetch(`${API_BASE}/products?where[slug][equals]=${encodeURIComponent(sampleProduct.slug)}&depth=2&limit=1`);
        if (slugResponse.ok) {
          const slugData = await slugResponse.json();
          if (slugData.docs && slugData.docs.length > 0) {
            console.log('✅ Product loaded successfully by slug');
            console.log(`   Product: ${slugData.docs[0].name}`);
          } else {
            console.log('❌ No product found with this slug');
          }
        } else {
          console.log(`❌ Failed to load product by slug: ${slugResponse.status}`);
        }
      } else {
        console.log('⚠️  Sample product has no slug');
      }
    }
  } catch (error) {
    console.log(`❌ Error testing product by slug: ${error.message}`);
  }

  // Test 4: Check for common data issues
  console.log('\n4. Checking for data issues...');
  try {
    const response = await fetch(`${API_BASE}/products?limit=10`);
    const data = await response.json();
    
    if (data.docs) {
      let issuesFound = 0;
      
      data.docs.forEach((product, index) => {
        const issues = [];
        
        if (!product.name) issues.push('Missing name');
        if (!product.price) issues.push('Missing price');
        if (!product.slug) issues.push('Missing slug');
        if (typeof product.image === 'object') issues.push('Image is object instead of string');
        
        if (issues.length > 0) {
          console.log(`   Product ${index + 1} (ID: ${product.id}): ${issues.join(', ')}`);
          issuesFound++;
        }
      });
      
      if (issuesFound === 0) {
        console.log('✅ No data issues found in sample products');
      } else {
        console.log(`⚠️  Found issues in ${issuesFound} products`);
      }
    }
  } catch (error) {
    console.log(`❌ Error checking data issues: ${error.message}`);
  }

  // Test 5: Test frontend API transformation
  console.log('\n5. Testing frontend API transformation...');
  try {
    const response = await fetch(`${API_BASE}/products?limit=1&depth=2`);
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      const product = data.docs[0];
      console.log('   Raw product data structure:');
      console.log(`   - ID: ${product.id}`);
      console.log(`   - Name: ${product.name}`);
      console.log(`   - Image type: ${typeof product.image}`);
      console.log(`   - Image value: ${JSON.stringify(product.image)}`);
      console.log(`   - Price: ${product.price}`);
      console.log(`   - Slug: ${product.slug}`);
      
      // Simulate frontend transformation
      let transformedImage = product.image;
      if (typeof product.image === 'object' && product.image?.filename) {
        transformedImage = `/media/${product.image.filename}`;
        console.log(`   - Transformed image: ${transformedImage}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error testing transformation: ${error.message}`);
  }

  console.log('\n🔍 Debug complete!');
  console.log('\nNext steps:');
  console.log('1. Make sure backend is running: cd backend && npm run dev');
  console.log('2. Check browser console for detailed errors');
  console.log('3. Verify product data in admin panel: http://localhost:3000/admin');
}

// Run the debug script
testProductLoading().catch(console.error);