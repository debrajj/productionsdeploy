const fs = require('fs')
const FormData = require('form-data')
const fetch = require('node-fetch')

async function testBulkImport() {
  try {
    console.log('🚀 Testing Bulk Import API...\n')
    
    // Check if template exists
    const templatePath = './product-import-template.xlsx'
    if (!fs.existsSync(templatePath)) {
      console.log('❌ Template file not found. Please run: node create-excel-template.js')
      return
    }
    
    console.log('📁 Found template file:', templatePath)
    
    // Create form data
    const form = new FormData()
    form.append('file', fs.createReadStream(templatePath))
    
    console.log('📤 Uploading to bulk import API...')
    
    // Make API call
    const response = await fetch('http://localhost:3000/api/bulk-import', {
      method: 'POST',
      body: form,
    })
    
    const result = await response.json()
    
    console.log('📊 Import Results:')
    console.log(`✅ Successfully imported: ${result.success} products`)
    
    if (result.errors && result.errors.length > 0) {
      console.log(`❌ Errors (${result.errors.length}):`)
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    console.log('\n🎉 Bulk import test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Make sure your server is running: npm run dev')
  }
}

// Run if called directly
if (require.main === module) {
  testBulkImport()
}

module.exports = { testBulkImport }