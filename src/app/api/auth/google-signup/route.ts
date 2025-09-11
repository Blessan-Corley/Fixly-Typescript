import { NextRequest, NextResponse } from 'next/server'
import { signIn, getProviders } from 'next-auth/react'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }
    
    await connectToDatabase()
    
    // Check if user exists
    const existingUser = await User.findOne({ email }).select('email role username homeAddress metadata')
    
    if (existingUser) {
      // User exists - return their profile completion status
      const isProfileComplete = !!(
        existingUser.username &&
        existingUser.homeAddress &&
        existingUser.homeAddress.coordinates &&
        existingUser.homeAddress.coordinates.lat !== 0 &&
        existingUser.homeAddress.coordinates.lng !== 0 &&
        existingUser.metadata.emailVerified
      )
      
      return NextResponse.json({
        exists: true,
        user: {
          email: existingUser.email,
          role: existingUser.role,
          username: existingUser.username,
          isProfileComplete,
          hasLocation: !!(existingUser.homeAddress && existingUser.homeAddress.coordinates && existingUser.homeAddress.coordinates.lat !== 0),
          emailVerified: existingUser.metadata?.emailVerified || false
        }
      })
    }
    
    return NextResponse.json({
      exists: false,
      message: 'User not found - can proceed with signup'
    })
    
  } catch (error) {
    console.error('Google signup check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, callbackUrl = '/dashboard' } = body
    
    if (!role || !['hirer', 'fixer'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role (hirer or fixer) is required' },
        { status: 400 }
      )
    }
    
    // Store the role in session or return it for client handling
    const response = NextResponse.json({
      success: true,
      role,
      redirectUrl: `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}&role=${role}`
    })
    
    // Set role cookie for the auth callback to use
    response.cookies.set('pending-role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5 // 5 minutes
    })
    
    return response
    
  } catch (error) {
    console.error('Google signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}