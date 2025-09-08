import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Maximum number of requests per window
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  message?: string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore: RateLimitStore = {}

// Clean up expired entries periodically
const cleanupInterval = setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}, 60000) // Clean up every minute

// Default key generator using IP address
function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return ip
}

export function createRateLimiter(config: RateLimitConfig) {
  return {
    windowMs: config.windowMs,
    max: config.max,
    keyGenerator: config.keyGenerator || defaultKeyGenerator,
    skipSuccessfulRequests: config.skipSuccessfulRequests || false,
    skipFailedRequests: config.skipFailedRequests || false,
    message: config.message || 'Too many requests'
  }
}

export async function rateLimit(
  req: NextRequest,
  limiter: ReturnType<typeof createRateLimiter>
): Promise<RateLimitResult> {
  const key = limiter.keyGenerator(req)
  const now = Date.now()
  const resetTime = now + limiter.windowMs

  // Get or create rate limit entry
  let entry = rateLimitStore[key]
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime
    }
    rateLimitStore[key] = entry
  } else {
    // Increment existing entry
    entry.count++
  }

  const remaining = Math.max(0, limiter.max - entry.count)
  const success = entry.count <= limiter.max

  const result: RateLimitResult = {
    success,
    limit: limiter.max,
    remaining,
    resetTime: entry.resetTime
  }

  if (!success) {
    result.retryAfter = Math.ceil((entry.resetTime - now) / 1000) // in seconds
  }

  return result
}

// Specialized rate limiters for different endpoints
export const authRateLimiters = {
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `login:${ip.split(',')[0]}`
    }
  }),

  signup: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 signup attempts
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `signup:${ip.split(',')[0]}`
    }
  }),

  otpVerification: createRateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 OTP attempts
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `otp:${ip.split(',')[0]}`
    }
  }),

  passwordReset: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 password reset attempts
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `password-reset:${ip.split(',')[0]}`
    }
  }),

  emailResend: createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // 3 email resend attempts
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `email-resend:${ip.split(',')[0]}`
    }
  })
}

// Global rate limiter for API endpoints
export const globalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    return `global:${ip.split(',')[0]}`
  }
})

// Rate limit middleware for Next.js API routes
export function withRateLimit(
  limiter: ReturnType<typeof createRateLimiter>
) {
  return async (req: NextRequest) => {
    const result = await rateLimit(req, limiter)
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limiter.max.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': result.retryAfter?.toString() || '60'
          }
        }
      )
    }

    return null // No rate limit violation
  }
}

// Advanced rate limiting with different strategies
interface AdvancedRateLimitConfig extends RateLimitConfig {
  strategy?: 'fixed-window' | 'sliding-window' | 'token-bucket'
  burst?: number // For token bucket strategy
}

export function createAdvancedRateLimiter(config: AdvancedRateLimitConfig) {
  // For now, implement fixed-window (can be extended later)
  return createRateLimiter(config)
}

// Rate limit by user ID (for authenticated requests)
export function createUserRateLimit(config: Omit<RateLimitConfig, 'keyGenerator'>) {
  return createRateLimiter({
    ...config,
    keyGenerator: (req) => {
      // Extract user ID from token or session
      // This is a placeholder - implement based on your auth system
      const authHeader = req.headers.get('authorization')
      if (authHeader) {
        // Extract user ID from JWT or session
        return `user:${authHeader.slice(0, 10)}` // Placeholder
      }
      return defaultKeyGenerator(req)
    }
  })
}

// Rate limit by endpoint
export function createEndpointRateLimit(
  endpoint: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
) {
  return createRateLimiter({
    ...config,
    keyGenerator: (req) => {
      const ip = defaultKeyGenerator(req)
      return `${endpoint}:${ip}`
    }
  })
}

// Get rate limit status without incrementing
export function getRateLimitStatus(
  key: string,
  limiter: ReturnType<typeof createRateLimiter>
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore[key]

  if (!entry || entry.resetTime < now) {
    return {
      success: true,
      limit: limiter.max,
      remaining: limiter.max,
      resetTime: now + limiter.windowMs
    }
  }

  const remaining = Math.max(0, limiter.max - entry.count)
  const success = entry.count < limiter.max

  return {
    success,
    limit: limiter.max,
    remaining,
    resetTime: entry.resetTime,
    retryAfter: success ? undefined : Math.ceil((entry.resetTime - now) / 1000)
  }
}

// Clear rate limit for a key (admin function)
export function clearRateLimit(key: string): boolean {
  if (rateLimitStore[key]) {
    delete rateLimitStore[key]
    return true
  }
  return false
}

// Get all rate limit entries (admin function)
export function getAllRateLimits(): RateLimitStore {
  const now = Date.now()
  const active: RateLimitStore = {}

  Object.entries(rateLimitStore).forEach(([key, entry]) => {
    if (entry.resetTime > now) {
      active[key] = entry
    }
  })

  return active
}

// Clean up the cleanup interval when the module is unloaded
if (typeof window === 'undefined') {
  process.on('beforeExit', () => {
    clearInterval(cleanupInterval)
  })
}