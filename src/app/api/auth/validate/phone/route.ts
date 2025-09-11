import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone parameter is required' },
        { status: 400 }
      )
    }
    
    // Clean and validate phone format
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length !== 10) {
      return NextResponse.json({
        available: false,
        message: 'Phone number must be exactly 10 digits'
      })
    }
    
    if (!/^[6-9]/.test(cleanPhone)) {
      return NextResponse.json({
        available: false,
        message: 'Phone number must start with 6, 7, 8, or 9'
      })
    }
    
    await connectToDatabase()
    
    // Check if phone exists
    const existingUser = await User.findOne({ 
      phone: cleanPhone 
    }).select('phone')
    
    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: 'Phone number is already registered'
      })
    }
    
    return NextResponse.json({
      available: true,
      message: 'Phone number is available'
    })
    
  } catch (error) {
    console.error('Phone validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}