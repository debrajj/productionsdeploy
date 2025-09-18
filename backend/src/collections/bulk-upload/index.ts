import type { CollectionConfig } from 'payload'
import * as XLSX from 'xlsx'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'

interface ProductImportRow {
  name: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  brand: string
  description?: string
  imageUrl?: string
  additionalImageUrls?: string
  rating?: number
  reviews?: number
  onSale?: boolean
  featured?: boolean
  trending?: boolean
  bestSeller?: boolean
  lovedByExperts?: boolean
  shopByGoal?: string
  simpleFlavors?: string
  variants?: string
  servingSize?: string
  servingsPerContainer?: number
  protein?: string
  carbohydrates?: string
  fat?: string
  calories?: number
  ingredients?: string
}

const processCSVFile = async (data: any, req: any) => {
  try {
    const payload = req.payload
    
    // Get the uploaded file
    const fileDoc = await payload.findByID({
      collection: 'media',
      id: data.file,
    })
    
    if (!fileDoc) {
      throw new Error('File not found')
    }
    
    const filePath = path.join(process.cwd(), 'media', fileDoc.filename)
    
    // Read CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lines = fileContent.split('\n')
    const headers = lines[0].split(',')
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        const values = line.split(',')
        const productData: any = {}
        
        // Map CSV columns to product fields
        headers.forEach((header, index) => {
          const cleanHeader = header.trim().toLowerCase()
          const value = values[index]?.trim()
          
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
              productData.featured = value?.toLowerCase() === 'true'
              break
            case 'trending':
              productData.trending = value?.toLowerCase() === 'true'
              break
            case 'bestseller':
              productData.bestSeller = value?.toLowerCase() === 'true'
              break
            case 'lovedbyexperts':
              productData.lovedByExperts = value?.toLowerCase() === 'true'
              break
            case 'onsale':
              productData.onSale = value?.toLowerCase() === 'true'
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
          }
        })
        
        // Create product
        await payload.create({
          collection: 'products',
          data: productData,
        })
        
        successCount++
      } catch (error) {
        errorCount++
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }
    
    // Update the bulk upload record with results
    await payload.update({
      collection: 'bulk-upload',
      id: data.id,
      data: {
        status: 'completed',
        results: `Processing completed!\n\nSuccess: ${successCount} products created\nErrors: ${errorCount}\n\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n...and more' : ''}`,
        processFile: false,
      },
    })
    
  } catch (error) {
    // Update with error status
    await req.payload.update({
      collection: 'bulk-upload',
      id: data.id,
      data: {
        status: 'error',
        results: `Processing failed: ${error.message}`,
        processFile: false,
      },
    })
  }
}
export const BulkUpload: CollectionConfig = {
  slug: 'bulk-upload',  // Keep original for URL consistency
  admin: {
    useAsTitle: 'fileName',
    group: 'Content',
    description: 'Upload CSV/Excel files to import multiple products at once',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'fileName',
      type: 'text',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'status',
      type: 'text',
      defaultValue: 'uploaded',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'results',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'processButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/ProcessButton',
        },
      },
    },
  ],

}