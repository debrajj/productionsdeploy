import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return static variants for now to avoid import issues
    const defaultFlavors = [
      'Chocolate', 'Vanilla', 'Strawberry', 'Cookies & Cream', 
      'Chocolate Fudge', 'Vanilla Creme', 'Blue Razz', 'Mango',
      'Orange', 'Lemon', 'Tiger\'s Blood', 'Blue Lemonade',
      'Fruit Punch', 'Cereal Milk', 'Peanut Butter'
    ]
    
    const defaultWeights = [
      '250g', '500g', '1kg', '2kg', '3kg', '5kg',
      '60 tablets', '90 tablets', '120 tablets',
      '60 capsules', '90 capsules', '120 capsules',
      '240g', '300g', '420g'
    ]

    return NextResponse.json({
      success: true,
      data: { 
        flavors: defaultFlavors, 
        weights: defaultWeights 
      }
    })
  } catch (error) {
    console.error('Product variants API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product variants' },
      { status: 500 }
    )
  }
}