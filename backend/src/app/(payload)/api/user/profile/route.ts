import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthenticatedUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'

// GET /api/user/profile - Get user profile (protected route)
export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error getting user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 },
    )
  }
})

// PUT /api/user/profile - Update user profile (protected route)
export const PUT = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json()
    const payload = await getPayloadClient()

    // Only allow updating certain fields
    const allowedFields = ['firstName', 'lastName', 'phone']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Update the user
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
    })

    // Don't return the password
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
})
