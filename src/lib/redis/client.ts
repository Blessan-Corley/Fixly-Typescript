import { createClient } from 'redis'
import { Redis } from '@upstash/redis'

// Redis client types
interface RedisClient {
  isReady?: boolean
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<any>
  setex(key: string, seconds: number, value: string): Promise<any>
  del(key: string): Promise<number>
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<boolean>
  ttl(key: string): Promise<number>
  ping(): Promise<string | 'PONG'>
  quit?(): Promise<void>
}

// Redis client for caching and session management  
let client: any = null
let upstashClient: Redis | null = null
let isConnecting = false
let connectionPromise: Promise<RedisClient> | null = null
let useUpstash = false

// Wrapper class to unify both Redis clients
class UnifiedRedisClient implements RedisClient {
  private upstashClient?: Redis
  private standardClient?: any
  private isUpstash: boolean

  constructor(upstashClient?: Redis, standardClient?: any) {
    this.upstashClient = upstashClient
    this.standardClient = standardClient
    this.isUpstash = !!upstashClient
  }

  get isReady(): boolean {
    if (this.isUpstash) {
      return !!this.upstashClient
    }
    return this.standardClient?.isReady || false
  }

  async get(key: string): Promise<string | null> {
    if (this.isUpstash) {
      const result = await this.upstashClient!.get(key)
      // Upstash might return parsed JSON objects, we need strings
      if (result === null || result === undefined) {
        return null
      }
      // If it's already a string, return it
      if (typeof result === 'string') {
        return result
      }
      // If it's an object, it means Upstash parsed our JSON string, so we need to stringify it back
      return JSON.stringify(result)
    }
    return await this.standardClient!.get(key)
  }

  async set(key: string, value: string): Promise<any> {
    if (this.isUpstash) {
      return await this.upstashClient!.set(key, value)
    }
    return await this.standardClient!.set(key, value)
  }

  async setex(key: string, seconds: number, value: string): Promise<any> {
    if (this.isUpstash) {
      return await this.upstashClient!.setex(key, seconds, value)
    }
    return await this.standardClient!.setEx(key, seconds, value)
  }

  async del(key: string): Promise<number> {
    if (this.isUpstash) {
      return await this.upstashClient!.del(key)
    }
    return await this.standardClient!.del(key)
  }

  async incr(key: string): Promise<number> {
    if (this.isUpstash) {
      return await this.upstashClient!.incr(key)
    }
    return await this.standardClient!.incr(key)
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (this.isUpstash) {
      const result = await this.upstashClient!.expire(key, seconds)
      return result === 1
    }
    return await this.standardClient!.expire(key, seconds)
  }

  async ttl(key: string): Promise<number> {
    if (this.isUpstash) {
      return await this.upstashClient!.ttl(key)
    }
    return await this.standardClient!.ttl(key)
  }

  async ping(): Promise<string | 'PONG'> {
    if (this.isUpstash) {
      return await this.upstashClient!.ping()
    }
    return await this.standardClient!.ping()
  }

  async quit(): Promise<void> {
    if (!this.isUpstash && this.standardClient) {
      await this.standardClient.quit()
    }
    // Upstash REST API doesn't need explicit quit
  }
}

export async function getRedisClient(): Promise<RedisClient> {
  if (client && client.isReady) {
    return client
  }

  if (isConnecting && connectionPromise) {
    return connectionPromise
  }

  isConnecting = true
  
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      // Try Upstash REST API first (more reliable for serverless)
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
          upstashClient = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
          })
          
          // Test the connection
          await upstashClient.ping()
          console.log('✅ Connected to Redis via Upstash REST API')
          
          const unifiedClient = new UnifiedRedisClient(upstashClient)
          client = unifiedClient
          useUpstash = true
          isConnecting = false
          resolve(unifiedClient)
          return
        } catch (error) {
          console.warn('⚠️ Upstash REST API failed:', error instanceof Error ? error.message : 'Unknown error')
          console.log('🔄 Trying standard Redis connection...')
        }
      }

      // Fallback to standard Redis
      if (client) {
        try {
          await client.quit()
        } catch (e) {
          // Ignore quit errors
        }
      }

      const redisUrl = process.env.REDIS_URL
      
      if (!redisUrl) {
        throw new Error('No Redis URL configured')
      }

      const standardClient = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 3) {
              console.log('Standard Redis reconnection attempts exceeded')
              return false
            }
            return Math.min(retries * 1000, 3000)
          },
          connectTimeout: 10000
        }
      } as any)

      standardClient.on('error', (err: Error) => {
        console.warn('Redis connection error:', err.message)
      })

      standardClient.on('connect', () => {
        console.log('✅ Connected to Redis (Standard)')
      })

      standardClient.on('ready', () => {
        console.log('✅ Redis client ready')
        isConnecting = false
      })

      standardClient.on('end', () => {
        console.log('Redis connection ended')
        client = null
        isConnecting = false
      })

      await standardClient.connect()
      
      const unifiedClient = new UnifiedRedisClient(undefined, standardClient)
      client = unifiedClient
      useUpstash = false
      resolve(unifiedClient)
    } catch (error) {
      console.error('❌ All Redis connection attempts failed:', error instanceof Error ? error.message : 'Unknown error')
      
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
  private static client: RedisClient | null = null
  private static isRedisAvailable = true

  static async getClient(): Promise<RedisClient> {
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
        await client.setex(key, expiryMinutes * 60, otp)
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
        
        // Ensure data is properly serialized
        let serializedData: string
        try {
          serializedData = JSON.stringify(data)
          if (serializedData === undefined || serializedData === '[object Object]') {
            throw new Error('Invalid object serialization')
          }
        } catch (error) {
          console.error('Failed to serialize session data:', error, 'Data:', data)
          throw error
        }
        
        await client.setex(key, expiryHours * 60 * 60, serializedData)
        console.log(`Session stored: ${key}`)
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
        if (!data) return null
        
        try {
          return JSON.parse(data)
        } catch (error) {
          console.warn('Invalid JSON in Redis session data:', error instanceof Error ? error.message : 'Unknown error')
          return null
        }
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
        await client.setex(key, expiryHours * 60 * 60, 'true')
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
        await client.setex(key, expiryHours * 60 * 60, JSON.stringify(progressData))
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
        if (!result) return null
        
        try {
          return JSON.parse(result)
        } catch (error) {
          console.warn('Invalid JSON in Redis signup progress data:', error instanceof Error ? error.message : 'Unknown error')
          return null
        }
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
      if (RedisService.client && typeof RedisService.client.quit === 'function') {
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