const FormData = require('form-data')
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function directImport() {
  try {
    console.log('📤 Direct CSV import...')
    
    // Use the working CSV file
    const csvPath = './working-products.csv'
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ File not found:', csvPath)
      return
    }
    
    const form = new FormData()
    form.append('file', fs.createReadStream(csvPath))
    
    const response = await fetch('http://localhost:3000/api/bulk-import', {
      method: 'POST',
      body: form
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Import successful!')
      console.log(`📊 Success: ${result.success} products`)
      console.log(`❌ Errors: ${result.errors?.length || 0}`)
      
      if (result.errors?.length > 0) {
        result.errors.forEach(error => console.log('Error:', error))
      }
    } else {
      console.log('❌ Import failed:', response.status)
      const error = await response.text()
      console.log('Error details:', error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

directImport()