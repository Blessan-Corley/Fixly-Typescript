import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      )
    }
    
    // Validate username format
    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        message: 'Username must be at least 3 characters'
      })
    }
    
    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        message: 'Username can only contain lowercase letters, numbers, and underscores'
      })
    }
    
    await connectToDatabase()
    
    // Check if username exists
    const existingUser = await User.findOne({ 
      username: username.toLowerCase() 
    }).select('username')
    
    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: 'Username is already taken'
      })
    }
    
    return NextResponse.json({
      available: true,
      message: 'Username is available'
    })
    
  } catch (error) {
    console.error('Username validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}