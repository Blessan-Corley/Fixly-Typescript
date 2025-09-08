import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import { createTokens } from '@/lib/auth/jwt'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20)
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone must be 10 digits starting with 6, 7, 8, or 9'),
  role: z.enum(['hirer', 'fixer']),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }),
    city: z.string().optional(),
    state: z.string().optional(),
    stateCode: z.string().optional()
  }),
  skills: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const {
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      role,
      location,
      skills = [],
      termsAccepted,
      privacyAccepted
    } = validationResult.data

    // Additional password validation
    if (/^[0-9]+$/.test(password)) {
      return NextResponse.json(
        { error: 'Password cannot be only numbers' },
        { status: 400 }
      )
    }
    
    if (['12345678', 'password', '123456789'].includes(password.toLowerCase())) {
      return NextResponse.json(
        { error: 'Password is too common' },
        { status: 400 }
      )
    }

    // Check if email is verified
    const isEmailVerified = await RedisService.isEmailVerified(email)
    if (!isEmailVerified) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please verify your email before completing signup',
          nextStep: 'email-verification'
        },
        { status: 400 }
      )
    }

    await connectToDatabase()
    
    // Check for existing user or username
    const [existingUser, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ])
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }
    
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new User({
      email,
      passwordHash,
      name: `${firstName} ${lastName}`,
      username,
      phone,
      role,
      location: {
        type: 'manual',
        address: location.address,
        coordinates: location.coordinates,
        city: location.city || 'Unknown',
        state: location.state || 'Unknown',
        stateCode: location.stateCode || 'XX'
      },
      skills: role === 'fixer' ? skills : [],
      metadata: {
        emailVerified: true, // Email was verified via OTP
        source: 'email',
        profileCompleted: true,
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date()
      }
    })

    await user.save()
    
    // Clean up Redis data
    await Promise.all([
      RedisService.deleteSignupProgress(email),
      RedisService.deleteOTP(email) // In case there's any leftover OTP
    ])

    // Generate JWT tokens
    const { accessToken, refreshToken } = createTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      username: user.username
    })

    // Store refresh token in database
    user.metadata.refreshToken = refreshToken
    await user.save()

    // Set HTTP-only cookie for refresh token
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Fixly!',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        phone: user.phone,
        location: user.location,
        skills: user.skills,
        avatar: user.avatar,
        emailVerified: true
      },
      accessToken,
      nextStep: 'dashboard'
    })

    // Set refresh token cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0]
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
