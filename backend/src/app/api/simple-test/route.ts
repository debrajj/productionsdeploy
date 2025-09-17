import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const product = await payload.create({
      collection: 'products',
      data: {
        name: 'Simple Test Product',
        slug: 'simple-test-' + Date.now(),
        imageType: 'url',
        imageUrl: 'https://via.placeholder.com/300',
        price: 999,
        category: 'SPORTS NUTRITION',
        brand: 'MUSCLETECH',
        description: 'Simple test product'
      }
    })
    
    return NextResponse.json({
      success: true,
      imported: 1,
      productId: product.id
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}