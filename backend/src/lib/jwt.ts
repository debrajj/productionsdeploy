import jwt from 'jsonwebtoken'

export interface TokenPayload {
  id: string
  email: string
  iat: number
  exp: number
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.PAYLOAD_SECRET || 'your-secret-key',
    ) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}
