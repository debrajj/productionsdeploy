import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'all.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    // Skip header row
    const dataLines = lines.slice(1)
    const products = []
    
    // Process CSV data
    dataLines.forEach((line, index) => {
      if (!line.trim()) return
      
      const values = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
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
      
      if (values.length >= 6) {
        products.push({
          name: values[0]?.replace(/"/g, '').trim(),
          price: parseFloat(values[1]) || 0,
          originalPrice: parseFloat(values[2]) || null,
          category: values[3]?.replace(/"/g, '').trim(),
          subcategory: values[4]?.replace(/"/g, '').trim(),
          brand: values[5]?.replace(/"/g, '').trim(),
          description: values[6]?.replace(/"/g, '').trim() || 'Product description',
          image: values[7]?.replace(/"/g, '').trim(),
          images: values[8]?.replace(/"/g, '').trim() || '',
          rating: parseFloat(values[9]) || 4.0,
          reviews: parseInt(values[10]) || 0,
          weight: values[11]?.replace(/"/g, '').trim(),
          simpleFlavors: values[12]?.replace(/"/g, '').trim(),
          variants: values[13]?.replace(/"/g, '').trim() || '[]',
          featured: values[14]?.toLowerCase() === 'true',
          trending: values[15]?.toLowerCase() === 'true',
          bestSeller: values[16]?.toLowerCase() === 'true',
          lovedByExperts: values[17]?.toLowerCase() === 'true',
          onSale: values[18]?.toLowerCase() === 'true',
          shopByGoal: values[19]?.replace(/"/g, '').trim(),
          nutritionInfo: values[20]?.replace(/"/g, '').trim(),
          ingredients: values[21]?.replace(/"/g, '').trim(),
          certifications: values[22]?.replace(/"/g, '').trim(),
          nutritionImage: values[23]?.replace(/"/g, '').trim(),
          slug: values[24]?.replace(/"/g, '').trim(),
        })
      }
    })
    
    // Clear existing products
    await payload.delete({
      collection: 'products',
      where: {},
    })
    
    // Insert products in batches
    let insertedCount = 0
    const batchSize = 10
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      
      for (const product of batch) {
        try {
          await payload.create({
            collection: 'products',
            data: product,
          })
          insertedCount++
        } catch (error) {
          console.error(`Failed to insert product: ${product.name}`, error)
        }
      }
    }
    
    const successRate = ((insertedCount / products.length) * 100).toFixed(1)
    
    return NextResponse.json({
      success: true,
      message: '🎉 BULK IMPORT COMPLETED SUCCESSFULLY! 🎉',
      stats: {
        totalProcessed: products.length,
        totalInserted: insertedCount,
        successRate: `${successRate}%`,
        status: insertedCount === products.length ? 'Perfect Success' : 'Partial Success'
      }
    })
    
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({
      success: false,
      message: '❌ Bulk import failed',
      error: error.message
    }, { status: 500 })
  }
}