/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/signin/route'

// Dependencies are globally mocked in jest.setup.js

describe('/api/auth/signin', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
      headers: new Headers(),
    } as Partial<NextRequest>
    
    jest.clearAllMocks()
  })

  describe('POST /api/auth/signin', () => {
    it('successfully signs in with valid credentials', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { createTokens } = require('@/lib/auth/jwt')
      const bcrypt = require('bcryptjs')

      // Mock successful rate limiting
      rateLimit.mockResolvedValue({ success: true })

      // Mock request data
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'Password123!',
        rememberMe: false,
      })

      // Mock user found
      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'hirer',
        avatar: '',
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          loginAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      // Mock valid password
      bcrypt.compare.mockResolvedValue(true)

      // Mock token creation
      createTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Sign in successful')
      expect(responseData.user.email).toBe('test@example.com')
      expect(responseData.tokens).toBeDefined()

      // Verify login attempts were reset
      expect(mockUser.metadata.loginAttempts).toBe(0)
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('rejects invalid password', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const bcrypt = require('bcryptjs')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      })

      const mockUser = {
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          loginAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      // Mock invalid password
      bcrypt.compare.mockResolvedValue(false)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(401)
      expect(responseData.error).toBe('Invalid credentials')

      // Verify login attempt was incremented
      expect(mockUser.metadata.loginAttempts).toBe(1)
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('locks account after 5 failed attempts', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const bcrypt = require('bcryptjs')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      })

      const mockUser = {
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          loginAttempts: 4, // 5th attempt
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      bcrypt.compare.mockResolvedValue(false)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(423)
      expect(responseData.error).toBe('Account locked due to too many failed login attempts')

      // Verify account was locked
      expect(mockUser.metadata.loginAttempts).toBe(5)
      expect(mockUser.metadata.lockedUntil).toBeDefined()
    })

    it('rejects signin for locked account', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'Password123!',
        rememberMe: false,
      })

      const mockUser = {
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // Locked for 30 minutes
          loginAttempts: 5,
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(423)
      expect(responseData.error).toBe('Account is temporarily locked. Please try again later.')
    })

    it('rejects signin for unverified email', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const bcrypt = require('bcryptjs')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'Password123!',
        rememberMe: false,
      })

      const mockUser = {
        password: 'hashed-password',
        metadata: {
          emailVerified: false, // Not verified
          lockedUntil: null,
          loginAttempts: 0,
        },
      }
      User.findOne.mockResolvedValue(mockUser)

      bcrypt.compare.mockResolvedValue(true)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(403)
      expect(responseData.error).toBe('Please verify your email before signing in')
    })

    it('handles user not found', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'notfound@example.com',
        password: 'Password123!',
        rememberMe: false,
      })

      User.findOne.mockResolvedValue(null)

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(401)
      expect(responseData.error).toBe('Invalid credentials')
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
      expect(responseData.error).toBe('Too many login attempts. Please try again later.')
      expect(responseData.retryAfter).toBe(300)
    })

    it('validates request body', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')

      rateLimit.mockResolvedValue({ success: true })

      // Invalid request body
      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: '', // Empty
        password: '12345', // Too short
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Validation failed')
      expect(responseData.details).toBeInstanceOf(Array)
    })

    it('supports signin with username', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { createTokens } = require('@/lib/auth/jwt')
      const bcrypt = require('bcryptjs')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'testuser',
        password: 'Password123!',
        rememberMe: false,
      })

      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'hirer',
        avatar: '',
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          loginAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      bcrypt.compare.mockResolvedValue(true)
      createTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { email: 'testuser' },
          { username: 'testuser' }
        ]
      })
    })

    it('handles database connection errors', async () => {
      const connectToDatabase = require('@/lib/database/connection')

      connectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'Password123!',
        rememberMe: false,
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error. Please try again.')
    })

    it('handles remember me functionality', async () => {
      const { rateLimit } = require('@/lib/utils/rateLimit')
      const User = require('@/lib/database/schemas/user')
      const { createTokens } = require('@/lib/auth/jwt')
      const bcrypt = require('bcryptjs')

      rateLimit.mockResolvedValue({ success: true })

      ;(mockRequest.json as jest.Mock).mockResolvedValue({
        identifier: 'test@example.com',
        password: 'Password123!',
        rememberMe: true, // Remember me enabled
      })

      const mockUser = {
        _id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'hirer',
        avatar: '',
        password: 'hashed-password',
        metadata: {
          emailVerified: true,
          lockedUntil: null,
          loginAttempts: 0,
        },
        save: jest.fn().mockResolvedValue(true),
      }
      User.findOne.mockResolvedValue(mockUser)

      bcrypt.compare.mockResolvedValue(true)
      createTokens.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })

      const response = await POST(mockRequest as NextRequest)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.success).toBe(true)
      // Verify tokens were created with extended expiry
      expect(createTokens).toHaveBeenCalledWith(mockUser._id, true)
    })
  })
})