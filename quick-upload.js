const FormData = require('form-data')
const fs = require('fs')
const fetch = require('node-fetch')

async function quickUpload() {
  try {
    console.log('🚀 Quick CSV upload test...')
    
    if (!fs.existsSync('./sample-products.csv')) {
      console.log('❌ CSV file not found')
      return
    }
    
    const form = new FormData()
    form.append('file', fs.createReadStream('./sample-products.csv'))
    
    const response = await fetch('http://localhost:3000/api/bulk-import', {
      method: 'POST',
      body: form
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Upload successful!')
      console.log('📊 Results:', result)
    } else {
      console.log('❌ Upload failed:', response.status)
      const error = await response.text()
      console.log('Error:', error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

quickUpload()