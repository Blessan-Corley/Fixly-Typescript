import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { JWTPayload, AuthTokens } from '@/types'
import RedisService from '@/lib/redis/client'

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_ISSUER = process.env.JWT_ISSUER || 'fixly-app'
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d' // 7 days

// Blacklisted tokens store (fallback for when Redis is unavailable)
const blacklistedTokens = new Set<string>()

// Generate unique session ID
function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

// Generate unique JTI (JWT ID)
function generateJTI(): string {
  return randomBytes(16).toString('hex')
}

// Create JWT tokens
export function createTokens(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti' | 'sessionId'>): AuthTokens {
  const now = Math.floor(Date.now() / 1000)
  const sessionId = generateSessionId()
  const jti = generateJTI()

  // Access token payload
  const accessPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + getExpirationTime(ACCESS_TOKEN_EXPIRY),
    jti,
    sessionId
  }

  // Refresh token payload (longer lived, minimal info)
  const refreshPayload = {
    userId: payload.userId,
    sessionId,
    type: 'refresh',
    iat: now,
    exp: now + getExpirationTime(REFRESH_TOKEN_EXPIRY),
    jti: generateJTI()
  }

  const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    algorithm: 'HS256'
  })

  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    algorithm: 'HS256'
  })

  return {
    accessToken,
    refreshToken,
    expiresIn: getExpirationTime(ACCESS_TOKEN_EXPIRY) * 1000, // in milliseconds
    tokenType: 'Bearer'
  }
}

// Verify and decode JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // Check if token is blacklisted
    const decoded = jwt.decode(token) as JWTPayload
    if (decoded && (await isTokenBlacklisted(decoded.jti))) {
      return null
    }

    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      algorithms: ['HS256']
    }) as JWTPayload

    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired:', error.message)
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token:', error.message)
    } else {
      console.error('Token verification error:', error)
    }
    return null
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): any | null {
  try {
    const decoded = jwt.decode(token) as any
    if (decoded && blacklistedTokens.has(decoded.jti)) {
      return null
    }

    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      algorithms: ['HS256']
    })

    return payload
  } catch (error) {
    console.error('Refresh token verification error:', error)
    return null
  }
}

// Refresh access token
export function refreshAccessToken(
  refreshTokenPayload: any,
  userPayload: Omit<JWTPayload, 'iat' | 'exp' | 'jti' | 'sessionId'>
): { accessToken: string; expiresIn: number } {
  const now = Math.floor(Date.now() / 1000)
  const jti = generateJTI()

  const accessPayload: JWTPayload = {
    ...userPayload,
    iat: now,
    exp: now + getExpirationTime(ACCESS_TOKEN_EXPIRY),
    jti,
    sessionId: refreshTokenPayload.sessionId
  }

  const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    algorithm: 'HS256'
  })

  return {
    accessToken,
    expiresIn: getExpirationTime(ACCESS_TOKEN_EXPIRY) * 1000
  }
}

// Check if token is blacklisted (Redis + fallback)
async function isTokenBlacklisted(jti: string): Promise<boolean> {
  try {
    const client = await RedisService.getClient()
    const isBlacklisted = await client.get(`blacklist:${jti}`)
    return isBlacklisted === 'true'
  } catch (error) {
    console.warn('Redis unavailable, using in-memory blacklist:', error.message)
    return blacklistedTokens.has(jti)
  }
}

// Blacklist a token (logout)
export async function blacklistToken(jti: string, expirySeconds?: number): Promise<void> {
  try {
    const client = await RedisService.getClient()
    
    if (expirySeconds) {
      await client.setEx(`blacklist:${jti}`, expirySeconds, 'true')
    } else {
      // Default to 7 days for blacklisted tokens
      await client.setEx(`blacklist:${jti}`, 7 * 24 * 60 * 60, 'true')
    }
  } catch (error) {
    console.warn('Redis unavailable, using in-memory blacklist:', error.message)
    blacklistedTokens.add(jti)
    
    // Clean up blacklist periodically (keep only non-expired tokens)
    if (blacklistedTokens.size > 1000) {
      cleanupBlacklist()
    }
  }
}

// Clean up expired tokens from blacklist
function cleanupBlacklist(): void {
  // This is a simple in-memory implementation
  // In production, use Redis with TTL for automatic cleanup
  console.log('Cleaning up token blacklist...')
  // For now, just log - Redis will handle TTL automatically
}

