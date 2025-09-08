import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: 'Signed out successfully'
    })

    // Clear auth cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0 // Expire immediately
    }

    response.cookies.set('accessToken', '', cookieOptions)
    response.cookies.set('refreshToken', '', cookieOptions)

    return response

  } catch (error) {
    console.error('Signout error:', error)

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}