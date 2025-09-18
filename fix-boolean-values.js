const { getPayload } = require('payload')
const config = require('./backend/src/payload.config.ts').default

async function fixBooleanValues() {
  try {
    console.log('🔧 Starting boolean values fix...')
    
    const payload = await getPayload({ config })
    
    // Get all products
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
    })
    
    console.log(`📦 Found ${products.docs.length} products to check`)
    
    let fixedCount = 0
    
    for (const product of products.docs) {
      let needsUpdate = false
      const updates = {}
      
      // Check and fix boolean fields
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
        await payload.update({
          collection: 'products',
          id: product.id,
          data: updates,
        })
        fixedCount++
        console.log(`✅ Fixed ${product.name}`)
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} products with boolean values`)
    
    // Test the API endpoints
    console.log('\n🧪 Testing API endpoints...')
    
    const bestSellers = await payload.find({
      collection: 'products',
      where: {
        bestSeller: {
          equals: true
        }
      },
      limit: 3
    })
    
    const lovedByExperts = await payload.find({
      collection: 'products',
      where: {
        lovedByExperts: {
          equals: true
        }
      },
      limit: 3
    })
    
    console.log(`✅ Best Sellers found: ${bestSellers.docs.length}`)
    console.log(`✅ Loved by Experts found: ${lovedByExperts.docs.length}`)
    
    if (bestSellers.docs.length > 0) {
      console.log('📦 Best Sellers:')
      bestSellers.docs.forEach(p => console.log(`  - ${p.name}`))
    }
    
    if (lovedByExperts.docs.length > 0) {
      console.log('📦 Loved by Experts:')
      lovedByExperts.docs.forEach(p => console.log(`  - ${p.name}`))
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixBooleanValues()