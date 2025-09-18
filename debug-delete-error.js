const fetch = require('node-fetch');

// Test multiple product deletion
async function testMultipleDelete() {
  try {
    console.log('🔍 Testing multiple product deletion...');
    
    // First, get some products to delete
    const response = await fetch('http://localhost:3000/api/products?limit=5');
    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      console.log('❌ No products found to test deletion');
      return;
    }
    
    console.log(`📦 Found ${data.docs.length} products for testing`);
    
    // Test individual product deletion
    const productToDelete = data.docs[0];
    console.log(`🧪 Testing deletion of product: ${productToDelete.name} (ID: ${productToDelete.id})`);
    
    // Try to delete via API
    const deleteResponse = await fetch(`http://localhost:3000/api/products/${productToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (deleteResponse.ok) {
      const deleteResult = await deleteResponse.json();
      console.log('✅ Single product deletion successful:', deleteResult);
    } else {
      const errorText = await deleteResponse.text();
      console.log('❌ Single product deletion failed:', deleteResponse.status, errorText);
    }
    
    // Test bulk deletion endpoint
    console.log('\n🧪 Testing bulk deletion endpoint...');
    const bulkDeleteResponse = await fetch('http://localhost:3000/api/products/delete-all', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (bulkDeleteResponse.ok) {
      const bulkResult = await bulkDeleteResponse.json();
      console.log('✅ Bulk deletion successful:', bulkResult);
    } else {
      const bulkErrorText = await bulkDeleteResponse.text();
      console.log('❌ Bulk deletion failed:', bulkDeleteResponse.status, bulkErrorText);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Test payload admin access
async function testPayloadAdmin() {
  try {
    console.log('\n🔍 Testing Payload admin access...');
    
    const adminResponse = await fetch('http://localhost:3000/admin');
    console.log(`Admin interface status: ${adminResponse.status}`);
    
    if (adminResponse.status === 200) {
      console.log('✅ Payload admin interface is accessible');
    } else {
      console.log('❌ Payload admin interface issue');
    }
    
  } catch (error) {
    console.error('❌ Admin access error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting multiple product delete diagnostics...\n');
  
  await testPayloadAdmin();
  await testMultipleDelete();
  
  console.log('\n📋 COMMON SOLUTIONS FOR MULTIPLE DELETE ERRORS:');
  console.log('1. Check if you have proper authentication in Payload admin');
  console.log('2. Verify database connection is stable');
  console.log('3. Check if there are any validation errors on products');
  console.log('4. Look for foreign key constraints or relationships');
  console.log('5. Check browser console for JavaScript errors');
  console.log('6. Verify user permissions for delete operations');
  
  console.log('\n🔧 TO FIX THE ISSUE:');
  console.log('1. Go to http://localhost:3000/admin');
  console.log('2. Login with your admin credentials');
  console.log('3. Try deleting products one by one first');
  console.log('4. Check browser developer tools for error details');
  console.log('5. If bulk delete fails, use the /api/products/delete-all endpoint');
}

main().catch(console.error);