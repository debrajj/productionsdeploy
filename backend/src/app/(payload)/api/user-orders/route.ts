import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 })
    }

    const orders = await payload.find({
      collection: 'orders',
      where: {
        userId: {
          equals: userId,
        },
      },
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      orders: orders.docs,
    })
  } catch (error) {
    console.error('Fetch user orders error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}