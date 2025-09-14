import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()
    
    // Create minimal order with required fields only
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: data.orderNumber || `ORD-${Date.now()}`,
        userId: 'guest',
        customerEmail: data.customerEmail || 'guest@example.com',
        customerName: 'Test Customer',
        customerPhone: '1234567890',
        status: 'pending',
        items: [{
          id: 'test-item',
          name: 'Test Product',
          price: 100,
          quantity: 1,
        }],
        subtotal: 100,
        total: 199,
        shippingCost: 99,
        deliveryMethod: 'standard',
        paymentMethod: 'COD',
        shippingAddress: 'Test Address\nMumbai, MH 400001',
      },
    })

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}