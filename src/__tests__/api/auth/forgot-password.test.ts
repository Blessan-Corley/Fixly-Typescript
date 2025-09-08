/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/forgot-password/route'

// Dependencies are globally mocked in jest.setup.js

describe('/api/auth/forgot-password', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
      headers: new Headers(),
    } as Partial<NextRequest>
    
    jest.clearAllMocks()
  })

  describe('POST /api/auth/forgot-password', () => {
    it('successfully sends password reset OTP', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      // Mock successful rate limiting
      rateLimit.mockResolvedValue({ success: true })

      // Mock request data
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      })

      // Mock user found
      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          otpAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      // Mock OTP generation
      generateOTP.mockReturnValue('123456')
      createOTPToken.mockReturnValue('reset-token')

      // Mock email sending
      sendOTPEmail.mockResolvedValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Password reset code sent to your email')

      // Verify reset token was set
      expect(mockUser.metadata.passwordResetToken).toBe('reset-token')
      expect(mockUser.metadata.passwordResetExpires).toBeDefined()
      expect(mockUser.metadata.otpAttempts).toBe(0)
      expect(mockUser.save).toHaveBeenCalled()

      // Verify email was sent
      expect(sendOTPEmail).toHaveBeenCalledWith('test@example.com', 'Test User', '123456', 'password_reset')
    })

    it('handles user not found', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'notfound@example.com',
      })

      User.findOne.mockResolvedValue(null)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      // Should return success even for non-existent users (security)
      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Password reset code sent to your email')
    })

    it('rejects unverified email accounts', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'unverified@example.com',
      })

      const mockUser = {
        metadata: {
          emailVerified: false, // Not verified
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Please verify your email address first')
    })

    it('rejects locked accounts', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'locked@example.com',
      })

      const mockUser = {
        metadata: {
          emailVerified: true,
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // Locked for 30 minutes
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(423)
      expect(responseData.error).toBe('Account is temporarily locked. Please try again later.')
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
      expect(responseData.error).toBe('Too many password reset attempts. Please try again later.')
      expect(responseData.retryAfter).toBe(300)
    })

    it('validates email format', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      // Invalid email format
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'invalid-email-format',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('validates required fields', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      // Missing email
      ;(mockRequest.json as jest.Mock).mockResolvedValue({})

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('handles email sending failure', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      })

      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      generateOTP.mockReturnValue('123456')
      createOTPToken.mockReturnValue('reset-token')
      sendOTPEmail.mockRejectedValue(new Error('Email service down'))

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Failed to send password reset code. Please try again.')
    })

    it('prevents too frequent reset requests', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      })

      const mockUser = {
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // Valid for 10 more minutes
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Password reset code already sent. Please check your email or try again later.')
    })

    it('handles database connection errors', async () => {
      const connectToDatabase = require('@/lib/database/connection')

      connectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error. Please try again.')
    })

    it('sets correct expiration time for reset token', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      })

      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      generateOTP.mockReturnValue('123456')
      createOTPToken.mockReturnValue('reset-token')
      sendOTPEmail.mockResolvedValue(true)

      const beforeTime = new Date(Date.now() + 15 * 60 * 1000 - 1000) // 14:59 from now
      const afterTime = new Date(Date.now() + 15 * 60 * 1000 + 1000) // 15:01 from now

      await POST(mockRequest as NextRequest)

      // Verify reset token expires in ~15 minutes
      const actualExpiry = mockUser.metadata.passwordResetExpires
      expect(actualExpiry).toBeDefined()
      expect(actualExpiry.getTime()).toBeGreaterThan(beforeTime.getTime())
      expect(actualExpiry.getTime()).toBeLessThan(afterTime.getTime())
    })
  })
})