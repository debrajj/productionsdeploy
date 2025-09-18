import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const depth = parseInt(searchParams.get('depth') || '2')
    
    // Build where clause from query parameters
    const where: any = {}
    
    // Handle where conditions
    searchParams.forEach((value, key) => {
      if (key.startsWith('where[') && key.endsWith(']')) {
        const field = key.slice(6, -1)
        
        // Handle nested conditions like where[bestSeller][equals]=true
        if (field.includes('][')) {
          const parts = field.split('][')
          const fieldName = parts[0]
          const operator = parts[1]
          
          if (!where[fieldName]) where[fieldName] = {}
          
          if (operator === 'equals') {
            where[fieldName][operator] = value === 'true' ? true : value === 'false' ? false : value
          } else {
            where[fieldName][operator] = value
          }
        } else {
          where[field] = { equals: value === 'true' ? true : value === 'false' ? false : value }
        }
      }
    })

    const products = await payload.find({
      collection: 'products',
      where,
      page,
      limit,
      depth,
    })

    // Add missing fields with defaults
    const processedProducts = {
      ...products,
      docs: products.docs.map(product => ({
        ...product,
        slug: product.slug || product.name?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        rating: product.rating || 4.0,
        reviews: product.reviews || 0,
        originalPrice: product.originalPrice || product.price,
        onSale: product.onSale || false,
        featured: product.featured || false,
        trending: product.trending || false,
        bestSeller: product.bestSeller || false,
        lovedByExperts: product.lovedByExperts || false,
        shopByGoal: product.shopByGoal || 'HEALTH_WELLNESS',
        subcategory: product.subcategory,
        nutritionInfo: product.nutritionInfo || 'Nutrition information not available',
        ingredients: product.ingredients || 'Ingredients not specified',
      }))
    }

    return NextResponse.json(processedProducts)
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    // Extract product IDs from query parameters
    const productIds: string[] = []
    
    // Parse the complex where clause for bulk deletion
    searchParams.forEach((value, key) => {
      if (key.includes('where[and][0][id][in]')) {
        productIds.push(value)
      }
    })
    
    if (productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided for deletion' },
        { status: 400 }
      )
    }
    
    let deletedCount = 0
    const errors: string[] = []
    
    // Delete each product individually
    for (const productId of productIds) {
      try {
        await payload.delete({
          collection: 'products',
          id: productId,
        })
        deletedCount++
      } catch (error) {
        console.error(`Failed to delete product ${productId}:`, error.message)
        errors.push(`Product ${productId}: ${error.message}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} of ${productIds.length} products`,
      deletedCount,
      totalRequested: productIds.length,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete products', details: error.message },
      { status: 500 }
    )
  }
}