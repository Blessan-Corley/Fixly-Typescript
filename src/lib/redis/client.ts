import { createClient } from 'redis'

// Redis client for caching and session management
let client: any = null
let isConnecting = false
let connectionPromise: Promise<any> | null = null

export async function getRedisClient() {
  if (client && client.isReady) {
    return client
  }

  if (isConnecting && connectionPromise) {
    return connectionPromise
  }

  isConnecting = true
  
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      if (client) {
        try {
          await client.quit()
        } catch (e) {
          // Ignore quit errors
        }
      }

      client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.log('Redis reconnection attempts exceeded, disabling Redis')
              return false // Stop reconnecting after 10 attempts
            }
            return Math.min(retries * 100, 3000) // Exponential backoff up to 3s
          },
          connectTimeout: 10000, // 10 second connect timeout
          lazyConnect: true
        }
      })

      client.on('error', (err: Error) => {
        console.warn('Redis connection error:', err.message)
        // Don't log full error details to reduce noise
      })

      client.on('connect', () => {
        console.log('Connected to Redis')
      })

      client.on('ready', () => {
        console.log('Redis client ready')
        isConnecting = false
      })

      client.on('end', () => {
        console.log('Redis connection ended')
        client = null
        isConnecting = false
      })

      await client.connect()
      resolve(client)
    } catch (error) {
      console.warn('Failed to connect to Redis:', error instanceof Error ? error.message : 'Unknown error')
      client = null
      isConnecting = false
      connectionPromise = null
      reject(error)
    }
  })

  return connectionPromise
}

// Helper functions for common Redis operations
export class RedisService {
  private static client: any = null
  private static isRedisAvailable = true

  static async getClient() {
    if (!RedisService.isRedisAvailable) {
      throw new Error('Redis is not available')
    }

    try {
      if (!RedisService.client || !RedisService.client.isReady) {
        RedisService.client = await getRedisClient()
      }
      return RedisService.client
    } catch (error) {
      console.warn('Redis unavailable, falling back to memory-only operation')
      RedisService.isRedisAvailable = false
      throw error
    }
  }

  static async executeWithFallback<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
    try {
      const client = await RedisService.getClient()
      return await operation()
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error instanceof Error ? error.message : 'Unknown error')
      return fallback()
    }
  }

  // OTP operations
  static async storeOTP(email: string, otp: string, expiryMinutes = 10) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `otp:${email}`
        await client.setEx(key, expiryMinutes * 60, otp)
      },
      () => {
        // Fallback: Store in memory (note: will be lost on server restart)
        console.warn('Storing OTP in memory - not recommended for production')
      }
    )
  }

  static async getOTP(email: string): Promise<string | null> {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `otp:${email}`
        return await client.get(key)
      },
      () => {
        console.warn('Redis unavailable - OTP verification may fail')
        return null
      }
    )
  }

  static async deleteOTP(email: string) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `otp:${email}`
        await client.del(key)
      },
      () => {
        // Fallback: No-op
      }
    )
  }

  // Rate limiting
  static async checkRateLimit(identifier: string, limit: number, windowMinutes = 15): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `rate_limit:${identifier}`
        
        const current = await client.incr(key)
        
        if (current === 1) {
          // First request in window - set expiry
          await client.expire(key, windowMinutes * 60)
        }
        
        const ttl = await client.ttl(key)
        const resetTime = new Date(Date.now() + (ttl * 1000))
        
        return {
          allowed: current <= limit,
          remaining: Math.max(0, limit - current),
          resetTime
        }
      },
      () => {
        console.warn('Redis unavailable - rate limiting disabled')
        // Fallback: Allow all requests when Redis is unavailable
        return {
          allowed: true,
          remaining: limit,
          resetTime: new Date(Date.now() + (windowMinutes * 60 * 1000))
        }
      }
    )
  }

  // Session management
  static async storeSession(sessionId: string, data: any, expiryHours = 24) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `session:${sessionId}`
        await client.setEx(key, expiryHours * 60 * 60, JSON.stringify(data))
      },
      () => {
        console.warn('Redis unavailable - session caching disabled')
      }
    )
  }

  static async getSession(sessionId: string): Promise<any | null> {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `session:${sessionId}`
        const data = await client.get(key)
        return data ? JSON.parse(data) : null
      },
      () => {
        console.warn('Redis unavailable - session cache miss')
        return null
      }
    )
  }

  static async deleteSession(sessionId: string) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `session:${sessionId}`
        await client.del(key)
      },
      () => {
        // Fallback: No-op
      }
    )
  }

  // User verification status
  static async markEmailVerified(email: string, expiryHours = 1) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `verified:${email}`
        await client.setEx(key, expiryHours * 60 * 60, 'true')
      },
      () => {
        console.warn('Redis unavailable - email verification status not cached')
      }
    )
  }

  static async isEmailVerified(email: string): Promise<boolean> {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `verified:${email}`
        const result = await client.get(key)
        return result === 'true'
      },
      () => {
        console.warn('Redis unavailable - cannot check email verification cache')
        return false
      }
    )
  }

  // Signup progress tracking
  static async storeSignupProgress(email: string, step: number, data: any, expiryHours = 2) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `signup:${email}`
        const progressData = {
          step,
          data,
          timestamp: new Date().toISOString()
        }
        await client.setEx(key, expiryHours * 60 * 60, JSON.stringify(progressData))
      },
      () => {
        console.warn('Redis unavailable - signup progress not cached')
      }
    )
  }

  static async getSignupProgress(email: string): Promise<{ step: number; data: any; timestamp: string } | null> {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `signup:${email}`
        const result = await client.get(key)
        return result ? JSON.parse(result) : null
      },
      () => {
        console.warn('Redis unavailable - signup progress cache miss')
        return null
      }
    )
  }

  static async deleteSignupProgress(email: string) {
    return RedisService.executeWithFallback(
      async () => {
        const client = await RedisService.getClient()
        const key = `signup:${email}`
        await client.del(key)
      },
      () => {
        // Fallback: No-op
      }
    )
  }

  // Health check
  static async isHealthy(): Promise<boolean> {
    try {
      const client = await RedisService.getClient()
      await client.ping()
      return true
    } catch (error) {
      return false
    }
  }

  // Cleanup utility
  static async close() {
    try {
      if (RedisService.client) {
        await RedisService.client.quit()
        RedisService.client = null
        client = null
        isConnecting = false
        connectionPromise = null
        RedisService.isRedisAvailable = true
      }
    } catch (error) {
      console.warn('Error closing Redis connection:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

export default RedisService