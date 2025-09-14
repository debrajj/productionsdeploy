import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Check if URL points to an image
    try {
      const response = await fetch(url, { method: 'HEAD' })
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Image URL is not accessible' },
          { status: 400 }
        )
      }

      const contentType = response.headers.get('content-type')
      
      if (!contentType || !contentType.startsWith('image/')) {
        return NextResponse.json(
          { error: 'URL does not point to an image' },
          { status: 400 }
        )
      }

      // Get image dimensions if possible
      const contentLength = response.headers.get('content-length')
      
      return NextResponse.json({
        valid: true,
        contentType,
        size: contentLength ? parseInt(contentLength) : null,
        url: url
      })

    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to validate image URL' },
        { status: 400 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}