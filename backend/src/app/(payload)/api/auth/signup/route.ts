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

// POST /api/auth/signup - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        const response = NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        )
        response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        return response
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      const response = NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
      response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      return response
    }

    // Validate password strength
    if (body.password.length < 6) {
      const response = NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 },
      )
      response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      return response
    }

    const payload = await getPayloadClient()

    // Check if user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: body.email },
      },
    })

    if (existingUser.docs.length > 0) {
      const response = NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 },
      )
      response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      return response
    }

    // Create the user
    const user = await payload.create({
      collection: 'users',
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: body.password,
      },
    })

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: userWithoutPassword,
    })
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  } catch (error) {
    console.error('Error creating user:', error)
    const response = NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }
}