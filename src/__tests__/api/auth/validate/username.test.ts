/**
 * @jest-environment node
 */

import { GET } from '@/app/api/auth/validate/username/route'
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'

// Mock dependencies
jest.mock('@/lib/database/connection')
jest.mock('@/lib/database/schemas/user')

const mockConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>
const mockUser = User as jest.Mocked<typeof User>

describe('/api/auth/validate/username', () => {
  let mockQuery: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockConnectToDatabase.mockResolvedValue(undefined as any)
    
    // Mock the Mongoose query chain
    mockQuery = {
      select: jest.fn().mockReturnThis()
    }
    mockUser.findOne.mockReturnValue(mockQuery)
    mockQuery.select.mockResolvedValue(null) // Default to no user found
  })

  describe('GET /api/auth/validate/username', () => {
    it('should return available for unique username', async () => {
      mockQuery.select.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=testuser123')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(true)
      expect(responseData.message).toBe('Username is available')
    })

    it('should return unavailable for existing username', async () => {
      mockQuery.select.mockResolvedValue({
        _id: 'user-id',
        username: 'existinguser',
        email: 'existing@example.com'
      } as any)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=existinguser')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Username is already taken')
    })

    it('should return error for missing username parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/username')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Username parameter is required')
    })

    it('should return error for invalid username format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=ab')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Username must be at least 3 characters')
    })

    it('should return error for username with invalid characters', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=test-user')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.available).toBe(false)
      expect(responseData.message).toBe('Username can only contain lowercase letters, numbers, and underscores')
    })

    it('should handle database errors gracefully', async () => {
      mockConnectToDatabase.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=testuser')
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should convert username to lowercase for checking', async () => {
      mockQuery.select.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/auth/validate/username?username=TestUser')
      await GET(request)

      expect(mockUser.findOne).toHaveBeenCalledWith({ 
        username: 'testuser' 
      })
    })
  })
})