import crypto from 'crypto'

type OTPType = 'signup' | 'reset'

// Generate a secure 6-digit OTP
export function generateOTP(): string {
  // Use crypto.randomInt for secure random number generation
  return crypto.randomInt(100000, 999999).toString()
}

// Create an OTP token with metadata
export function createOTPToken(
  email: string, 
  otp: string, 
  type: OTPType,
  expiresInMinutes: number = 10
): string {
  const payload = {
    email: email.toLowerCase(),
    otp,
    type,
    timestamp: Date.now(),
    expires: Date.now() + (expiresInMinutes * 60 * 1000)
  }
  
  // Create a hash-based token
  const secret = process.env.OTP_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'
  const token = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  // Combine payload and signature for verification
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encodedPayload}.${token}`
}

// Verify an OTP token
export function verifyOTPToken(
  token: string, 
  providedOTP: string, 
  email: string, 
  type: OTPType
): boolean {
  try {
    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return false
    
    // Decode payload
    const payloadBuffer = Buffer.from(encodedPayload, 'base64url')
    const payload = JSON.parse(payloadBuffer.toString())
    
    // Verify signature
    const secret = process.env.OTP_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')
    
    if (signature !== expectedSignature) return false
    
    // Check expiration
    if (Date.now() > payload.expires) return false
    
    // Verify OTP, email, and type
    return (
      payload.otp === providedOTP &&
      payload.email === email.toLowerCase() &&
      payload.type === type
    )
  } catch (error) {
    console.error('OTP verification error:', error)
    return false
  }
}

// Rate limiting for OTP generation
const otpLimits = new Map<string, { count: number; resetTime: number }>()

export function checkOTPRateLimit(identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): boolean {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000
  
  const limit = otpLimits.get(identifier)
  
  if (!limit || now > limit.resetTime) {
    // Reset or initialize limit
    otpLimits.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (limit.count >= maxAttempts) {
    return false
  }
  
  limit.count++
  return true
}

// Clean up expired rate limit entries
export function cleanupOTPLimits(): void {
  const now = Date.now()
  for (const [key, limit] of otpLimits.entries()) {
    if (now > limit.resetTime) {
      otpLimits.delete(key)
    }
  }
}

// OTP template for different types
export const OTP_TEMPLATES = {
  email_verification: {
    subject: 'Verify your email - Fixly',
    heading: 'Email Verification',
    message: 'Please verify your email address to complete your registration.',
    expiryMinutes: 10
  },
  password_reset: {
    subject: 'Reset your password - Fixly',
    heading: 'Password Reset',
    message: 'Use this code to reset your password.',
    expiryMinutes: 15
  },
  two_factor: {
    subject: 'Two-factor authentication - Fixly',
    heading: '2FA Code',
    message: 'Your two-factor authentication code.',
    expiryMinutes: 5
  },
  phone_verification: {
    subject: 'Verify your phone - Fixly',
    heading: 'Phone Verification',
    message: 'Please verify your phone number.',
    expiryMinutes: 10
  }
} as const

// Validate OTP format
export function isValidOTPFormat(otp: string): boolean {
  return /^\d{6}$/.test(otp)
}

// Generate backup codes for 2FA
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(
      crypto.randomBytes(4).toString('hex').toUpperCase()
    )
  }
  return codes
}

// Hash backup codes for storage
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

// Verify backup code
export function verifyBackupCode(hashedCode: string, providedCode: string): boolean {
  const hashedProvidedCode = hashBackupCode(providedCode.toUpperCase())
  return hashedCode === hashedProvidedCode
}

// OTP analytics tracking
interface OTPMetrics {
  generated: number
  verified: number
  failed: number
  expired: number
  lastReset: number
}

const otpMetrics: Map<OTPType, OTPMetrics> = new Map()

export function trackOTPGeneration(type: OTPType): void {
  const metrics = otpMetrics.get(type) || {
    generated: 0,
    verified: 0,
    failed: 0,
    expired: 0,
    lastReset: Date.now()
  }
  
  metrics.generated++
  otpMetrics.set(type, metrics)
}

export function trackOTPVerification(type: OTPType, success: boolean, expired: boolean = false): void {
  const metrics = otpMetrics.get(type) || {
    generated: 0,
    verified: 0,
    failed: 0,
    expired: 0,
    lastReset: Date.now()
  }
  
  if (expired) {
    metrics.expired++
  } else if (success) {
    metrics.verified++
  } else {
    metrics.failed++
  }
  
  otpMetrics.set(type, metrics)
}

export function getOTPMetrics(type?: OTPType): OTPMetrics | Map<OTPType, OTPMetrics> {
  if (type) {
    return otpMetrics.get(type) || {
      generated: 0,
      verified: 0,
      failed: 0,
      expired: 0,
      lastReset: Date.now()
    }
  }
  return otpMetrics
}

// Reset metrics (for testing or periodic cleanup)
export function resetOTPMetrics(type?: OTPType): void {
  if (type) {
    otpMetrics.delete(type)
  } else {
    otpMetrics.clear()
  }
}

// Security utilities
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

export function hashToken(token: string, salt?: string): string {
  const hashSalt = salt || process.env.TOKEN_SALT || 'fixly-default-salt'
  return crypto.createHash('sha256').update(token + hashSalt).digest('hex')
}

// Time-based OTP (TOTP) utilities for future 2FA implementation
export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('hex')
}

// OTP cleanup job (to be called periodically)
export function cleanupExpiredOTPs(): void {
  cleanupOTPLimits()
  
  // Reset metrics daily
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  for (const [type, metrics] of otpMetrics.entries()) {
    if (metrics.lastReset < oneDayAgo) {
      resetOTPMetrics(type)
    }
  }
}