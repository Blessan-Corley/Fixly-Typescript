import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import { createTokens } from '@/lib/auth/jwt'

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['signup', 'reset']).default('signup')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = verifyOtpSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { email, otp, type } = validationResult.data
    
    // Rate limiting for verification attempts - 10 attempts per 15 minutes
    const rateLimitResult = await RedisService.checkRateLimit(
      `verify:${email}`,
      10,
      15
    )
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many verification attempts',
          message: `Please wait ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 60000)} minutes before trying again`
        },
        { status: 429 }
      )
    }

    // Get stored OTP from Redis
    const storedOtp = await RedisService.getOTP(email)
    
    if (!storedOtp) {
      return NextResponse.json(
        { error: 'OTP has expired or does not exist. Please request a new code.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedOtp !== otp) {
      return NextResponse.json(
        { 
          error: 'Invalid verification code',
          remaining: rateLimitResult.remaining
        },
        { status: 400 }
      )
    }

    await connectToDatabase()
    
    if (type === 'signup') {
      // Mark email as verified in Redis (temporary verification status)
      await RedisService.markEmailVerified(email, 1) // 1 hour
      
      // Delete the used OTP
      await RedisService.deleteOTP(email)
      
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully! You can now complete your registration.',
        emailVerified: true,
        nextStep: 'profile-details'
      })
      
    } else if (type === 'reset') {
      // For password reset - create a reset token
      const user = await User.findOne({ email })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      
      // Generate reset token
      const { accessToken, refreshToken } = createTokens({
        userId: user._id.toString(),
        email: user.email,
        type: 'password-reset'
      })
      
      // Delete the used OTP
      await RedisService.deleteOTP(email)
      
      return NextResponse.json({
        success: true,
        message: 'OTP verified. You can now reset your password.',
        resetToken: accessToken,
        nextStep: 'reset-password'
      })
    }

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Resend OTP
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type = 'signup' } = body
    
    if (!email || !z.string().email().safeParse(email).success) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if there's an existing OTP (prevent spam)
    const existingOtp = await RedisService.getOTP(email)
    if (existingOtp) {
      return NextResponse.json(
        { error: 'Please wait before requesting a new code' },
        { status: 429 }
      )
    }

    // Rate limiting for resend - 3 requests per 15 minutes
    const rateLimitResult = await RedisService.checkRateLimit(
      `resend:${email}`,
      3,
      15
    )
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many resend requests',
          message: `Please wait ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 60000)} minutes`
        },
        { status: 429 }
      )
    }

    // Forward to send-otp endpoint
    const sendOtpUrl = new URL('/api/auth/send-otp', request.url)
    const sendOtpResponse = await fetch(sendOtpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, type })
    })

    const result = await sendOtpResponse.json()
    
    return NextResponse.json(result, { status: sendOtpResponse.status })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
