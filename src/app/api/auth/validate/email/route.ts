import { NextRequest, NextResponse } from 'next/server'
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
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        available: false,
        message: 'Please enter a valid email address'
      })
    }
    
    await connectToDatabase()
    
    // Check if email exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('email role')
    
    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: 'User already exists with this email. Try login or another email.',
        shouldRedirectToLogin: true
      })
    }
    
    return NextResponse.json({
      available: true,
      message: 'Email is available'
    })
    
  } catch (error) {
    console.error('Email validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}