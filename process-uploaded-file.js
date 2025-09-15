const FormData = require('form-data')
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function processFile() {
  try {
    console.log('📤 Processing uploaded CSV file...')
    
    const form = new FormData()
    form.append('file', fs.createReadStream('./sample-products.csv'))
    
    const response = await fetch('http://localhost:3000/api/bulk-import', {
      method: 'POST',
      body: form
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Import completed!')
      console.log(`📊 Success: ${result.success} products`)
      console.log(`❌ Errors: ${result.errors?.length || 0}`)
      
      if (result.errors?.length > 0) {
        console.log('Errors:', result.errors)
      }
    } else {
      console.log('❌ Import failed:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

processFile()