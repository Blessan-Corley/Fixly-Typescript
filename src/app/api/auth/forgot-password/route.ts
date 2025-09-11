import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import { generatePasswordResetToken } from '@/lib/auth/jwt'
import { sendOTPEmail } from '@/lib/email/service'
import { generateOTP } from '@/lib/utils/otp'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Rate limiting check
    const rateLimit = await RedisService.checkRateLimit(
      `reset_password:${email}`,
      5, // 5 attempts
      15 // 15 minutes
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime.getTime() - Date.now()) / 1000)
        },
        { status: 429 }
      )
    }

    await connectToDatabase()
    
    // Check if user exists
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+metadata')
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset code has been sent.'
      })
    }

    // Check if email is verified
    if (!user.metadata.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email address first' },
        { status: 400 }
      )
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return NextResponse.json(
        { error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      )
    }

    // Check for recent reset requests (prevent spam)
    const existingToken = user.metadata.passwordResetToken
    const tokenExpires = user.metadata.passwordResetExpires
    
    if (existingToken && tokenExpires && new Date() < tokenExpires) {
      const timeRemaining = Math.ceil((tokenExpires.getTime() - Date.now()) / (1000 * 60))
      return NextResponse.json(
        { 
          error: 'Password reset already requested. Please check your email or try again later.',
          timeRemaining: `${timeRemaining} minutes`
        },
        { status: 400 }
      )
    }

    // Generate OTP and reset token
    const otp = generateOTP()
    const resetToken = generatePasswordResetToken(email)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in Redis
    await RedisService.storeOTP(email, otp, 10) // 10 minutes

    // Update user with reset token
    user.metadata.passwordResetToken = resetToken
    user.metadata.passwordResetExpires = expiresAt
    user.metadata.otpAttempts = 0 // Reset OTP attempts
    await user.save()

    // Send email with OTP
    try {
      await sendOTPEmail(email, user.name || 'User', otp, 'password_reset')
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Continue without failing - for development/testing
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email address'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}