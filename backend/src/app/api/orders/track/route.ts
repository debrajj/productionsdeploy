import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderQuery = searchParams.get('query') // Can be order number or email

    if (!orderQuery) {
      return NextResponse.json({ error: 'Order number or email required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Search by order number or email
    const result = await payload.find({
      collection: 'orders',
      where: {
        or: [
          {
            orderNumber: {
              equals: orderQuery,
            },
          },
          {
            customerEmail: {
              equals: orderQuery,
            },
          },
        ],
      },
      limit: 10,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 },
      )
    }

    // Return the most recent order if multiple found
    const order = result.docs[0]

    // Transform the order data for frontend consumption
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.tracking?.status || order.status || 'pending',
      estimatedDelivery: order.tracking?.estimatedDelivery || null,
      actualDelivery: order.tracking?.actualDelivery || null,
      items: order.items || [],
      tracking: {
        carrier: order.tracking?.carrier || 'Standard Shipping',
        trackingNumber: order.tracking?.trackingNumber || null,
        trackingUrl: order.tracking?.trackingUrl || null,
        shippedDate: order.tracking?.shippedDate || null,
        estimatedDelivery: order.tracking?.estimatedDelivery || null
      },
      timeline: [
        {
          status: 'order_placed',
          title: 'Order Placed',
          description: 'Your order has been successfully placed.',
          timestamp: order.createdAt,
          completed: true,
        },
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          description: 'Your order has been confirmed.',
          timestamp: order.updatedAt,
          completed: ['confirmed', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.tracking?.status || order.status),
        },
        {
          status: 'processing',
          title: 'Processing',
          description: 'Your order is being prepared for shipment.',
          timestamp: order.updatedAt,
          completed: ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.tracking?.status || order.status),
        },
        {
          status: 'shipped',
          title: 'Shipped',
          description: `Shipped via ${order.tracking?.carrier || 'Standard Shipping'}`,
          timestamp: order.tracking?.shippedDate || order.updatedAt,
          completed: ['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.tracking?.status || order.status),
        },
        {
          status: 'in_transit',
          title: 'In Transit',
          description: 'Your package is on its way to you.',
          timestamp: order.updatedAt,
          completed: ['in_transit', 'out_for_delivery', 'delivered'].includes(order.tracking?.status || order.status),
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Your package is out for delivery.',
          timestamp: order.updatedAt,
          completed: ['out_for_delivery', 'delivered'].includes(order.tracking?.status || order.status),
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Your order has been delivered.',
          timestamp: order.updatedAt,
          completed: (order.tracking?.status || order.status) === 'delivered',
        }
      ],
      total: order.total || 0,
      subtotal: order.subtotal || 0,
      shipping: order.shippingCost || 0,
      shippingAddress: order.shippingAddress || 'No address provided',
      paymentMethod: order.paymentMethod || 'COD',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}
