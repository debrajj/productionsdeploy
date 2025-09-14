import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config: await import('@/payload.config') })
    
    const products = await payload.find({
      collection: 'products',
      limit: 100,
    })

    const allFlavors = new Set<string>()
    const allWeights = new Set<string>()

    products.docs.forEach(product => {
      // Add from simple variants
      if (product.simpleFlavors) {
        product.simpleFlavors.split(',').forEach((f: string) => {
          const flavor = f.trim()
          if (flavor) allFlavors.add(flavor)
        })
      }
      if (product.simpleWeights) {
        product.simpleWeights.split(',').forEach((w: string) => {
          const weight = w.trim()
          if (weight) allWeights.add(weight)
        })
      }
      
      // Add from complex variants
      if (product.variants) {
        product.variants.forEach((variant: any) => {
          if (variant.flavor) allFlavors.add(variant.flavor)
          if (variant.weight) allWeights.add(variant.weight)
        })
      }
    })

    // Fallback to env if no variants found
    if (allFlavors.size === 0) {
      const flavorsString = process.env.PRODUCT_FLAVORS || ''
      flavorsString.split(',').forEach(f => f.trim() && allFlavors.add(f.trim()))
    }
    if (allWeights.size === 0) {
      const weightsString = process.env.PRODUCT_WEIGHTS || ''
      weightsString.split(',').forEach(w => w.trim() && allWeights.add(w.trim()))
    }

    return NextResponse.json({
      success: true,
      data: { 
        flavors: Array.from(allFlavors), 
        weights: Array.from(allWeights) 
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product variants' },
      { status: 500 }
    )
  }
}