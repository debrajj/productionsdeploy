import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or email is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    const whereClause = userId 
      ? { userId: { equals: userId } }
      : { customerEmail: { equals: email } }

    const result = await payload.find({
      collection: 'orders',
      where: whereClause,
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({ 
      success: true, 
      orders: result.docs 
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}