import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { email, phone } = await request.json()

    const subscriber = await payload.create({
      collection: 'subscribers',
      data: {
        email,
        phone,
      },
    })

    return NextResponse.json({ success: true, id: subscriber.id })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}