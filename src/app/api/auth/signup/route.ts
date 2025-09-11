import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import { createTokens } from '@/lib/auth/jwt'
import { sendWelcomeEmail } from '@/lib/services/email'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(), // Optional for Google OAuth
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
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    stateCode: z.string().min(1, 'State code is required'),
    pincode: z.string().optional()
  }),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(), // For Google profile pictures
  isGoogleSignup: z.boolean().optional(), // Flag for Google OAuth signup
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy policy')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get request metadata for comprehensive tracking
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || undefined
    
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
      avatar,
      isGoogleSignup = false,
      termsAccepted,
      privacyAccepted
    } = validationResult.data

    // Additional password validation (skip for Google signup)
    if (password && !isGoogleSignup) {
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
    }
    
    // For Google signup, password is not required
    if (!isGoogleSignup && !password) {
      return NextResponse.json(
        { error: 'Password is required for email signup' },
        { status: 400 }
      )
    }

    // Check if email is verified (skip for Google signup since Google already verified)
    if (!isGoogleSignup) {
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
    }

    await connectToDatabase()
    
    // Check for existing user, username, or phone
    const [existingUser, existingUsername, existingPhone] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
      User.findOne({ phone })
    ])
    
    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'User already exists with this email. Try login or another email.',
          shouldRedirectToLogin: true
        },
        { status: 409 }
      )
    }
    
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }
    
    if (existingPhone) {
      return NextResponse.json(
        { error: 'Phone number is already registered' },
        { status: 409 }
      )
    }

    // Hash password (or set OAuth placeholder for Google users)
    let passwordHash: string
    if (isGoogleSignup) {
      passwordHash = 'google-oauth' // Placeholder for Google OAuth users
    } else {
      const saltRounds = 12
      passwordHash = await bcrypt.hash(password!, saltRounds)
    }

    // Helper function to get region from state
    const getRegionFromState = (state: string): string => {
      const stateToRegion: { [key: string]: string } = {
        // North India
        'Delhi': 'North India',
        'Punjab': 'North India',
        'Haryana': 'North India',
        'Himachal Pradesh': 'North India',
        'Jammu and Kashmir': 'North India',
        'Ladakh': 'North India',
        'Uttarakhand': 'North India',
        'Uttar Pradesh': 'North India',
        
        // West India
        'Rajasthan': 'West India',
        'Gujarat': 'West India',
        'Maharashtra': 'West India',
        'Goa': 'West India',
        'Dadra and Nagar Haveli and Daman and Diu': 'West India',
        
        // South India
        'Karnataka': 'South India',
        'Kerala': 'South India',
        'Tamil Nadu': 'South India',
        'Andhra Pradesh': 'South India',
        'Telangana': 'South India',
        'Puducherry': 'South India',
        'Lakshadweep': 'South India',
        'Andaman and Nicobar Islands': 'South India',
        
        // East India
        'West Bengal': 'East India',
        'Odisha': 'East India',
        'Jharkhand': 'East India',
        'Bihar': 'East India',
        'Sikkim': 'East India',
        
        // Northeast India
        'Assam': 'Northeast India',
        'Arunachal Pradesh': 'Northeast India',
        'Manipur': 'Northeast India',
        'Meghalaya': 'Northeast India',
        'Mizoram': 'Northeast India',
        'Nagaland': 'Northeast India',
        'Tripura': 'Northeast India',
        
        // Central India
        'Madhya Pradesh': 'Central India',
        'Chhattisgarh': 'Central India'
      }
      
      return stateToRegion[state] || 'India'
    }

    // Create comprehensive user with all required fields and metadata
    const user = new User({
      // Core user information
      email,
      passwordHash,
      name: `${firstName} ${lastName}`,
      username,
      phone,
      role,
      avatar: avatar || undefined, // Google profile picture or undefined
      bio: undefined, // Optional, can be updated later
      dateOfBirth: undefined, // Optional, will be required for age verification
      
      // Home/Permanent Address from signup
      homeAddress: {
        type: 'manual',
        address: location.address,
        coordinates: location.coordinates,
        city: location.city,
        state: location.state,
        stateCode: location.stateCode,
        pincode: location.pincode || undefined,
        timestamp: new Date(),
        verified: false // Manually entered, not GPS verified
      },
      
      // Current Location initially undefined (will be set when GPS permission granted)
      currentLocation: undefined,
      
      // Location Permission Settings - Start with not requested
      locationPermission: {
        status: 'not_requested',
        lastAsked: undefined,
        sessionExpiry: undefined,
        autoUpdateEnabled: false,
        lastAutoUpdate: undefined,
        updateInterval: 30, // 30 minutes default
        denialCount: 0
      },
      
      // Location History - Initialize with home address
      locationHistory: [{
        coordinates: location.coordinates,
        address: location.address,
        city: location.city,
        state: location.state,
        timestamp: new Date(),
        method: 'manual'
      }],
      
      // Automatically set approximate location for privacy (from home address)
      approximateLocation: {
        city: location.city,
        state: location.state,
        region: getRegionFromState(location.state),
        lastUpdated: new Date(),
        source: 'home' // Using home address initially
      },
      
      // Service radius for fixers
      serviceRadius: role === 'fixer' ? 10 : undefined, // 10km default for fixers
      
      // Skills and experience
      skills: role === 'fixer' ? skills : [],
      skillCategories: role === 'fixer' ? [...new Set(skills.map(() => 'general'))] : [], // Can be enhanced later
      experience: [], // Empty initially, to be filled later
      
      // Ratings (starts at 0)
      rating: {
        average: 0,
        count: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      },
      
      // Statistics
      stats: {
        jobsCompleted: 0,
        jobsPosted: 0,
        totalEarnings: 0,
        totalSpent: 0,
        responseTime: 0,
        acceptanceRate: 0
      },
      
      // Account status
      isActive: true,
      isVerified: false, // Will be true after phone verification
      subscription: {
        plan: 'free',
        features: []
      },
      
      // Security fields
      refreshTokens: [],
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      
      // Comprehensive metadata with all tracking info
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: undefined, // Will be set on first login
        ipAddress: ipAddress,
        userAgent: userAgent,
        source: isGoogleSignup ? 'google' : 'web',
        referrer: referrer,
        emailVerified: true, // Email was verified via OTP or Google
        phoneVerified: false, // Will need separate phone verification
        profileCompleted: true,
        ageVerified: false, // Will need age verification flow
        ageVerifiedAt: undefined,
        agreementVersion: '1.0', // Current terms version
        marketingConsent: false, // Default to false for privacy
        loginAttempts: 0,
        lastLoginAttempt: undefined,
        isLocked: false,
        lockUntil: undefined,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        otpAttempts: 0,
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
        refreshToken: undefined // Will be set after save
      }
    })

    await user.save()
    
    // Clean up Redis data
    await Promise.all([
      RedisService.deleteSignupProgress(email),
      RedisService.deleteOTP(email) // In case there's any leftover OTP
    ])

    // Send welcome email (don't wait for it to avoid delaying response)
    sendWelcomeEmail(email, `${firstName} ${lastName}`, role).catch(error => {
      console.error('Failed to send welcome email:', error)
      // Don't throw error - signup should succeed even if email fails
    })

    // Generate JWT tokens
    const { accessToken, refreshToken } = createTokens({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      username: user.username
    })

    // Store refresh token in database
    ;(user.metadata as any).refreshToken = refreshToken
    await user.save()

    // Set HTTP-only cookie for refresh token
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Fixly!',
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        phone: user.phone,
        homeAddress: user.homeAddress,
        currentLocation: user.currentLocation,
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
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      // MongoDB duplicate key error
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
