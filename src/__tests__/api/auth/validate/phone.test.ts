/**
 * @jest-environment node
 */

import { GET } from '@/app/api/auth/validate/phone/route'
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

// Mock dependencies
jest.mock('@/lib/database/connection')
jest.mock('@/lib/database/schemas/user')

const mockConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>
const mockUser = User as jest.Mocked<typeof User>

describe('/api/auth/validate/phone', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectToDatabase.mockResolvedValue(undefined as any)
  })

  describe('GET /api/auth/validate/phone', () => {
    it('should return available for unique phone number', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=9876543210')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(true)
      expect(responseData.message).toBe('Phone number is available')
    })

    it('should return unavailable for existing phone number', async () => {
      mockUser.findOne.mockResolvedValue({
        _id: 'user-id',
        phone: '9876543210',
        email: 'existing@example.com'
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=9876543210')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Phone number is already registered')
    })

    it('should return error for missing phone parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Phone parameter is required')
    })

    it('should return error for invalid phone length', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=123456789')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Phone number must be exactly 10 digits')
    })

    it('should return error for phone not starting with valid digits', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=5876543210')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Phone number must start with 6, 7, 8, or 9')
    })

    it('should handle phone with non-numeric characters', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=+91-987-654-3210')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(true)
      expect(mockUser.findOne).toHaveBeenCalledWith({ phone: '9876543210' })
    })

    it('should handle database errors gracefully', async () => {
      mockConnectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/auth/validate/phone?phone=9876543210')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should validate various valid phone formats', async () => {
      mockUser.findOne.mockResolvedValue(null)

      const validPhones = ['6123456789', '7123456789', '8123456789', '9123456789']
      
      for (const phone of validPhones) {
        const request = new NextRequest(`http://localhost:3000/api/auth/validate/phone?phone=${phone}`)
        const response = await GET(request)
        const responseData = await response.json()

        expect(response.status).toBe(200)
        expect(responseData.available).toBe(true)
      }
    })
  })
})