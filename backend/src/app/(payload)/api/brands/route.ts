import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/brands - Get all unique brands from products
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()
    
    // Get all products to extract unique brands
    const products = await payload.find({
      collection: 'products',
      limit: 2000, // Increase limit to get all products
      depth: 0, // Only get basic fields
    })

    // Extract unique brands from multiple possible fields
    const brandsSet = new Set<string>()
    products.docs.forEach((product: any) => {
      // Check multiple brand fields
      const brandSources = [
        product.customBrand,
        product.brand, 
        product.brandName,
        product.manufacturer
      ]
      
      brandSources.forEach(brandValue => {
        if (brandValue && typeof brandValue === 'string') {
          const cleanBrand = brandValue.trim().toUpperCase()
          if (cleanBrand && cleanBrand !== 'OTHER' && cleanBrand !== 'UNKNOWN' && cleanBrand !== '') {
            brandsSet.add(cleanBrand)
          }
        }
      })
    })

    // Convert to sorted array
    const brands = Array.from(brandsSet).sort()

    console.log(`Found ${brands.length} unique brands from ${products.docs.length} products`)
    
    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length,
      totalProducts: products.docs.length
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch brands' 
    }, { status: 500 })
  }
}