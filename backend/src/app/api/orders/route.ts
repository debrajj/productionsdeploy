import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const payload = await getPayload({ config })

    if (userId) {
      const result = await payload.find({
        collection: 'orders',
        where: {
          userId: {
            equals: userId,
          },
        },
        sort: '-createdAt',
        limit: 100,
      })
      return NextResponse.json({ success: true, orders: result.docs })
    } else {
      const orders = await payload.find({
        collection: 'orders',
        sort: '-createdAt',
        limit: 100
      })
      return NextResponse.json(orders)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const payload = await getPayload({ config })

    // Format shipping address from form data
    let formattedAddress = 'No address provided'
    if (data.shippingAddress && typeof data.shippingAddress === 'object') {
      const addr = data.shippingAddress
      formattedAddress = `${addr.firstName || ''} ${addr.lastName || ''}\n${addr.address || ''}\n${addr.apartment ? addr.apartment + '\n' : ''}${addr.city || ''}, ${addr.state || ''} - ${addr.zipCode || ''}\nPhone: ${addr.phone || ''}`
    } else if (typeof data.shippingAddress === 'string') {
      formattedAddress = data.shippingAddress
    }

    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      customerEmail: data.customerEmail || 'customer@example.com',
      status: data.status || 'pending',
      items: data.items || [{
        id: '1',
        name: 'Product',
        price: 100,
        quantity: 1
      }],
      subtotal: data.subtotal || 100,
      total: data.total || 100,
      deliveryMethod: data.deliveryMethod || 'standard',
      paymentMethod: data.paymentMethod || 'COD',
      shippingAddress: formattedAddress,
      tracking: data.tracking || {}
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