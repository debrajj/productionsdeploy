import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        )
      }
    }

    const payload = await getPayloadClient()

    // Authenticate user using Payload's built-in authentication
    const { user, token } = await payload.login({
      collection: 'users',
      data: {
        email: body.email,
        password: body.password,
      },
    })

    if (!user || !token) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user

    // Set HTTP-only cookie with the token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    })

    // Set the token as an HTTP-only cookie for security
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response
  } catch (error) {
    console.error('Error logging in:', error)
    const response = NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 },
    )
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }
}