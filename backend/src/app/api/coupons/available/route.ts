import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const coupons = await payload.find({
      collection: 'coupons',
      where: {
        isActive: {
          equals: true,
        },
        showOnCart: {
          equals: true,
        },
        or: [
          {
            expiresAt: {
              greater_than: new Date().toISOString(),
            },
          },
          {
            expiresAt: {
              exists: false,
            },
          },
        ],
      },
      sort: 'minimumOrderValue',
    })

    const availableCoupons = coupons.docs.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderValue: coupon.minimumOrderValue,
      maximumDiscountAmount: coupon.maximumDiscountAmount,
      expiresAt: coupon.expiresAt,
    }))

    return NextResponse.json({
      success: true,
      coupons: availableCoupons,
    })
  } catch (error) {
    console.error('Error fetching available coupons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}