import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importProductsFromExcel } from '@/lib/bulk-import'
import path from 'path'

// Proper CSV parsing function to handle quoted fields
function parseCSVLine(line: string): string[] {
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

// Map CSV brand names to database brand names
function mapBrandName(csvBrand: string): string {
  if (!csvBrand) return 'MUSCLETECH'
  
  const brand = csvBrand.toUpperCase().trim()
  
  // Direct matches
  if (brand === 'MUSCLETECH') return 'MUSCLETECH'
  if (brand === 'AVVATAR') return 'AVVATAR'
  if (brand === 'ON (OPTIMUM NUTRITION)') return 'ON (OPTIMUM NUTRITION)'
  if (brand === 'OPTIMUM NUTRITION') return 'ON (OPTIMUM NUTRITION)'
  if (brand === 'ON') return 'ON (OPTIMUM NUTRITION)'
  
  // Default fallback
  return 'MUSCLETECH'
}

// Map CSV category names to database category names
function mapCategoryName(csvCategory: string): string {
  if (!csvCategory) return 'SPORTS NUTRITION'
  
  const category = csvCategory.toUpperCase().trim()
  
  // Direct matches from your system
  if (category === 'SPORTS NUTRITION') return 'SPORTS NUTRITION'
  if (category === 'VITAMINS & SUPPLEMENTS') return 'VITAMINS & SUPPLEMENTS'
  if (category === 'AYURVEDA & HERBS') return 'AYURVEDA & HERBS'
  if (category === 'HEALTH FOOD & DRINKS') return 'HEALTH FOOD & DRINKS'
  if (category === 'FITNESS') return 'FITNESS'
  if (category === 'WELLNESS') return 'WELLNESS'
  if (category === 'PRE-WORKOUT') return 'Pre-Workout'
  if (category === 'PROTEIN') return 'Protein'
  
  // Alternative names
  if (category === 'SUPPLEMENTS') return 'VITAMINS & SUPPLEMENTS'
  if (category === 'VITAMINS') return 'VITAMINS & SUPPLEMENTS'
  if (category === 'HERBS') return 'AYURVEDA & HERBS'
  if (category === 'AYURVEDA') return 'AYURVEDA & HERBS'
  if (category === 'HEALTH FOOD') return 'HEALTH FOOD & DRINKS'
  if (category === 'DRINKS') return 'HEALTH FOOD & DRINKS'
  
  // Default fallback
  return 'SPORTS NUTRITION'
}

// Map CSV shopByGoal to valid values
function mapShopByGoal(csvGoal: string): string | undefined {
  if (!csvGoal) return undefined
  
  const goal = csvGoal.toUpperCase().trim()
  
  // Valid shop by goals
  if (goal === 'MUSCLE_GAIN') return 'MUSCLE_GAIN'
  if (goal === 'WEIGHT_LOSS') return 'WEIGHT_LOSS'
  if (goal === 'ENERGY_PERFORMANCE') return 'ENERGY_PERFORMANCE'
  if (goal === 'HEALTH_WELLNESS') return 'HEALTH_WELLNESS'
  
  // Alternative names
  if (goal === 'MUSCLE GAIN') return 'MUSCLE_GAIN'
  if (goal === 'WEIGHT LOSS') return 'WEIGHT_LOSS'
  if (goal === 'ENERGY PERFORMANCE') return 'ENERGY_PERFORMANCE'
  if (goal === 'HEALTH WELLNESS') return 'HEALTH_WELLNESS'
  if (goal === 'MUSCLE') return 'MUSCLE_GAIN'
  if (goal === 'WEIGHT') return 'WEIGHT_LOSS'
  if (goal === 'ENERGY') return 'ENERGY_PERFORMANCE'
  if (goal === 'HEALTH') return 'HEALTH_WELLNESS'
  
  return undefined
}

export async function POST(request: NextRequest) {
  try {
    const fs = require('fs')
    const payload = await getPayload({ config })
    
    // Get request body for duplicate handling option
    const body = await request.json().catch(() => ({}))
    const duplicateAction = body.duplicateAction || 'replace' // 'replace' or 'skip'
    
    // Get the most recent bulk upload
    const uploads = await payload.find({
      collection: 'bulk-upload',
      limit: 1,
      sort: '-createdAt'
    })
    
    if (uploads.docs.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No CSV files uploaded' 
      }, { status: 404 })
    }
    
    const upload = uploads.docs[0]
    const file = upload.file as any
    if (!file || !file.filename) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file' 
      }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'media', file.filename)
    
    console.log('Processing upload:', upload.fileName)
    console.log('File name:', file.filename)
    console.log('File path:', filePath)
    console.log('Upload created at:', upload.createdAt)
    
    // Test file access
    const exists = fs.existsSync(filePath)
    if (!exists) {
      return NextResponse.json({ 
        success: false, 
        error: `File not found: ${filePath}` 
      }, { status: 404 })
    }
    
    // Read file content and handle different line endings
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)
    
    console.log('Total lines in CSV:', lines.length)
    console.log('First few lines:', lines.slice(0, 3))
    
    // Create simple products from CSV
    let created = 0
    let skipped = 0
    let errors = 0
    let errorDetails = []
    
    // Process CSV data
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // Parse CSV line properly handling quoted fields
      const cols = parseCSVLine(line)
      if (cols.length < 6) continue
      
      try {
        const productName = cols[0] || `Product ${i}`
        const productSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        
        // Check for existing product with same name or slug
        const existingProduct = await payload.find({
          collection: 'products',
          where: {
            or: [
              { name: { equals: productName } },
              { slug: { equals: productSlug } }
            ]
          },
          limit: 1
        })
        
        const productData = {
          name: productName,
          slug: productSlug,
          imageType: 'url',
          imageUrl: cols[7] || 'https://via.placeholder.com/300',
          price: parseInt(cols[1]) || 1000,
          originalPrice: cols[2] ? parseInt(cols[2]) : undefined,
          category: mapCategoryName(cols[3]) || 'SPORTS NUTRITION',
          subcategory: cols[4] || undefined,
          brand: mapBrandName(cols[5]) || 'MUSCLETECH',
          description: cols[6] || 'Product from CSV import',
          rating: cols[9] ? parseFloat(cols[9]) : undefined,
          reviews: cols[10] ? parseInt(cols[10]) : undefined,
          simpleFlavors: cols[12] || undefined,
          variants: (() => {
            try {
              return cols[13] && cols[13] !== '{}' ? JSON.parse(cols[13]) : []
            } catch (e) {
              console.log(`Warning: Invalid variants JSON for ${productName}:`, cols[13])
              return []
            }
          })(),
          featured: cols[14] === 'TRUE',
          trending: cols[15] === 'TRUE',
          bestSeller: cols[16] === 'TRUE',
          lovedByExperts: cols[17] === 'TRUE',
          onSale: cols[18] === 'TRUE',
          shopByGoal: mapShopByGoal(cols[19]) || undefined,
          nutritionInfo: cols[20] || undefined,
          ingredients: cols[21] || undefined,
          certifications: cols[22] || undefined,
          nutritionImage: cols[23] || undefined
        }
        
        if (existingProduct.docs.length > 0) {
          // Always skip duplicates
          skipped++
          console.log(`⏭️ Skipped duplicate product: ${productData.name}`)
        } else {
          // Create new product
          await payload.create({
            collection: 'products',
            data: productData
          })
          created++
          console.log(`✅ Created new product ${created}: ${productData.name}`)
        }
      } catch (error) {
        errors++
        const errorMsg = `Product ${i} (${cols[0] || 'Unknown'}): ${error.message}`
        errorDetails.push(errorMsg)
        console.error(`❌ Error processing product ${i} (${cols[0]}):`, error.message)
      }
    }
    
    return NextResponse.json({
      success: true,
      imported: created,
      skipped: skipped,
      errors: errors,
      errorDetails: errorDetails.length > 0 ? errorDetails.join('; ') : null,
      message: `Added: ${created}, Skipped: ${skipped}, Errors: ${errors}`
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}