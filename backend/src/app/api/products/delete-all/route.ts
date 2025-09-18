import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
    })
    
    let deletedCount = 0
    
    for (const product of products.docs) {
      try {
        await payload.delete({
          collection: 'products',
          id: product.id,
        })
        deletedCount++
      } catch (error) {
        console.error(`Failed to delete product ${product.id}:`, error.message)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} products`,
      deletedCount
    })
    
  } catch (error) {
    console.error('Delete all products error:', error)
    return NextResponse.json(
      { error: 'Failed to delete products', details: error.message },
      { status: 500 }
    )
  }
}