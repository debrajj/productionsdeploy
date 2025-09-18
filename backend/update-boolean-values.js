const { getPayload } = require('payload')
const config = require('./src/payload.config.ts').default

async function updateBooleanValues() {
  try {
    console.log('🔧 Updating boolean values from CSV data...')
    
    const payload = await getPayload({ config })
    
    // Read the CSV file to get the correct boolean values
    const fs = require('fs')
    const path = require('path')
    const csvPath = path.join(process.cwd(), '../all.csv')
    
    const csvData = fs.readFileSync(csvPath, 'utf8')
    const lines = csvData.split('\n').filter(line => line.trim())
    
    console.log(`📄 Processing ${lines.length} CSV lines`)
    
    let updatedCount = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        // Parse CSV line
        const values = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        values.push(current.trim())
        
        if (values.length < 15) continue
        
        const productName = values[0]?.replace(/"/g, '').trim()
        if (!productName) continue
        
        // Parse boolean values from CSV (positions based on your CSV structure)
        const featured = values[15]?.toLowerCase().trim() === 'true'
        const trending = values[16]?.toLowerCase().trim() === 'true'  
        const bestSeller = values[17]?.toLowerCase().trim() === 'true'
        const lovedByExperts = values[18]?.toLowerCase().trim() === 'true'
        const onSale = values[19]?.toLowerCase().trim() === 'true'
        
        console.log(`📦 ${productName}:`, {
          featured, trending, bestSeller, lovedByExperts, onSale
        })
        
        // Find the product in database
        const existingProducts = await payload.find({
          collection: 'products',
          where: {
            name: {
              equals: productName
            }
          },
          limit: 1
        })
        
        if (existingProducts.docs.length > 0) {
          const product = existingProducts.docs[0]
          
          // Update with correct boolean values
          await payload.update({
            collection: 'products',
            id: product.id,
            data: {
              featured,
              trending,
              bestSeller,
              lovedByExperts,
              onSale
            }
          })
          
          console.log(`✅ Updated ${productName}`)
          updatedCount++
        } else {
          console.log(`❌ Product not found: ${productName}`)
        }
        
      } catch (error) {
        console.error(`Error processing line ${i + 1}:`, error.message)
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} products`)
    
    // Test the results
    const bestSellers = await payload.find({
      collection: 'products',
      where: {
        bestSeller: {
          equals: true
        }
      },
      limit: 5
    })
    
    const lovedByExperts = await payload.find({
      collection: 'products',
      where: {
        lovedByExperts: {
          equals: true
        }
      },
      limit: 5
    })
    
    console.log(`\n📊 Results:`)
    console.log(`✅ Best Sellers: ${bestSellers.docs.length}`)
    console.log(`✅ Loved by Experts: ${lovedByExperts.docs.length}`)
    
    if (bestSellers.docs.length > 0) {
      console.log('\n🏆 Best Sellers:')
      bestSellers.docs.forEach(p => console.log(`  - ${p.name}`))
    }
    
    if (lovedByExperts.docs.length > 0) {
      console.log('\n❤️ Loved by Experts:')
      lovedByExperts.docs.forEach(p => console.log(`  - ${p.name}`))
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

updateBooleanValues()