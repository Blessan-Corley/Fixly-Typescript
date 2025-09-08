/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST, PATCH } from '@/app/api/auth/verify-otp/route'

// Dependencies are globally mocked in jest.setup.js

describe('/api/auth/verify-otp', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
      headers: new Headers(),
    } as Partial<NextRequest>
    
    jest.clearAllMocks()
  })

  describe('POST /api/auth/verify-otp', () => {
    it('successfully verifies email with valid OTP', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { verifyOTPToken } = require('@/lib/auth/otp')
      const { createTokens } = require('@/lib/auth/jwt')
      const { sendWelcomeEmail } = require('@/lib/services/email')

      // Mock successful rate limiting
      rateLimit.mockResolvedValue({ success: true })

      // Mock request data
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '123456',
        type: 'email_verification',
      })

      // Mock user found
      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'hirer',
        avatar: '',
        metadata: {
          emailVerified: false,
          emailVerificationToken: 'valid-token',
          emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min future
          otpAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      // Mock valid OTP
      verifyOTPToken.mockReturnValue(true)

      // Mock token creation
      createTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })

      // Mock welcome email
      sendWelcomeEmail.mockResolvedValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Email verified successfully! Welcome to Fixly!')
      expect(responseData.user.emailVerified).toBe(true)
      expect(responseData.tokens).toBeDefined()
      expect(responseData.nextStep).toBe('dashboard')

      // Verify user was updated
      expect(mockUser.metadata.emailVerified).toBe(true)
      expect(mockUser.metadata.emailVerificationToken).toBeUndefined()
      expect(mockUser.save).toHaveBeenCalled()

      // Verify welcome email was sent
      expect(sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test User', 'hirer')
    })

    it('rejects invalid OTP', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { verifyOTPToken } = require('@/lib/auth/otp')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '000000',
        type: 'email_verification',
      })

      const mockUser = {
        metadata: {
          emailVerified: false,
          emailVerificationToken: 'valid-token',
          emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
          otpAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      // Mock invalid OTP
      verifyOTPToken.mockReturnValue(false)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Invalid verification code')

      // Verify attempt was incremented
      expect(mockUser.metadata.otpAttempts).toBe(1)
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('locks account after 5 failed attempts', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { verifyOTPToken } = require('@/lib/auth/otp')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '000000',
        type: 'email_verification',
      })

      const mockUser = {
        metadata: {
          emailVerified: false,
          emailVerificationToken: 'valid-token',
          emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
          otpAttempts: 4, // 5th attempt
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      verifyOTPToken.mockReturnValue(false)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Account temporarily locked due to too many failed attempts')

      // Verify account was locked
      expect(mockUser.metadata.otpAttempts).toBe(5)
      expect(mockUser.metadata.lockedUntil).toBeDefined()
      expect(mockUser.metadata.emailVerificationToken).toBeUndefined()
    })

    it('rejects expired OTP', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '123456',
        type: 'email_verification',
      })

      const mockUser = {
        metadata: {
          emailVerified: false,
          emailVerificationToken: 'expired-token',
          emailVerificationExpires: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Verification code has expired. Please request a new one.')

      // Verify expired token was cleared
      expect(mockUser.metadata.emailVerificationToken).toBeUndefined()
      expect(mockUser.metadata.emailVerificationExpires).toBeUndefined()
    })

    it('handles already verified email', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '123456',
        type: 'email_verification',
      })

      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'hirer',
        avatar: '',
        metadata: {
          emailVerified: true, // Already verified
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Email already verified')
      expect(responseData.nextStep).toBe('login')
    })

    it('handles password reset verification', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { verifyOTPToken } = require('@/lib/auth/otp')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        otp: '123456',
        type: 'password_reset',
      })

      const mockUser = {
        metadata: {
          passwordResetToken: 'valid-token',
          passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
          otpAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      verifyOTPToken.mockReturnValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Verification successful. You can now reset your password.')
      expect(responseData.nextStep).toBe('set_new_password')
      expect(responseData.resetToken).toBe('valid-token')
    })

    it('handles rate limiting', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({
        success: false,
        retryAfter: 300,
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(429)
      expect(responseData.error).toBe('Too many verification attempts. Please try again later.')
      expect(responseData.retryAfter).toBe(300)
    })

    it('validates request body', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      // Invalid request body
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'invalid-email',
        otp: '12345', // Wrong length
        type: 'invalid-type',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })
  })

  describe('PATCH /api/auth/verify-otp (Resend)', () => {
    it('successfully resends OTP', async () => {
      const User = require('@/lib/database/schemas/user')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        type: 'email_verification',
      })

      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          emailVerified: false,
          lockedUntil: null,
          otpAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      generateOTP.mockReturnValue('654321')
      createOTPToken.mockReturnValue('new-token')
      sendOTPEmail.mockResolvedValue(true)

      const response = await PATCH(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('New verification code sent to your email')

      // Verify new token was set
      expect(mockUser.metadata.emailVerificationToken).toBe('new-token')
      expect(mockUser.metadata.otpAttempts).toBe(0)
      expect(mockUser.save).toHaveBeenCalled()

      // Verify email was sent
      expect(sendOTPEmail).toHaveBeenCalledWith('test@example.com', 'Test User', '654321', 'email_verification')
    })

    it('rejects resend for already verified email', async () => {
      const User = require('@/lib/database/schemas/user')

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        type: 'email_verification',
      })

      const mockUser = {
        metadata: {
          emailVerified: true, // Already verified
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await PATCH(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Email is already verified')
    })

    it('rejects resend for locked account', async () => {
      const User = require('@/lib/database/schemas/user')

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        type: 'email_verification',
      })

      const mockUser = {
        metadata: {
          emailVerified: false,
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // Locked for 30 more minutes
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await PATCH(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(423)
      expect(responseData.error).toBe('Account is temporarily locked. Please try again later.')
    })

    it('handles user not found', async () => {
      const User = require('@/lib/database/schemas/user')

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'notfound@example.com',
        type: 'email_verification',
      })

      User.findOne.mockResolvedValue(null)

      const response = await PATCH(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(404)
      expect(responseData.error).toBe('User not found')
    })

    it('handles email sending failure', async () => {
      const User = require('@/lib/database/schemas/user')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        type: 'email_verification',
      })

      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          emailVerified: false,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      generateOTP.mockReturnValue('654321')
      createOTPToken.mockReturnValue('new-token')
      sendOTPEmail.mockRejectedValue(new Error('Email service down'))

      const response = await PATCH(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Failed to send verification code. Please try again.')
    })
  })
})