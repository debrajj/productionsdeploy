import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const payload = await getPayloadHMR({ config: configPromise })
  
  try {
    const { user } = await payload.auth({ headers: request.headers })
    return Response.json({ user })
  } catch (error) {
    return Response.json({ user: null }, { status: 401 })
  }
}