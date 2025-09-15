const FormData = require('form-data')
const fs = require('fs')

async function testBulkImport() {
  try {
    console.log('🧪 Testing bulk import API...')
    
    // Test template download first
    const templateResponse = await fetch('http://localhost:3000/api/download-template')
    if (templateResponse.ok) {
      console.log('✅ Template download works')
    } else {
      console.log('❌ Template download failed:', templateResponse.status)
    }
    
    // Test if CSV file exists
    if (fs.existsSync('./sample-products.csv')) {
      console.log('✅ CSV file found')
      
      const form = new FormData()
      form.append('file', fs.createReadStream('./sample-products.csv'))
      
      const importResponse = await fetch('http://localhost:3000/api/bulk-import', {
        method: 'POST',
        body: form
      })
      
      if (importResponse.ok) {
        const result = await importResponse.json()
        console.log('✅ Import result:', result)
      } else {
        console.log('❌ Import failed:', importResponse.status)
        const error = await importResponse.text()
        console.log('Error:', error)
      }
    } else {
      console.log('❌ CSV file not found')
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testBulkImport()