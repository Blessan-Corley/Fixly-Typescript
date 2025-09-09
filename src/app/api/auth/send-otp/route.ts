import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'
import nodemailer from 'nodemailer'
import { generateOTP } from '@/lib/auth/otp'

const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  type: z.enum(['signup', 'reset']).default('signup')
})

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = sendOtpSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const { email, type } = validationResult.data
    
    // Rate limiting - 5 OTP requests per 15 minutes per email
    const rateLimitResult = await RedisService.checkRateLimit(
      `otp:${email}`,
      5,
      15
    )
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: `Please wait ${Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 60000)} minutes before requesting another code`,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
    }

    await connectToDatabase()
    
    // Check if user exists based on type
    const existingUser = await User.findOne({ email })
    
    if (type === 'signup' && existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }
    
    if (type === 'reset' && !existingUser) {
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Store OTP in Redis with 10-minute expiry
    await RedisService.storeOTP(email, otp, 10)
    
    // Send email (if SMTP is configured)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const subject = type === 'signup' ? 'Verify your Fixly account' : 'Reset your Fixly password'
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Fixly</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${subject}</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #374151; margin-bottom: 20px;">Your verification code</h2>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8B5CF6;">${otp}</span>
            </div>
            <p style="color: #6b7280; line-height: 1.6;">Enter this 6-digit code to ${type === 'signup' ? 'verify your email and complete your account setup' : 'reset your password'}.</p>
            <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Fixly. All rights reserved.</p>
          </div>
        </div>
      `
      
      try {
        await transporter.sendMail({
          from: `"Fixly" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: email,
          subject,
          html
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue without failing - for development/testing
      }
    }

    // For development/testing, log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${email}: ${otp}`)
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      expiresIn: 600, // 10 minutes in seconds
      remaining: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
