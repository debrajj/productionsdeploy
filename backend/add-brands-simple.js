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
  if (!process.env.BACKEND_URL) {
    console.error('❌ BACKEND_URL environment variable is required');
    console.log('Set it like: BACKEND_URL=https://yourdomain.com node add-brands-simple.js');
    process.exit(1);
  }
  
  const API_BASE = `${process.env.BACKEND_URL}/api`
  
  for (const brandName of brands) {
    try {
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
        console.log(`Added brand: ${brandName}`)
      } else {
        console.log(`Failed to add brand: ${brandName}`)
      }
    } catch (error) {
      console.error(`Error adding ${brandName}:`, error.message)
    }
  }
  
  console.log('Finished adding brands!')
}

addBrands()