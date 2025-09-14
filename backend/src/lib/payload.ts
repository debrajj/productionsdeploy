import config from '@/payload.config'
import { getPayload, Payload } from 'payload'

interface CachedPayload {
  client: Payload | null
  promise: Promise<Payload> | null
}

interface GlobalWithPayload {
  payload: CachedPayload
}

let cachedPayload: CachedPayload = (global as unknown as GlobalWithPayload).payload

if (!cachedPayload) {
  cachedPayload = (global as unknown as GlobalWithPayload).payload = { client: null, promise: null }
}

export async function getPayloadClient(): Promise<Payload> {
  if (cachedPayload.client) {
    return cachedPayload.client
  }

  if (!cachedPayload.promise) {
    cachedPayload.promise = getPayload({ config })
  }

  try {
    cachedPayload.client = await cachedPayload.promise
  } catch (e) {
    cachedPayload.promise = null
    throw e
  }

  return cachedPayload.client as Payload
}
