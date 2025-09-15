const FormData = require('form-data')
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function processLatestFile() {
  try {
    console.log('🔍 Finding latest uploaded CSV...')
    
    // Find the latest CSV file in media directory
    const mediaDir = './backend/media'
    const files = fs.readdirSync(mediaDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
        name: file,
        path: `${mediaDir}/${file}`,
        time: fs.statSync(`${mediaDir}/${file}`).mtime
      }))
      .sort((a, b) => b.time - a.time)
    
    if (files.length === 0) {
      console.log('❌ No CSV files found')
      return
    }
    
    const latestFile = files[0]
    console.log('📄 Latest file:', latestFile.name)
    
    // Process via API
    const form = new FormData()
    form.append('file', fs.createReadStream(latestFile.path))
    
    console.log('📤 Processing via API...')
    const response = await fetch('http://localhost:3000/api/bulk-import', {
      method: 'POST',
      body: form
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Processing completed!')
      console.log(`📊 Success: ${result.success} products`)
      console.log(`❌ Errors: ${result.errors?.length || 0}`)
      
      if (result.errors?.length > 0) {
        result.errors.forEach(error => console.log('  -', error))
      }
      
      console.log('\n🎉 Check Products collection in admin!')
    } else {
      console.log('❌ Processing failed:', response.status)
      const error = await response.text()
      console.log('Error:', error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

processLatestFile()