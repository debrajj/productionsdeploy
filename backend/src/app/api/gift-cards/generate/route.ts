import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { amount } = await req.json()

    // Generate unique 12-digit code (numbers + alphabet)
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Save to MongoDB
    const giftCard = await payload.create({
      collection: 'gift-cards',
      data: {
        code,
        amount: amount || 0,
        balance: amount || 0,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, code: giftCard.code })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}