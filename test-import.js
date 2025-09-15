const { getPayload } = require('payload')
const config = require('./backend/dist/payload.config.js').default

async function testImport() {
  try {
    const payload = await getPayload({ config })
    
    console.log('✅ Testing direct product creation...')
    
    const testProduct = {
      name: 'Test Whey Protein',
      slug: 'test-whey-protein',
      imageType: 'url',
      imageUrl: 'https://example.com/test.jpg',
      price: 2999,
      category: 'SPORTS NUTRITION',
      subcategory: 'Proteins',
      brand: 'MUSCLETECH',
      description: 'Test product for bulk import',
      featured: true,
      bestSeller: true,
      shopByGoal: 'MUSCLE_GAIN'
    }
    
    const result = await payload.create({
      collection: 'products',
      data: testProduct
    })
    
    console.log('✅ Product created:', result.id)
    console.log('📦 Product name:', result.name)
    
    // Check if it appears in API
    const products = await payload.find({
      collection: 'products',
      limit: 5
    })
    
    console.log('📊 Total products in DB:', products.totalDocs)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testImport()