import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CollectionSlug } from 'payload'

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// GET /api/hero-banner - Get active hero banner
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const banners = await payload.find({
      collection: 'hero-banner' as CollectionSlug,
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 1,
      depth: 2,
    })

    // If no active banner, get the most recent one
    if (banners.docs.length === 0) {
      const allBanners = await payload.find({
        collection: 'hero-banner' as CollectionSlug,
        limit: 1,
        sort: '-createdAt',
        depth: 2,
      })
      
      if (allBanners.docs.length === 0) {
        // Return default banner data if no banners exist
        const response = NextResponse.json({
          success: true,
          data: {
            id: 'default',
            desktopImage: null,
            mobileImage: null,
            isActive: true,
          },
        })
        response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        return response
      }
      
      banners.docs = allBanners.docs
    }

    const banner = banners.docs[0]
    
    const plainBanner = {
      id: banner.id,
      desktopImage: (banner as any).desktopImage?.filename 
        ? `/media/${(banner as any).desktopImage.filename}` 
        : (banner as any).desktopImage,
      mobileImage: (banner as any).mobileImage?.filename 
        ? `/media/${(banner as any).mobileImage.filename}` 
        : (banner as any).mobileImage,
      isActive: (banner as any).isActive,
    }

    const response = NextResponse.json({
      success: true,
      data: plainBanner,
    })
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  } catch (error) {
    console.error('Error fetching hero banner:', error)
    const response = NextResponse.json({ 
      success: false, 
      error: `Failed to fetch hero banner: ${error.message}` 
    }, { status: 500 })
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
  }
}