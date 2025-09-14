import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS for all routes
  const response = NextResponse.next()

  // Get origin from request
  const origin = request.headers.get('origin')
  
  // Allow multiple origins from environment
  const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
}