// Get expiration time in seconds from string
function getExpirationTime(expiry: string): number {
  const unit = expiry.slice(-1)
  const value = parseInt(expiry.slice(0, -1))
  
  switch (unit) {
    case 's': return value
    case 'm': return value * 60
    case 'h': return value * 60 * 60
    case 'd': return value * 24 * 60 * 60
    default: return 900 // 15 minutes default
  }
}

// Decode token without verification (for getting info from expired tokens)
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch (error) {
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded) return true
  
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp <= now
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token)
  if (!decoded) return null
  
  return new Date(decoded.exp * 1000)
}

// Validate token format
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  
  const parts = token.split('.')
  return parts.length === 3
}

// Extract user info from token
export function getUserFromToken(token: string): Pick<JWTPayload, 'userId' | 'email' | 'username' | 'role'> | null {
  const payload = verifyToken(token)
  if (!payload) return null
  
  return {
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
    role: payload.role
  }
}

// Security utilities
export function isTokenFromSameSession(token1: string, token2: string): boolean {
  const payload1 = decodeToken(token1)
  const payload2 = decodeToken(token2)
  
  return !!(payload1 && payload2 && payload1.sessionId === payload2.sessionId)
}

// Generate secure random password
export function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const bytes = randomBytes(length)
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }
  
  return result
}

// Password strength validator
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
    notCommon: boolean
  }
  suggestions: string[]
} {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    notCommon: !['password', 'password123', '12345678', 'qwerty123'].includes(password.toLowerCase())
  }
  
  const score = Object.values(requirements).filter(Boolean).length
  const isValid = score >= 4 && requirements.minLength && requirements.notCommon
  
  const suggestions: string[] = []
  if (!requirements.minLength) suggestions.push('Use at least 8 characters')
  if (!requirements.hasUppercase) suggestions.push('Include uppercase letters')
  if (!requirements.hasLowercase) suggestions.push('Include lowercase letters')
  if (!requirements.hasNumber) suggestions.push('Include numbers')
  if (!requirements.hasSpecial) suggestions.push('Include special characters')
  if (!requirements.notCommon) suggestions.push('Avoid common passwords')
  
  return {
    isValid,
    score: Math.round((score / 6) * 100),
    requirements,
    suggestions
  }
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; resetTime: number }>()

export function checkAuthRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = identifier.toLowerCase()
  const attempt = authAttempts.get(key)
  
  if (!attempt || now > attempt.resetTime) {
    // Reset window
    authAttempts.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs }
  }
  
  if (attempt.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: attempt.resetTime }
  }
  
  attempt.count++
  return { allowed: true, remaining: maxAttempts - attempt.count, resetTime: attempt.resetTime }
}

export function resetAuthRateLimit(identifier: string): void {
  authAttempts.delete(identifier.toLowerCase())
}

// Export configuration for middleware
// Generate password reset token
export function generatePasswordResetToken(email: string): string {
  return jwt.sign(
    { email, type: 'password_reset' },
    JWT_SECRET,
    {
      expiresIn: '1h', // Password reset tokens expire in 1 hour
      issuer: JWT_ISSUER,
      algorithm: 'HS256'
    }
  )
}

// Verify password reset token
export function verifyPasswordResetToken(token: string): { email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      algorithms: ['HS256']
    }) as any

    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid password reset token')
    }

    return { email: decoded.email }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Password reset token expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid password reset token')
    } else {
      throw new Error('Password reset token verification failed')
    }
  }
}

// Generate email verification token
export function generateEmailVerificationToken(email: string): string {
  return jwt.sign(
    { email, type: 'email_verification' },
    JWT_SECRET,
    {
      expiresIn: '24h', // Email verification tokens expire in 24 hours
      issuer: JWT_ISSUER,
      algorithm: 'HS256'
    }
  )
}

// Verify email verification token
export function verifyEmailVerificationToken(token: string): { email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      algorithms: ['HS256']
    }) as any

    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid email verification token')
    }

    return { email: decoded.email }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Email verification token expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid email verification token')
    } else {
      throw new Error('Email verification token verification failed')
    }
  }
}

export const jwtConfig = {
  secret: JWT_SECRET,
  issuer: JWT_ISSUER,
  accessTokenExpiry: ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: REFRESH_TOKEN_EXPIRY
}