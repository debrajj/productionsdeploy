const fetch = require('node-fetch');

async function fixBooleanValues() {
  try {
    console.log('🔧 Fixing boolean values via API...')
    
    // Get all products
    const response = await fetch('http://localhost:3000/api/products?limit=1000')
    const data = await response.json()
    
    console.log(`📦 Found ${data.docs.length} products`)
    
    let fixedCount = 0
    
    for (const product of data.docs) {
      let needsUpdate = false
      const updates = { ...product }
      
      // Fix boolean fields
      const booleanFields = ['featured', 'trending', 'bestSeller', 'lovedByExperts', 'onSale']
      
      booleanFields.forEach(field => {
        const value = product[field]
        if (typeof value === 'string') {
          const cleanValue = value.toLowerCase().trim()
          const boolValue = cleanValue === 'true' || cleanValue === '1' || cleanValue === 'yes'
          updates[field] = boolValue
          needsUpdate = true
          console.log(`  ${product.name}: ${field} "${value}" → ${boolValue}`)
        }
      })
      
      if (needsUpdate) {
        // Update via Payload admin API (this won't work directly, need to use bulk process)
        console.log(`✅ Would fix ${product.name}`)
        fixedCount++
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`  Total products: ${data.docs.length}`)
    console.log(`  Need fixing: ${fixedCount}`)
    
    // Check current boolean values
    const bestSellers = data.docs.filter(p => p.bestSeller === true || p.bestSeller === 'true')
    const lovedByExperts = data.docs.filter(p => p.lovedByExperts === true || p.lovedByExperts === 'true')
    
    console.log(`\n🔍 Current status:`)
    console.log(`  Best Sellers (true): ${bestSellers.length}`)
    console.log(`  Loved by Experts (true): ${lovedByExperts.length}`)
    
    if (bestSellers.length > 0) {
      console.log('\n📦 Best Sellers:')
      bestSellers.slice(0, 5).forEach(p => console.log(`  - ${p.name} (${typeof p.bestSeller})`))
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixBooleanValues()