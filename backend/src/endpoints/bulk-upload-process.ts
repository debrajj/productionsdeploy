import { Endpoint } from 'payload/config'
import fs from 'fs'
import path from 'path'

const processCSVFile = async (id: string, payload: any) => {
  try {
    // Get the bulk upload record
    const bulkUpload = await payload.findByID({
      collection: 'bulk-upload',
      id,
    })
    
    if (!bulkUpload) {
      throw new Error('Bulk upload record not found')
    }
    
    // Get the uploaded file
    const fileDoc = await payload.findByID({
      collection: 'media',
      id: bulkUpload.file,
    })
    
    if (!fileDoc) {
      throw new Error('File not found')
    }
    
    const filePath = path.join(process.cwd(), 'media', fileDoc.filename)
    
    // Read CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lines = fileContent.split('\n')
    
    // Parse CSV properly handling quoted values
    const parseCSVLine = (line: string) => {
      const result = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }
    
    const headers = parseCSVLine(lines[0])
    console.log('CSV Headers:', headers)
    console.log('Total lines in CSV:', lines.length)
    
    let successCount = 0
    let errorCount = 0
    let duplicateCount = 0
    const errors = []
    const duplicates = []
    
    // Check if first line looks like data instead of headers
    if (headers[0] && !isNaN(parseFloat(headers[1]))) {
      console.log('First line appears to be data, not headers. Using default headers.')
      // Use default headers based on your CSV structure
      const defaultHeaders = ['name', 'price', 'originalPrice', 'category', 'subcategory', 'brand', 'description', 'mainImage', 'images', 'rating', 'reviews', 'weight', 'simpleFlavors', 'variants', 'featured', 'trending', 'bestSeller', 'lovedByExperts', 'onSale', 'shopByGoal', 'nutritionInfo', 'ingredients', 'certifications', 'nutritionImage', 'slug']
      headers.splice(0, headers.length, ...defaultHeaders)
      console.log('Using default headers:', headers)
    }
    
    // Update status to processing
    await payload.update({
      collection: 'bulk-upload',
      id,
      data: {
        status: 'processing',
        results: `Processing ${lines.length - startRow} products...\n\n📊 Progress:\n✅ Added: 0\n❌ Failed: 0\n🔄 Duplicates Skipped: 0`,
      },
    })
    
    // Process each row (start from 0 if using default headers, 1 if real headers)
    const startRow = (headers[0] === 'name') ? 1 : 0
    console.log('Starting processing from row:', startRow)
    
    for (let i = startRow; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        const values = parseCSVLine(line)
        console.log(`Processing row ${i + 1}:`, values.slice(0, 3)) // Log first 3 values
        const productData: any = {}
        
        // Helper function to detect boolean values
        const parseBoolean = (value: string) => {
          if (!value) return false
          const cleanValue = value.toString().trim().toLowerCase()
          return cleanValue === 'true' || cleanValue === '1' || cleanValue === 'yes'
        }
        
        // Map CSV columns to product fields
        headers.forEach((header, index) => {
          const cleanHeader = header.trim().toLowerCase()
          const value = values[index]?.trim()
          
          if (index < 5) { // Log first 5 mappings for debugging
            console.log(`  ${cleanHeader}: ${value}`)
          }
          
          switch (cleanHeader) {
            case 'name':
              productData.name = value
              break
            case 'price':
              productData.price = parseFloat(value) || 0
              break
            case 'originalprice':
              productData.originalPrice = parseFloat(value) || undefined
              break
            case 'category':
              productData.category = value
              break
            case 'subcategory':
              productData.subcategory = value
              break
            case 'brand':
              productData.brand = value
              break
            case 'description':
              productData.description = value
              break
            case 'mainimage':
              productData.imageType = 'url'
              productData.imageUrl = value
              break
            case 'rating':
              productData.rating = parseFloat(value) || 0
              break
            case 'reviews':
              productData.reviews = parseInt(value) || 0
              break
            case 'featured':
              productData.featured = parseBoolean(value)
              break
            case 'trending':
              productData.trending = parseBoolean(value)
              break
            case 'bestseller':
              productData.bestSeller = parseBoolean(value)
              break
            case 'lovedbyexperts':
              productData.lovedByExperts = parseBoolean(value)
              break
            case 'onsale':
              productData.onSale = parseBoolean(value)
              break
            case 'shopbygoal':
              productData.shopByGoal = value
              break
            case 'simpleflavors':
              productData.simpleFlavors = value
              break
            case 'nutritioninfo':
              productData.nutritionInfo = value
              break
            case 'ingredients':
              productData.ingredients = value
              break
            case 'slug':
              productData.slug = value
              break
            case 'weight':
              productData.weight = value
              break
            case 'images':
              if (value) {
                try {
                  // Handle additional images array
                  const imageUrls = value.split(',').map(url => url.trim().replace(/"/g, ''))
                  productData.additionalImages = imageUrls.map(url => ({
                    imageType: 'url',
                    imageUrl: url
                  }))
                } catch (e) {
                  productData.additionalImages = []
                }
              }
              break
            case 'variants':
              if (value && value.trim() && value !== '[]') {
                try {
                  // Parse JSON variants
                  const variantsData = JSON.parse(value.replace(/\\/g, ''))
                  productData.variants = variantsData
                } catch (e) {
                  console.log('Failed to parse variants:', e.message)
                  productData.variants = []
                }
              }
              break
            case 'certifications':
              if (value) {
                productData.certifications = [{ name: value }]
              }
              break
          }
        })
        
        // Log final product data
        console.log('Final product data:', JSON.stringify(productData, null, 2))
        
        // Validate required fields
        if (!productData.name || !productData.price) {
          throw new Error(`Missing required fields: name=${productData.name}, price=${productData.price}`)
        }
        
        console.log('Creating product:', productData.name)
        
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
          console.log('🔄 Duplicate found, skipping:', productData.name)
          duplicateCount++
          duplicates.push(`${productData.name} (already exists)`)
          
          // Update progress every 10 items
          if ((successCount + errorCount + duplicateCount) % 10 === 0) {
            await payload.update({
              collection: 'bulk-upload',
              id,
              data: {
                status: 'processing',
                results: `Processing ${lines.length - startRow} products...\n\n📊 Progress:\n✅ Added: ${successCount}\n❌ Failed: ${errorCount}\n🔄 Duplicates Skipped: ${duplicateCount}\n\nProcessing row ${i + 1}/${lines.length}...`,
              },
            })
          }
          continue
        }
        
        // Create product
        try {
          const createdProduct = await payload.create({
            collection: 'products',
            data: productData,
          })
          
          console.log('✅ Product created successfully:', createdProduct.id, createdProduct.name)
          successCount++
          
          // Update progress every 10 items
          if ((successCount + errorCount + duplicateCount) % 10 === 0) {
            await payload.update({
              collection: 'bulk-upload',
              id,
              data: {
                status: 'processing',
                results: `Processing ${lines.length - startRow} products...\n\n📊 Progress:\n✅ Added: ${successCount}\n❌ Failed: ${errorCount}\n🔄 Duplicates Skipped: ${duplicateCount}\n\nProcessing row ${i + 1}/${lines.length}...`,
              },
            })
          }
        } catch (createError) {
          console.error('❌ Product creation failed:', createError.message)
          throw createError
        }
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        errorCount++
        errors.push(`Row ${i + 1}: ${error.message}`)
        
        // Update progress every 10 items
        if ((successCount + errorCount + duplicateCount) % 10 === 0) {
          await payload.update({
            collection: 'bulk-upload',
            id,
            data: {
              status: 'processing',
              results: `Processing ${lines.length - startRow} products...\n\n📊 Progress:\n✅ Added: ${successCount}\n❌ Failed: ${errorCount}\n🔄 Duplicates Skipped: ${duplicateCount}\n\nProcessing row ${i + 1}/${lines.length}...`,
            },
          })
        }
      }
    }
    
    // Final detailed results
    const finalResults = `🎉 PROCESSING COMPLETED!\n\n📊 FINAL SUMMARY:\n✅ Successfully Added: ${successCount} products\n❌ Failed: ${errorCount} products\n🔄 Duplicates Skipped: ${duplicateCount} products\n📝 Total Processed: ${successCount + errorCount + duplicateCount}\n\n${errorCount > 0 ? `❌ ERRORS (first 5):\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...and ' + (errors.length - 5) + ' more errors' : ''}\n\n` : ''}${duplicateCount > 0 ? `🔄 DUPLICATES SKIPPED (first 5):\n${duplicates.slice(0, 5).join('\n')}${duplicates.length > 5 ? '\n...and ' + (duplicates.length - 5) + ' more duplicates' : ''}` : ''}`
    
    await payload.update({
      collection: 'bulk-upload',
      id,
      data: {
        status: 'completed',
        results: finalResults,
      },
    })
    
    const details = `Successfully created: ${successCount} products\nErrors: ${errorCount}\nDuplicates skipped: ${duplicateCount}\n\nFirst few errors:\n${errors.slice(0, 5).join('\n')}`
    
    return { 
      success: true, 
      message: `Added ${successCount} products, ${errorCount} failed, ${duplicateCount} duplicates skipped`,
      successCount,
      errorCount,
      duplicateCount,
      details
    }
    
  } catch (error) {
    console.error('Processing error:', error)
    // Update with error status
    try {
      await payload.update({
        collection: 'bulk-upload',
        id,
        data: {
          status: 'error',
          results: `Processing failed: ${error.message}`,
        },
      })
    } catch (updateError) {
      console.error('Failed to update error status:', updateError)
    }
    
    return { success: false, error: error.message }
  }
}

export const bulkUploadProcessEndpoint: Endpoint = {
  path: '/process-csv/:id',
  method: 'post',
  handler: async (req) => {
    try {
      // Extract ID from URL path
      const urlParts = req.url.split('/')
      const id = urlParts[urlParts.length - 1]
      
      if (!id || id === 'process-csv') {
        return Response.json({ error: 'ID parameter is required' }, { status: 400 })
      }
      
      console.log('Processing CSV for ID:', id)
      const result = await processCSVFile(id, req.payload)
      return Response.json(result, { status: 200 })
    } catch (error) {
      console.error('Endpoint error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }
  },
}