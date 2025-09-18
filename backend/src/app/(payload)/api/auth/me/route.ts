import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const { user } = await payload.auth({ headers: request.headers })
    return Response.json({ user })
  } catch (error) {
    return Response.json({ user: null }, { status: 401 })
  }
}