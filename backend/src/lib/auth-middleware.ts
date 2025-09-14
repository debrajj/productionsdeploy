import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function validateUser(userId: string) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })
    return user
  } catch (error) {
    console.error('User validation error:', error)
    return null
  }
}

export function extractAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}