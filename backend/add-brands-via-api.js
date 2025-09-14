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

async function addBrandsToPayload() {
  if (!process.env.BACKEND_URL) {
    console.error('❌ BACKEND_URL environment variable is required');
    console.log('Set it like: BACKEND_URL=https://yourdomain.com node add-brands-via-api.js');
    process.exit(1);
  }
  
  const API_BASE = `${process.env.BACKEND_URL}/api`
  
  try {
    for (const brandName of allBrands) {
      const response = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: brandName,
          description: `${brandName} brand products`
        })
      })
      
      if (response.ok) {
        console.log(`✓ Added brand: ${brandName}`)
      } else {
        const error = await response.text()
        console.log(`✗ Failed to add ${brandName}: ${error}`)
      }
    }
    
    console.log('\n🎉 Finished processing all brands!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

addBrandsToPayload()