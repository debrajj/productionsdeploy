import { getPayload } from 'payload'
import config from './src/payload.config.ts'

const brands = [
  'Atom',
  'True basics',
  'Nakpro',
  'Cloma pharma',
  'Centrum',
  'Condemned',
  'Musclemeds',
  'Ultimate nutrition',
  'Universal',
  'Fa ice hydro',
  'ANDROPIQUE'
]

async function addBrands() {
  try {
    const payload = await getPayload({ config })
    
    for (const brandName of brands) {
      // Check if brand already exists
      const existing = await payload.find({
        collection: 'brands',
        where: {
          name: {
            equals: brandName
          }
        }
      })
      
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'brands',
          data: {
            name: brandName,
            description: `${brandName} brand products`
          }
        })
        console.log(`Added brand: ${brandName}`)
      } else {
        console.log(`Brand already exists: ${brandName}`)
      }
    }
    
    console.log('All brands processed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error adding brands:', error)
    process.exit(1)
  }
}

addBrands()