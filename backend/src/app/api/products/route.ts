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

    return NextResponse.json(products)
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    )
  }
}