import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { JWTPayload } from '@/types'
import RedisService from '@/lib/redis/client'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

// Default rate limits
const DEFAULT_RATE_LIMITS = {
  public: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  authenticated: { maxRequests: 1000, windowMs: 15 * 60 * 1000 }, // 1000 requests per 15 minutes
  sensitive: { maxRequests: 10, windowMs: 15 * 60 * 1000 } // 10 requests per 15 minutes for sensitive operations
}

// Extract Bearer token from Authorization header
function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
  return ip
}

// Rate limiting middleware
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_RATE_LIMITS.public
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request)
  const key = `rate_limit:${identifier}:${request.nextUrl.pathname}`

  try {
    const rateLimitResult = await RedisService.checkRateLimit(
      key,
      config.maxRequests,
      Math.floor(config.windowMs / (60 * 1000)) // Convert to minutes
    )

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: config.message || `Too many requests. Please try again in ${Math.ceil(
            (rateLimitResult.resetTime.getTime() - Date.now()) / 60000
          )} minutes.`,
          resetTime: rateLimitResult.resetTime,
          remaining: rateLimitResult.remaining
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString())

    return null // Continue to next middleware/handler
  } catch (error) {
    console.error('Rate limiting error:', error)
    return null // Continue without rate limiting if Redis fails
  }
}

// Authentication middleware - validates JWT token
export async function authenticate(request: NextRequest): Promise<{
  response?: NextResponse
  user?: JWTPayload
}> {
  const token = extractBearerToken(request)

  if (!token) {
    return {
      response: NextResponse.json(
        { error: 'Authentication required', message: 'No access token provided' },
        { status: 401 }
      )
    }
  }

  try {
    const user = await verifyToken(token)

    if (!user) {
      return {
        response: NextResponse.json(
          { error: 'Invalid token', message: 'The provided token is invalid or expired' },
          { status: 401 }
        )
      }
    }

    // Attach user to request for downstream handlers
    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      response: NextResponse.json(
        { error: 'Authentication failed', message: 'Token verification failed' },
        { status: 401 }
      )
    }
  }
}

// Authorization middleware - checks user roles/permissions
export function authorize(allowedRoles: string[] = [], customCheck?: (user: JWTPayload) => boolean) {
  return (user: JWTPayload): NextResponse | null => {
    // Custom authorization check
    if (customCheck && !customCheck(user)) {
      return NextResponse.json(
        { error: 'Access denied', message: 'You do not have permission to access this resource' },
        { status: 403 }
      )
    }

    // Role-based authorization
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions', 
          message: `This operation requires one of the following roles: ${allowedRoles.join(', ')}`,
          userRole: user.role,
          requiredRoles: allowedRoles
        },
        { status: 403 }
      )
    }

    return null // Authorization passed
  }
}

// Combined middleware factory
export function createAuthMiddleware(options: {
  requireAuth?: boolean
  allowedRoles?: string[]
  customCheck?: (user: JWTPayload) => boolean
  rateLimitConfig?: RateLimitConfig
} = {}) {
  return async (request: NextRequest) => {
    const {
      requireAuth = true,
      allowedRoles = [],
      customCheck,
      rateLimitConfig = DEFAULT_RATE_LIMITS.authenticated
    } = options

    // Apply rate limiting
    const rateLimitResponse = await rateLimit(request, rateLimitConfig)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Skip authentication if not required
    if (!requireAuth) {
      return NextResponse.next()
    }

    // Authenticate user
    const { response: authResponse, user } = await authenticate(request)
    if (authResponse) {
      return authResponse
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Authorize user
    const authzResponse = authorize(allowedRoles, customCheck)(user)
    if (authzResponse) {
      return authzResponse
    }

    // Add user info to request headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email || '')
    response.headers.set('x-user-role', user.role || '')
    response.headers.set('x-user-username', user.username || '')

    return response
  }
}

// Utility functions for API routes
export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  const { user, response } = await authenticate(request)
  if (response) {
    throw new Error('Authentication required')
  }
  if (!user) {
    throw new Error('Invalid authentication')
  }
  return user
}

export function requireRole(user: JWTPayload, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
  }
}

// Security headers middleware
export function securityHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CORS headers (configure based on your needs)
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'https://fixly.com',
    'https://www.fixly.com'
  ]

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    )
  }

  // Content Security Policy (adjust based on your needs)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.fixly.com https://maps.googleapis.com; " +
    "frame-src 'none'; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  )

  return response
}

// Export commonly used configurations
export const AUTH_CONFIGS = {
  public: { requireAuth: false, rateLimitConfig: DEFAULT_RATE_LIMITS.public },
  authenticated: { requireAuth: true, rateLimitConfig: DEFAULT_RATE_LIMITS.authenticated },
  adminOnly: { requireAuth: true, allowedRoles: ['admin'], rateLimitConfig: DEFAULT_RATE_LIMITS.sensitive },
  fixerOnly: { requireAuth: true, allowedRoles: ['fixer'], rateLimitConfig: DEFAULT_RATE_LIMITS.authenticated },
  hirerOnly: { requireAuth: true, allowedRoles: ['hirer'], rateLimitConfig: DEFAULT_RATE_LIMITS.authenticated },
  fixerOrHirer: { requireAuth: true, allowedRoles: ['fixer', 'hirer'], rateLimitConfig: DEFAULT_RATE_LIMITS.authenticated }
}