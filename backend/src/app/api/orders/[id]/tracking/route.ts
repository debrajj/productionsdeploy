import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../../payload.config'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    const payload = await getPayload({ config })
    const { id } = await params

    const updatedOrder = await payload.update({
      collection: 'orders',
      id,
      data: {
        tracking: {
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          trackingUrl: data.trackingUrl,
          estimatedDelivery: data.estimatedDelivery,
          shippedDate: data.shippedDate || new Date().toISOString(),
        },
        status: data.status || 'shipped',
      },
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Error updating tracking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tracking' },
      { status: 500 }
    )
  }
}