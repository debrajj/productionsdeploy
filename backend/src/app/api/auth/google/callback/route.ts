import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/login?error=access_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`)
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://api.02n.store/api/auth/google/callback',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      return NextResponse.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`)
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const googleUser = await userResponse.json()

    const payload = await getPayloadClient()

    // Check if user exists
    let user = await payload.find({
      collection: 'users',
      where: { email: { equals: googleUser.email } },
    })

    if (user.docs.length === 0) {
      // Create new user
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          password: Math.random().toString(36).slice(-8), // Random password
        },
      })
      user = { docs: [newUser] }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.docs[0].id, email: user.docs[0].email },
      process.env.PAYLOAD_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`)
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
  }
}