/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/send-otp/route'

// Dependencies are globally mocked in jest.setup.js

describe('/api/auth/send-otp', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
      headers: new Headers(),
    } as Partial<NextRequest>
    
    jest.clearAllMocks()
  })

  describe('POST /api/auth/send-otp', () => {
    it('successfully sends OTP for email verification', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      // Mock successful rate limiting
      rateLimit.mockResolvedValue({ success: true })

      // Mock request data
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        type: 'email_verification',
      })

      // Mock OTP generation
      generateOTP.mockReturnValue('123456')
      createOTPToken.mockReturnValue('verification-token')

      // Mock email sending
      sendOTPEmail.mockResolvedValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Verification code sent successfully')
      expect(responseData.token).toBe('verification-token')

      // Verify email was sent
      expect(sendOTPEmail).toHaveBeenCalledWith('test@example.com', 'Test User', '123456', 'email_verification')
    })

    it('successfully sends OTP for password reset', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        type: 'password_reset',
      })

      generateOTP.mockReturnValue('654321')
      createOTPToken.mockReturnValue('reset-token')
      sendOTPEmail.mockResolvedValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Verification code sent successfully')
      expect(responseData.token).toBe('reset-token')

      expect(sendOTPEmail).toHaveBeenCalledWith('test@example.com', 'Test User', '654321', 'password_reset')
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
      expect(responseData.error).toBe('Too many OTP requests. Please try again later.')
      expect(responseData.retryAfter).toBe(300)
    })

    it('validates required fields', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      // Missing required fields
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        // name missing
        // type missing
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('validates email format', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'invalid-email-format',
        name: 'Test User',
        type: 'email_verification',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('validates OTP type', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        type: 'invalid_type',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('handles email sending failure', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const { generateOTP, createOTPToken } = require('@/lib/auth/otp')
      const { sendOTPEmail } = require('@/lib/services/email')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: 'Test User',
        type: 'email_verification',
      })

      generateOTP.mockReturnValue('123456')
      createOTPToken.mockReturnValue('verification-token')
      sendOTPEmail.mockRejectedValue(new Error('Email service down'))

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Failed to send verification code. Please try again.')
    })

    it('handles malformed JSON request', async () => {
      ;(mockRequest.json as jest.Mock).mockRejectedValue(new Error('Invalid JSON'))

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Invalid request format')
    })

    it('validates name field requirements', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: '', // Empty name
        type: 'email_verification',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('handles extremely long name gracefully', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      const longName = 'A'.repeat(300) // Very long name

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        name: longName,
        type: 'email_verification',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
    })
  })
})