/**
 * @jest-environment node
 */

import { GET } from '@/app/api/auth/validate/email/route'
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

// Mock dependencies
jest.mock('@/lib/database/connection')
jest.mock('@/lib/database/schemas/user')

const mockConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>
const mockUser = User as jest.Mocked<typeof User>

describe('/api/auth/validate/email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectToDatabase.mockResolvedValue(undefined as any)
  })

  describe('GET /api/auth/validate/email', () => {
    it('should return available for unique email', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/email?email=new@example.com')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(true)
      expect(responseData.message).toBe('Email is available')
    })

    it('should return unavailable for existing email with redirect suggestion', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user-id',
        email: 'existing@example.com',
        role: 'hirer'
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/email?email=existing@example.com')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('User already exists with this email. Try login or another email.')
      expect(responseData.shouldRedirectToLogin).toBe(true)
    })

    it('should return error for missing email parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/email')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Email parameter is required')
    })

    it('should return error for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/email?email=invalid-email')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Please enter a valid email address')
    })

    it('should handle case insensitive email checking', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/email?email=Test@Example.Com')
      await GET(request)

      expect(mockUser.findOne).toHaveBeenCalledWith({ 
        email: 'test@example.com' 
      })
    })

    it('should handle database errors gracefully', async () => {
      mockConnectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/auth/validate/email?email=test@example.com')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should validate various email formats', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example.co.uk',
        'user_name@subdomain.example.com'
      ]
      
      for (const email of validEmails) {
        const request = new NextRequest(`http://localhost:3000/api/auth/validate/email?email=${encodeURIComponent(email)}`)
        const response = await GET(request)
        const responseData = await response.json()

        expect(response.status).toBe(200)
        expect(responseData.available).toBe(true)
      }
    })

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'plaintext',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        'user name@example.com'
      ]
      
      for (const email of invalidEmails) {
        const request = new NextRequest(`http://localhost:3000/api/auth/validate/email?email=${encodeURIComponent(email)}`)
        const response = await GET(request)
        const responseData = await response.json()

        expect(response.status).toBe(200)
        expect(responseData.available).toBe(false)
        expect(responseData.message).toBe('Please enter a valid email address')
      }
    })
  })
})