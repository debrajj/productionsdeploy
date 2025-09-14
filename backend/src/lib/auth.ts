import { getPayloadClient } from '@/lib/payload'
import { NextRequest } from 'next/server'
import { decodeToken } from '@/lib/jwt'

export interface AuthenticatedUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export async function getAuthenticatedUser(
  request: NextRequest,
): Promise<AuthenticatedUser | null> {
  try {
    const payload = await getPayloadClient()

    // Get the token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      return null
    }

    // Decode the JWT token to get user information
    const decoded = decodeToken(token)
    if (!decoded) {
      return null
    }

    // Get user from database using the decoded user ID
    let user
    try {
      user = await payload.findByID({
        collection: 'users',
        id: decoded.id,
      })

      if (!user) {
        return null
      }
    } catch (error) {
      return null
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as AuthenticatedUser
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export function requireAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>,
) {
  return async (request: NextRequest): Promise<Response> => {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(request, user)
  }
}
