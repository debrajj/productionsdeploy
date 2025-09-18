import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Read CSV from file system
    const fs = require('fs')
    const path = require('path')
    const csvPath = path.join(process.cwd(), 'all.csv')
    
    let csvData
    try {
      csvData = fs.readFileSync(csvPath, 'utf8')
    } catch (error) {
      return NextResponse.json({ error: 'CSV file not found' }, { status: 400 })
    }
    
    const lines = csvData.split('\n').filter(line => line.trim())
    
    console.log(`Starting to process ${lines.length} lines from CSV data`)
    
    let successCount = 0
    let errorCount = 0
    let duplicateCount = 0
    const errors = []
    const duplicates = []
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        // Parse CSV line with proper handling of quoted values
        const values = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        values.push(current.trim())
        
        if (values.length < 6) continue
        
        // Helper function to detect boolean values
        const parseBoolean = (value: string) => {
          if (!value) return false
          const cleanValue = value.toString().trim().toLowerCase()
          return cleanValue === 'true' || cleanValue === '1' || cleanValue === 'yes'
        }
        
        const productData = {
          name: values[0]?.replace(/"/g, '').trim(),
          price: parseFloat(values[1]) || 0,
          originalPrice: parseFloat(values[2]) || undefined,
          category: values[3]?.replace(/"/g, '').trim(),
          subcategory: values[4]?.replace(/"/g, '').trim(),
          brand: values[5]?.replace(/"/g, '').trim(),
          description: values[6]?.replace(/"/g, '').trim() || 'Product description',
          image: values[7]?.replace(/"/g, '').trim(),
          rating: parseFloat(values[9]) || 4.0,
          reviews: parseInt(values[10]) || 0,
          weight: values[11]?.replace(/"/g, '').trim(),
          simpleFlavors: values[12]?.replace(/"/g, '').trim(),
          // Store variants as JSON string
          variants: values[13] && values[13] !== '[]' ? values[13].replace(/\\/g, '') : '[]',
          // Boolean fields
          featured: parseBoolean(values[14]),
          trending: parseBoolean(values[15]),
          bestSeller: parseBoolean(values[16]),
          lovedByExperts: parseBoolean(values[17]),
          onSale: parseBoolean(values[18]),
          shopByGoal: values[19]?.replace(/"/g, '').trim() || 'HEALTH_WELLNESS',
          nutritionInfo: values[20]?.replace(/"/g, '').trim(),
          ingredients: values[21]?.replace(/"/g, '').trim(),
          certifications: values[22] ? JSON.stringify([{ name: values[22].replace(/"/g, '').trim() }]) : '[]',
          nutritionImage: values[23]?.replace(/"/g, '').trim(),
          slug: values[24]?.replace(/"/g, '').trim(),
          // Store additional images as JSON string
          images: values[8] ? JSON.stringify(values[8].split(',').map(url => url.trim().replace(/"/g, ''))) : '[]'
        }
        
        console.log(`Processing row ${i + 1}:`, {
          name: productData.name,
          price: productData.price,
          brand: productData.brand,
          category: productData.category
        })
        
        if (!productData.name || !productData.price) {
          throw new Error(`Missing required fields: name=${productData.name}, price=${productData.price}`)
        }
        
        // Check for duplicates first
        const existingProduct = await payload.find({
          collection: 'products',
          where: {
            name: {
              equals: productData.name
            }
          },
          limit: 1
        })
        
        if (existingProduct.docs.length > 0) {
          console.log(`🔄 Duplicate found, skipping: ${productData.name}`)
          duplicateCount++
          duplicates.push(productData.name)
          continue
        }
        
        console.log('Creating product:', productData.name)
        
        const createdProduct = await payload.create({
          collection: 'products',
          data: productData,
        })
        
        console.log(`✅ Successfully created product: ${createdProduct.id} - ${productData.name}`)
        successCount++
        
      } catch (error) {
        console.error(`❌ Error processing row ${i + 1}:`, error.message)
        errorCount++
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }
    
    console.log(`Processing completed: ${successCount} success, ${errorCount} errors, ${duplicateCount} duplicates`)
    
    return NextResponse.json({
      success: true,
      successCount,
      errorCount,
      duplicateCount,
      duplicates: duplicates.slice(0, 10),
      errors: errors.slice(0, 10),
      message: `✅ Added: ${successCount} | ❌ Failed: ${errorCount} | 🔄 Duplicates Skipped: ${duplicateCount}`,
      buttonColor: '#22c55e',
      buttonStyle: 'background-color: #22c55e; color: white; border: none;',
      details: {
        totalProcessed: successCount + errorCount + duplicateCount,
        summary: `Successfully added ${successCount} products, ${errorCount} failed, ${duplicateCount} duplicates skipped`
      }
    })
    
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}