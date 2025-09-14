import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Generate 12-digit code (numbers + alphabet)
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // For now, just return the code (you can add MongoDB later)
    console.log('Generated gift card:', { code, amount })

    return NextResponse.json({ success: true, giftCode: code })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}