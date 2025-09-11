import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import { sendWelcomeEmail } from '@/lib/services/email'
import { z } from 'zod'

const completeProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone must be 10 digits starting with 6, 7, 8, or 9'),
  role: z.enum(['hirer', 'fixer']),
  address: z.string().min(1, 'Address is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  skills: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = completeProfileSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { username, phone, role, address, coordinates, skills = [] } = validationResult.data

    await connectToDatabase()

    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: session.user.id } 
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        username,
        phone,
        role,
        location: {
          type: 'manual',
          address,
          coordinates,
          city: 'Unknown', // You might want to extract this from address
          state: 'Unknown', // You might want to extract this from address
          stateCode: 'XX' // You might want to extract this from address
        },
        skills: role === 'fixer' ? skills : [],
        metadata: {
          profileCompleted: true,
          profileCompletedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Send welcome email for Google OAuth users completing their profile
    sendWelcomeEmail(updatedUser.email, updatedUser.name, role).catch(error => {
      console.error('Failed to send welcome email:', error)
      // Don't throw error - profile completion should succeed even if email fails
    })

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        homeAddress: updatedUser.homeAddress,
        currentLocation: updatedUser.currentLocation,
        skills: updatedUser.skills,
        avatar: updatedUser.avatar
      }
    })

  } catch (error) {
    console.error('Complete profile error:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      // Duplicate key error
      const mongoError = error as any
      const field = Object.keys(mongoError.keyPattern)[0]
      return NextResponse.json(
        { error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}