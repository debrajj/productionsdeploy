import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const { searchParams } = new URL(request.url)
    const depth = parseInt(searchParams.get('depth') || '2')

    const heroBanner = await payload.findGlobal({
      slug: 'hero-banner-global',
      depth,
    })

    return NextResponse.json(heroBanner)
  } catch (error) {
    console.error('Hero Banner API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero banner', details: error.message },
      { status: 500 }
    )
  }
}