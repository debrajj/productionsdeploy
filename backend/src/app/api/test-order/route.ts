import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Test order data
    const testOrder = {
      orderNumber: `TEST-${Date.now()}`,
      customerEmail: 'test@example.com',
      status: 'pending',
      items: [{
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        quantity: 1
      }],
      subtotal: 100,
      total: 100,
      shippingCost: 0,
      deliveryMethod: 'standard',
      paymentMethod: 'COD',
      shippingAddress: 'Test Address\nTest City, Test State - 123456\nPhone: 1234567890'
    }

    const order = await payload.create({
      collection: 'orders',
      data: testOrder,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Test order created successfully',
      order 
    })
  } catch (error) {
    console.error('Test order creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error 
    }, { status: 500 })
  }
}