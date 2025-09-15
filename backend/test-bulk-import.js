const { getPayload } = require('payload')
const config = require('./dist/payload.config.js').default
const { importProductsFromExcel } = require('./dist/lib/bulk-import.js')
const path = require('path')

async function testBulkImport() {
  try {
    const payload = await getPayload({ config })
    
    console.log('Testing bulk import...')
    
    // Test with the demo template
    const templatePath = path.join(__dirname, '..', 'product-import-template.xlsx')
    const results = await importProductsFromExcel(payload, templatePath, true)
    
    console.log('Import Results:', results)
    console.log(`Successfully imported: ${results.success} products`)
    
    if (results.errors.length > 0) {
      console.log('Errors:')
      results.errors.forEach(error => console.log('- ' + error))
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
}

testBulkImport()