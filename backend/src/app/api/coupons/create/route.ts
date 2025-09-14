import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const couponData = await request.json()

    const newCoupon = await payload.create({
      collection: 'coupons',
      data: couponData,
    })

    return NextResponse.json({
      success: true,
      coupon: newCoupon,
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}