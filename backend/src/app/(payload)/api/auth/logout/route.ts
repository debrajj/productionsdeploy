import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(request: Request) {
  const payload = await getPayloadHMR({ config: configPromise })
  
  try {
    const result = await payload.logout(request)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Logout failed' }, { status: 500 })
  }
}