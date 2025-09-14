import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const banner = await payload.findGlobal({
      slug: 'hero-banner-global',
      depth: 2,
    })

    const plainBanner = {
      isActive: banner.isActive,
      bannerLink: banner.bannerLink,
      desktopImage: banner.desktopImage?.filename 
        ? `/media/${banner.desktopImage.filename}` 
        : banner.desktopImage,
      mobileImage: banner.mobileImage?.filename 
        ? `/media/${banner.mobileImage.filename}` 
        : banner.mobileImage,
    }

    return NextResponse.json({
      success: true,
      data: plainBanner,
    })
  } catch (error) {
    console.error('Error fetching hero banner:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch hero banner' 
    }, { status: 500 })
  }
}