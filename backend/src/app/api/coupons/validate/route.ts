import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code, cartTotal, userId } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    // Find the coupon
    const coupons = await payload.find({
      collection: 'coupons',
      where: {
        code: {
          equals: code.toUpperCase(),
        },
        isActive: {
          equals: true,
        },
      },
    })

    if (coupons.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
    }

    const coupon = coupons.docs[0]

    // Check if coupon is expired
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    // Check if coupon has started
    if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
      return NextResponse.json({ error: 'Coupon is not yet active' }, { status: 400 })
    }

    // Check minimum order value
    if (coupon.minimumOrderValue && cartTotal < coupon.minimumOrderValue) {
      return NextResponse.json({
        error: `Minimum order value of ₹${coupon.minimumOrderValue} required`,
      }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit exceeded' }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    let freeShipping = false

    switch (coupon.discountType) {
      case 'percentage':
        discountAmount = (cartTotal * coupon.discountValue) / 100
        if (coupon.maximumDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount)
        }
        break
      case 'fixed':
        discountAmount = Math.min(coupon.discountValue, cartTotal)
        break
      case 'free_shipping':
        freeShipping = true
        break
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        freeShipping,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}