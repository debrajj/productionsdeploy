import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    })

    // Clear the authentication cookie
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 })
  }
}
