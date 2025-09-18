import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const body = await request.json()
    const { email, password } = body

    const result = await payload.login({
      collection: 'users',
      data: { email, password }
    })

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Login failed' }, { status: 401 })
  }
}