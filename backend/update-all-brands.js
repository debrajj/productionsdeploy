import { getPayload } from 'payload'
import config from './src/payload.config.ts'

const allBrands = [
  'ALPINO', 'AS-IT-IS', 'AVVATAR', 'AESTHETIC NUTRITION', 'BOLT', 'BPI', 'BEAST LIFE', 'DYMATIZE',
  'FAST AND UP', 'GASPARI', 'GAT', 'GNC', 'GHOST', 'HEALTH FARM', 'INTERNATIONAL PROTEIN', 'ISOPURE',
  'KAGED', 'KEVIN LEVRONE', 'LABRADA', 'MONSTER LAB', 'MUSCLE BLAZE', 'MUSCLETECH', 'MUTANT', 'MYFITNESS',
  'MYFITNESS PEANUT BUTTER', 'NEUHERBS', 'NAKPRO', 'ONE SCIENCE', 'ON (OPTIMUM NUTRITION)', 'POLE NUTRITION',
  'PROSUPPS', 'PINTOLA', 'RONNIE COLEMAN', 'RAW NUTRITION', 'RYSE', 'THE WHOLE TRUTH NUTRITION', 'WELLBEING',
  'XTEND', 'YOGABAR', 'RANBDS', 'APPLIED NUTRITION', 'BSN', 'DENIS JAMES', 'DEXTER JACKSON', 'EXALT',
  'INSANE LABZ', 'MHP', 'MI (MUSCLE IMPACT NUTRITION) 02 BRAND', 'NOW', 'NUTREX', 'NUTRAMARC', 'REDCON',
  'RULE ONE', 'UNIVERSAL', 'ATOM', 'TRUE BASICS', 'CLOMA PHARMA', 'CENTRUM', 'CONDEMNED', 'MUSCLEMEDS', 
  'ULTIMATE NUTRITION', 'FA ICE HYDRO', 'ANDROPIQUE', 'CUREGARDEN', 'TATA 1MG', 'ACE BLEND', 'NATUREYZ', 
  'HEALTHYHEY NUTRITION', 'MIDUTY', 'WHATS UP WELLNESS', 'MYODROL', 'CARBAMIDE FORTE', 'BEAUTYWISE', 
  'FUEL ONE', 'NAKPRO PROTEIN'
]

async function updateAllBrands() {
  try {
    const payload = await getPayload({ config })
    
    for (const brandName of allBrands) {
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
        console.log(`Brand exists: ${brandName}`)
      }
    }
    
    console.log('All brands updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error updating brands:', error)
    process.exit(1)
  }
}

updateAllBrands()