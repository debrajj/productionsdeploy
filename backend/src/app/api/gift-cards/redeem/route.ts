import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { code, amount, orderId } = await req.json()

    if (!code || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    // Find gift card
    const result = await payload.find({
      collection: 'gift-cards',
      where: {
        code: {
          equals: code.toUpperCase(),
        },
      },
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ error: 'Gift card not found' }, { status: 404 })
    }

    const giftCard = result.docs[0]

    // Validate gift card
    if (!giftCard.isActive) {
      return NextResponse.json({ error: 'Gift card is inactive' }, { status: 400 })
    }

    if (giftCard.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    if (giftCard.expiresAt && new Date(giftCard.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Gift card has expired' }, { status: 400 })
    }

    // Update gift card balance
    const newBalance = giftCard.balance - amount
    const updatedTransactions = [
      ...(giftCard.transactions || []),
      {
        amount,
        type: 'debit',
        orderId,
        date: new Date(),
      },
    ]

    await payload.update({
      collection: 'gift-cards',
      id: giftCard.id,
      data: {
        balance: newBalance,
        transactions: updatedTransactions,
        isActive: newBalance > 0,
      },
    })

    return NextResponse.json({
      success: true,
      redeemedAmount: amount,
      remainingBalance: newBalance,
    })
  } catch (error) {
    console.error('Gift card redemption error:', error)
    return NextResponse.json({ error: 'Failed to redeem gift card' }, { status: 500 })
  }
}