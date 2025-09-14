import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'
import { decodeToken } from '@/lib/jwt'

// GET /api/auth/me - Get current user information
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token found' },
        { status: 401 },
      )
    }

    // Decode the JWT token to get user information
    const decoded = decodeToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 },
      )
    }

    // Get user from database using the decoded user ID
    let user
    try {
      user = await payload.findByID({
        collection: 'users',
        id: decoded.id,
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 },
      )
    }

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    })
  } catch (error) {
    console.error('Error getting user info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user information' },
      { status: 401 },
    )
  }
}
