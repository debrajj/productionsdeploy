const fetch = require('node-fetch')

async function debugProducts() {
  try {
    console.log('🔍 Checking products in database...\n')
    
    // Check products API
    const response = await fetch('http://localhost:3000/api/products?limit=10')
    
    if (!response.ok) {
      console.log('❌ API Error:', response.status, response.statusText)
      return
    }
    
    const data = await response.json()
    
    console.log('📊 API Response:')
    console.log('- Total products:', data.totalDocs || 0)
    console.log('- Current page:', data.page || 1)
    console.log('- Total pages:', data.totalPages || 0)
    
    if (data.docs && data.docs.length > 0) {
      console.log('\n📦 Recent products:')
      data.docs.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.brand})`)
      })
    } else {
      console.log('\n❌ No products found in database')
      console.log('\n💡 Possible issues:')
      console.log('1. Products not imported yet')
      console.log('2. Import failed silently')
      console.log('3. Database connection issue')
      console.log('4. API endpoint not working')
    }
    
    // Check if bulk import collection exists
    console.log('\n🔍 Checking bulk imports...')
    const bulkResponse = await fetch('http://localhost:3000/api/bulk-import')
    
    if (bulkResponse.ok) {
      const bulkData = await bulkResponse.json()
      console.log('- Bulk imports found:', bulkData.totalDocs || 0)
    } else {
      console.log('- Bulk import API not accessible')
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message)
    console.log('\n💡 Make sure your server is running: npm run dev')
  }
}

debugProducts()