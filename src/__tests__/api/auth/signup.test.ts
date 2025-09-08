/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/signup/route'

// Dependencies are globally mocked in jest.setup.js

describe('/api/auth/signup', () => {
  let mockRequest: Partial<NextRequest>
  
  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
      headers: new Headers(),
    } as Partial<NextRequest>
    
    jest.clearAllMocks()
  })

  it('successfully creates a new user account', async () => {
    const { sendOTPEmail } = require('@/lib/services/email')
    const User = require('@/lib/database/schemas/user')
    
    // Mock request data
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: {
        type: 'manual',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: 'MH',
      },
    })
    
    // Mock user doesn't exist
    User.findByEmailOrUsername.mockResolvedValue(null)
    
    // Mock successful user creation
    const mockSave = jest.fn().mockResolvedValue(true)
    const mockUser = {
      _id: 'user-id-123',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      role: 'hirer',
      avatar: '',
      save: mockSave,
    }
    
    User.mockImplementation(() => mockUser)
    
    // Mock successful email sending
    sendOTPEmail.mockResolvedValue(true)
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(201)
    expect(responseData.success).toBe(true)
    expect(responseData.message).toBe('Account created successfully! Please check your email for verification.')
    expect(responseData.user.email).toBe('test@example.com')
    expect(responseData.user.username).toBe('testuser')
    expect(responseData.nextStep).toBe('email_verification')
    
    // Verify user was saved
    expect(mockSave).toHaveBeenCalled()
    
    // Verify email was sent
    expect(sendOTPEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Test User',
      '123456',
      'email_verification'
    )
  })

  it('rejects invalid email format', async () => {
    const { validateEmail } = require('@/lib/utils/validation')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'invalid-email',
      username: 'testuser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    validateEmail.mockReturnValue(false)
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Invalid email format')
  })

  it('rejects weak password', async () => {
    const { validatePassword } = require('@/lib/utils/validation')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'weak',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    validatePassword.mockReturnValue(false)
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
  })

  it('rejects invalid username', async () => {
    const { validateUsername } = require('@/lib/utils/validation')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'ab',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    validateUsername.mockReturnValue(false)
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Username must be 3-30 characters, alphanumeric and underscores only')
  })

  it('rejects duplicate email', async () => {
    const User = require('@/lib/database/schemas/user')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'existing@example.com',
      username: 'newuser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    // Mock existing user with same email
    User.findByEmailOrUsername.mockResolvedValue({
      email: 'existing@example.com',
      username: 'differentuser',
    })
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(409)
    expect(responseData.error).toBe('Email already registered')
  })

  it('rejects duplicate username', async () => {
    const User = require('@/lib/database/schemas/user')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'new@example.com',
      username: 'existinguser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    // Mock existing user with same username
    User.findByEmailOrUsername.mockResolvedValue({
      email: 'different@example.com',
      username: 'existinguser',
    })
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(409)
    expect(responseData.error).toBe('Username already taken')
  })

  it('handles rate limiting', async () => {
    const { rateLimit } = require('@/lib/utils/rateLimit')
    
    // Mock rate limit exceeded
    rateLimit.mockResolvedValue({
      success: false,
      retryAfter: 300,
    })
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(429)
    expect(responseData.error).toBe('Too many signup attempts. Please try again later.')
    expect(responseData.retryAfter).toBe(300)
  })

  it('handles email sending failure by cleaning up user', async () => {
    const { sendOTPEmail } = require('@/lib/services/email')
    const User = require('@/lib/database/schemas/user')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    User.findByEmailOrUsername.mockResolvedValue(null)
    
    const mockUser = {
      _id: 'user-id-123',
      save: jest.fn().mockResolvedValue(true),
    }
    User.mockImplementation(() => mockUser)
    
    // Mock email sending failure
    sendOTPEmail.mockRejectedValue(new Error('Email service down'))
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Failed to send verification email. Please try again.')
    
    // Verify user was deleted
    expect(User.deleteOne).toHaveBeenCalledWith({ _id: 'user-id-123' })
  })

  it('validates Zod schema', async () => {
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      // Missing required fields
      email: 'test@example.com',
      // username missing
      // password missing
      role: 'invalid-role',
    })
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Validation failed')
    expect(responseData.details).toBeInstanceOf(Array)
  })

  it('handles fixer role with skills', async () => {
    const User = require('@/lib/database/schemas/user')
    const { sendOTPEmail } = require('@/lib/services/email')
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'fixer@example.com',
      username: 'fixeruser',
      password: 'Password123!',
      name: 'Fixer User',
      role: 'fixer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
      skills: [
        {
          id: 'plumbing',
          name: 'Plumbing',
          category: 'plumbing',
          experience: 'expert',
          hourlyRate: { min: 500, max: 1000 },
        },
      ],
    })
    
    User.findByEmailOrUsername.mockResolvedValue(null)
    
    const mockUser = {
      _id: 'fixer-id-123',
      email: 'fixer@example.com',
      username: 'fixeruser',
      name: 'Fixer User',
      role: 'fixer',
      avatar: '',
      save: jest.fn().mockResolvedValue(true),
    }
    User.mockImplementation(() => mockUser)
    
    sendOTPEmail.mockResolvedValue(true)
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(201)
    expect(responseData.success).toBe(true)
    expect(responseData.user.role).toBe('fixer')
  })

  it('handles database connection errors', async () => {
    const connectToDatabase = require('@/lib/database/connection')
    
    connectToDatabase.mockRejectedValue(new Error('Database connection failed'))
    
    ;(mockRequest.json as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123!',
      name: 'Test User',
      role: 'hirer',
      location: { type: 'manual', city: 'Mumbai', state: 'Maharashtra', stateCode: 'MH' },
    })
    
    const response = await POST(mockRequest as NextRequest)
    const responseData = await response.json()
    
    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Internal server error. Please try again.')
  })
})