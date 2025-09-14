import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.BACKEND_URL}/api/auth/google/callback&` +
    `response_type=code&` +
    `scope=openid email profile&` +
    `access_type=offline&` +
    `prompt=consent`

  return NextResponse.redirect(googleAuthUrl)
}