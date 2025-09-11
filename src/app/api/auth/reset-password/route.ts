import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import { verifyPasswordResetToken } from '@/lib/auth/jwt'
import { ApiResponse } from '@/types'

// Request validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)
    const { token, password } = validatedData

    // Verify the reset token
    let email: string
    try {
      const decoded = verifyPasswordResetToken(token)
      email = decoded.email
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired reset token'
      }, { status: 400 })
    }

    // Find user and verify token matches
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired reset token'
      }, { status: 400 })
    }

    // Update password and clear reset token fields
    user.passwordHash = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    
    // Clear any account locks and reset login attempts  
    user.metadata.loginAttempts = 0
    user.metadata.isLocked = false
    user.metadata.lockUntil = undefined
    
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Reset password error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.issues[0].message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}