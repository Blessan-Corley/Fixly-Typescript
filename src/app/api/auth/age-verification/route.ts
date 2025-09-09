import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import { z } from 'zod'

const ageVerificationSchema = z.object({
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date)
    const now = new Date()
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate())
    
    return !isNaN(parsed.getTime()) && 
           parsed <= now && 
           parsed >= hundredYearsAgo
  }, 'Invalid birth date')
})

// Calculate age from birth date
function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// POST - Submit age verification
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
    const validationResult = ageVerificationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid birth date',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { dateOfBirth } = validationResult.data
    const birthDate = new Date(dateOfBirth)
    const age = calculateAge(birthDate)

    await connectToDatabase()

    // Get user to check role
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check minimum age requirements
    const minAge = user.role === 'fixer' ? 18 : 16
    if (age < minAge) {
      return NextResponse.json(
        { 
          error: 'Age requirement not met',
          message: `You must be at least ${minAge} years old to ${user.role === 'fixer' ? 'offer services' : 'hire fixers'} on Fixly`,
          userAge: age,
          requiredAge: minAge
        },
        { status: 400 }
      )
    }

    // Update user with birth date and verification status
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        dateOfBirth: birthDate,
        'metadata.ageVerified': true,
        'metadata.ageVerifiedAt': new Date(),
        'metadata.updatedAt': new Date()
      },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    // Cache verification status in Redis for faster access
    try {
      await RedisService.storeSession(
        `age_verified:${session.user.id}`,
        { verified: true, verifiedAt: new Date(), age },
        24 * 7 // Cache for 1 week
      )
    } catch (redisError) {
      console.warn('Redis cache failed, continuing without cache:', redisError instanceof Error ? redisError.message : 'Unknown error')
    }

    return NextResponse.json({
      success: true,
      message: 'Age verified successfully',
      user: {
        id: updatedUser._id,
        dateOfBirth: updatedUser.dateOfBirth,
        ageVerified: true,
        age: age
      }
    })

  } catch (error) {
    console.error('Age verification error:', error)
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}