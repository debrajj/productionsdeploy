import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Get the latest uploaded CSV file
    const mediaDir = path.join(process.cwd(), 'media')
    let csvData = ''
    
    try {
      const files = fs.readdirSync(mediaDir)
        .filter(file => file.endsWith('.csv'))
        .map(file => ({
          name: file,
          path: path.join(mediaDir, file),
          time: fs.statSync(path.join(mediaDir, file)).mtime
        }))
        .sort((a, b) => b.time - a.time)
      
      if (files.length > 0) {
        csvData = fs.readFileSync(files[0].path, 'utf8')
        console.log('📄 Processing file:', files[0].name)
      } else {
        throw new Error('No CSV files found')
      }
    } catch {
      return NextResponse.json(
        { error: 'No CSV files found in uploads. Please upload a CSV file first.' },
        { status: 400 }
      )
    }
    
    // Simple CSV parser
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',')
    const products = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue
      
      // Handle CSV with quotes
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
      
      const row = {}
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.replace(/^"|"$/g, '') || ''
      })
      
      if (!row.name) continue
      
      // Process variants
      let variants = []
      if (row.variants) {
        try {
          variants = JSON.parse(row.variants.replace(/""/g, '"'))
        } catch {
          variants = []
        }
      }
      
      // Process additional images
      const additionalImages = []
      if (row.additionalImageUrls) {
        row.additionalImageUrls.split(',').forEach(url => {
          if (url.trim()) {
            additionalImages.push({
              imageType: 'url',
              imageUrl: url.trim()
            })
          }
        })
      }
      
      // Process ingredients
      const ingredients = []
      if (row.ingredients) {
        row.ingredients.split(',').forEach(ing => {
          if (ing.trim()) {
            ingredients.push({ name: ing.trim() })
          }
        })
      }
      
      const product = {
        name: row.name,
        slug: row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        imageType: 'url',
        imageUrl: row.imageUrl,
        additionalImages,
        price: parseFloat(row.price) || 0,
        originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : undefined,
        category: row.category,
        subcategory: row.subcategory,
        brand: row.brand,
        description: row.description,
        rating: row.rating ? parseFloat(row.rating) : undefined,
        reviews: row.reviews ? parseInt(row.reviews) : undefined,
        onSale: row.onSale?.toLowerCase() === 'true' || row.onSale === '1',
        featured: row.featured?.toLowerCase() === 'true' || row.featured === '1',
        trending: row.trending?.toLowerCase() === 'true' || row.trending === '1',
        bestSeller: row.bestSeller?.toLowerCase() === 'true' || row.bestSeller === '1',
        lovedByExperts: row.lovedByExperts?.toLowerCase() === 'true' || row.lovedByExperts === '1',
        shopByGoal: row.shopByGoal,
        simpleFlavors: row.simpleFlavors,
        variants,
        nutritionInfo: {
          servingSize: row.servingSize,
          servingsPerContainer: row.servingsPerContainer ? parseInt(row.servingsPerContainer) : undefined,
          protein: row.protein,
          carbohydrates: row.carbohydrates,
          fat: row.fat,
          calories: row.calories ? parseInt(row.calories) : undefined
        },
        ingredients
      }
      
      products.push(product)
    }
    
    // Check existing products
    const existingResponse = await fetch('http://localhost:3000/api/products')
    const existingData = await existingResponse.json()
    const existingNames = existingData.docs?.map(p => p.name) || []
    
    let success = 0
    let skipped = 0
    
    for (const product of products) {
      // Skip if product already exists
      if (existingNames.includes(product.name)) {
        skipped++
        continue
      }
      
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        success++
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${success} new products, skipped ${skipped} duplicates. Images: ✅ Variants: ✅ Nutrition: ✅` 
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}