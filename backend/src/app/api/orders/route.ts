import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const payload = await getPayload({ config })

    // Format shipping address from form data
    let formattedAddress = 'No address provided'
    if (data.shippingAddress && typeof data.shippingAddress === 'object') {
      const addr = data.shippingAddress
      const fullName = `${addr.firstName || ''} ${addr.lastName || ''}`.trim()
      const addressLine1 = addr.address || ''
      const addressLine2 = addr.apartment ? addr.apartment : ''
      const cityStateZip = `${addr.city || ''}, ${addr.state || ''} - ${addr.zipCode || ''}`.replace(/^, /, '').replace(/ - $/, '')
      const phone = addr.phone ? `Phone: ${addr.phone}` : ''
      
      formattedAddress = [fullName, addressLine1, addressLine2, cityStateZip, phone]
        .filter(line => line.trim())
        .join('\n')
    } else if (typeof data.shippingAddress === 'string') {
      formattedAddress = data.shippingAddress
    }

    const orderData = {
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      customerEmail: data.customerEmail || 'customer@example.com',
      userId: data.userId, // Include userId for linking to user account
      items: data.items || [],
      subtotal: data.subtotal || 0,
      total: data.total || 0,
      shippingCost: data.shippingCost || 0,
      couponCode: data.couponCode,
      discount: data.discount || 0,
      deliveryMethod: data.deliveryMethod || 'standard',
      paymentMethod: data.paymentMethod || 'COD',
      shippingAddress: formattedAddress,
      tracking: {
        status: 'pending'
      }
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}