import { Payload } from 'payload'
import * as XLSX from 'xlsx'

export interface ProductImportRow {
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

export interface ImportResult {
  success: number;
  errors: string[];
}

export async function importProductsFromExcel(
  payload: Payload,
  filePath: string,
  createMissing: boolean = true
): Promise<ImportResult> {
  const fs = require('fs')
  
  console.log('Importing from file:', filePath)
  console.log('File exists:', fs.existsSync(filePath))
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  
  const workbook = XLSX.readFile(filePath)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const data: ProductImportRow[] = XLSX.utils.sheet_to_json(worksheet)

  const results = { success: 0, errors: [] }

  for (const row of data) {
    try {
      // Check/create brand
      if (createMissing && row.brand) {
        await ensureBrandExists(payload, row.brand)
      }

      // Check/create category
      if (createMissing && row.category) {
        await ensureCategoryExists(payload, row.category, row.subcategory)
      }

      // Process images
      const additionalImages = row.additionalImageUrls
        ? row.additionalImageUrls.split(',').map(url => ({
            imageType: 'url',
            imageUrl: url.trim()
          }))
        : []

      // Process variants
      const variants = row.variants
        ? JSON.parse(row.variants)
        : []

      // Process ingredients
      const ingredients = row.ingredients
        ? row.ingredients.split(',').map(name => ({ name: name.trim() }))
        : []

      const productData = {
        name: row.name,
        slug: generateSlug(row.name),
        imageType: 'url',
        imageUrl: row.mainImage || row.imageUrl,
        additionalImages,
        price: row.price,
        originalPrice: row.originalPrice,
        onSale: row.onSale === 'TRUE' || row.onSale === true,
        category: row.category,
        subcategory: row.subcategory,
        brand: row.brand,
        description: row.description,
        rating: row.rating,
        reviews: row.reviews,
        featured: row.featured === 'TRUE' || row.featured === true,
        trending: row.trending === 'TRUE' || row.trending === true,
        bestSeller: row.bestSeller === 'TRUE' || row.bestSeller === true,
        lovedByExperts: row.lovedByExperts === 'TRUE' || row.lovedByExperts === true,
        shopByGoal: row.shopByGoal,
        simpleFlavors: row.simpleFlavors,
        variants,
        ingredients,
        nutritionInfo: row.nutritionInfo ? JSON.parse(row.nutritionInfo) : {},
      }

      await payload.create({
        collection: 'products',
        data: productData,
      })

      results.success++
    } catch (error) {
      results.errors.push(`Row ${results.success + results.errors.length + 1}: ${error.message}`)
    }
  }

  return results
}

async function ensureBrandExists(payload: Payload, brandName: string) {
  const existing = await payload.find({
    collection: 'brands',
    where: { name: { equals: brandName } },
    limit: 1,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'brands',
      data: { name: brandName },
    })
  }
}

async function ensureCategoryExists(payload: Payload, categoryName: string, subcategoryName?: string) {
  const existing = await payload.find({
    collection: 'categories',
    where: { name: { equals: categoryName } },
    limit: 1,
  })

  if (existing.docs.length === 0) {
    const subcategories = subcategoryName
      ? [{ name: subcategoryName, slug: generateSlug(subcategoryName) }]
      : []

    await payload.create({
      collection: 'categories',
      data: {
        name: categoryName,
        slug: generateSlug(categoryName),
        subcategories,
      },
    })
  } else if (subcategoryName) {
    const category = existing.docs[0]
    const hasSubcategory = category.subcategories?.some(sub => sub.name === subcategoryName)
    
    if (!hasSubcategory) {
      const updatedSubcategories = [
        ...(category.subcategories || []),
        { name: subcategoryName, slug: generateSlug(subcategoryName) }
      ]
      
      await payload.update({
        collection: 'categories',
        id: category.id,
        data: { subcategories: updatedSubcategories },
      })
    }
  }
}

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}