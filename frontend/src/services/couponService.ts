import { couponApi, type Coupon } from './api'

export interface ValidatedCoupon extends Coupon {
  discountAmount: number
  freeShipping: boolean
}

export type { Coupon }

export const couponService = {
  async getAvailableCoupons(): Promise<Coupon[]> {
    try {
      const response = await couponApi.getAvailableCoupons()
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch coupons')
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching available coupons:', error)
      return []
    }
  },

  async validateCoupon(code: string, cartTotal: number, userId?: string): Promise<ValidatedCoupon> {
    const response = await couponApi.validateCoupon(code, cartTotal)

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to validate coupon')
    }

    const coupon = response.data
    let discountAmount = 0
    let freeShipping = false

    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100
      if (coupon.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount)
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue
    } else if (coupon.discountType === 'free_shipping') {
      freeShipping = true
    }

    return {
      ...coupon,
      discountAmount,
      freeShipping
    }
  },

  async createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    // This would need to be implemented in the backend API
    throw new Error('Create coupon not implemented yet')
  },
}