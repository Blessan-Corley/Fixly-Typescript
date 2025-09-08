import { z } from 'zod'

// Email validation with comprehensive checks
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!emailRegex.test(email)) return false
  
  // Additional checks
  const parts = email.split('@')
  if (parts.length !== 2) return false
  
  const [localPart, domain] = parts
  
  // Local part validations
  if (localPart.length === 0 || localPart.length > 64) return false
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false
  if (localPart.includes('..')) return false
  
  // Domain validations
  if (domain.length === 0 || domain.length > 253) return false
  if (domain.startsWith('-') || domain.endsWith('-')) return false
  if (domain.includes('..')) return false
  
  return true
}

// Password validation with strength requirements
export function validatePassword(password: string): boolean {
  // At least 8 characters
  if (password.length < 8) return false
  
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) return false
  
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) return false
  
  // At least one number
  if (!/\d/.test(password)) return false
  
  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false
  
  return true
}

// Password strength scoring
export function getPasswordStrength(password: string): {
  score: number
  feedback: string[]
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
} {
  let score = 0
  const feedback: string[] = []
  
  // Length checks
  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')
  
  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security')
  
  // Character type checks
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Add numbers')
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
  else feedback.push('Add special characters (!@#$%^&*)')
  
  // Advanced checks
  if (!/(.)\1{2,}/.test(password)) score += 1 // No repeated characters
  else feedback.push('Avoid repeating characters')
  
  if (!/^.*(123|abc|qwe|password|admin)/i.test(password)) score += 1 // No common patterns
  else feedback.push('Avoid common patterns like "123", "abc", "password"')
  
  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  if (score <= 2) strength = 'weak'
  else if (score <= 4) strength = 'fair'
  else if (score <= 6) strength = 'good'
  else if (score <= 7) strength = 'strong'
  else strength = 'very-strong'
  
  return { score, feedback, strength }
}

// Username validation
export function validateUsername(username: string): boolean {
  // 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  
  if (!usernameRegex.test(username)) return false
  
  // Cannot start with underscore or number
  if (/^[_\d]/.test(username)) return false
  
  // Cannot be all numbers
  if (/^\d+$/.test(username)) return false
  
  // Reserved usernames
  const reserved = [
    'admin', 'administrator', 'root', 'user', 'guest', 'anonymous',
    'system', 'null', 'undefined', 'api', 'www', 'mail', 'email',
    'support', 'help', 'info', 'contact', 'about', 'privacy',
    'terms', 'service', 'fixly', 'fixer', 'hirer'
  ]
  
  if (reserved.includes(username.toLowerCase())) return false
  
  return true
}

// Phone number validation (Indian format)
export function validatePhoneNumber(phone: string): boolean {
  // Remove all spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // Indian phone number patterns
  const patterns = [
    /^(\+91|91)?[6789]\d{9}$/, // Mobile numbers
    /^(\+91|91)?0?[1-9]\d{9}$/, // Landline numbers
  ]
  
  return patterns.some(pattern => pattern.test(cleanPhone))
}

// Name validation
export function validateName(name: string): boolean {
  // 2-100 characters, letters, spaces, and common name characters
  const nameRegex = /^[a-zA-Z\s\-\.\']{2,100}$/
  
  if (!nameRegex.test(name)) return false
  
  // Cannot be all spaces
  if (name.trim().length === 0) return false
  
  // Cannot start or end with space, dash, or dot
  if (/^[\s\-\.]|[\s\-\.]$/.test(name)) return false
  
  return true
}

// Location validation
export function validateLocation(location: any): boolean {
  if (!location || typeof location !== 'object') return false
  
  // Required fields
  if (!location.city || !location.state || !location.stateCode) return false
  
  // City validation
  if (typeof location.city !== 'string' || location.city.length < 2) return false
  
  // State validation
  if (typeof location.state !== 'string' || location.state.length < 2) return false
  
  // State code validation (2 characters)
  if (typeof location.stateCode !== 'string' || location.stateCode.length !== 2) return false
  
  // Coordinates validation (if provided)
  if (location.coordinates) {
    const { lat, lng } = location.coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') return false
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false
  }
  
  return true
}

// Skill validation
export function validateSkill(skill: any): boolean {
  if (!skill || typeof skill !== 'object') return false
  
  // Required fields
  if (!skill.id || !skill.name || !skill.category) return false
  
  // Type checks
  if (typeof skill.id !== 'string' || typeof skill.name !== 'string') return false
  if (typeof skill.category !== 'string') return false
  
  // Experience level validation (if provided)
  if (skill.experience && !['beginner', 'intermediate', 'expert'].includes(skill.experience)) {
    return false
  }
  
  // Hourly rate validation (if provided)
  if (skill.hourlyRate) {
    const { min, max } = skill.hourlyRate
    if (typeof min !== 'number' || typeof max !== 'number') return false
    if (min < 0 || max < 0 || min > max) return false
  }
  
  return true
}

// Bio validation
export function validateBio(bio: string): boolean {
  if (typeof bio !== 'string') return false
  
  // Max 500 characters
  if (bio.length > 500) return false
  
  // Check for potential spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated character spam
    /https?:\/\/(?!.*fixly\.com)/i, // External links (except fixly.com)
    /(earn|money|cash|prize|winner|congratulations|claim|urgent|limited)/gi, // Spam keywords
  ]
  
  return !spamPatterns.some(pattern => pattern.test(bio))
}

// URL validation
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Date validation
export function validateDateOfBirth(date: string): boolean {
  const birthDate = new Date(date)
  const today = new Date()
  
  // Check if date is valid
  if (isNaN(birthDate.getTime())) return false
  
  // Must be in the past
  if (birthDate >= today) return false
  
  // Must be reasonable age (13-120 years old)
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  let actualAge = age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    actualAge--
  }
  
  return actualAge >= 13 && actualAge <= 120
}

// Pincode validation (Indian)
export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode)
}

// OTP validation
export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp)
}

// Comprehensive form validation schemas using Zod
export const ValidationSchemas = {
  signup: z.object({
    email: z.string().email().refine(validateEmail, { message: 'Invalid email format' }),
    username: z.string().refine(validateUsername, { message: 'Invalid username format' }),
    password: z.string().refine(validatePassword, { message: 'Password does not meet requirements' }),
    name: z.string().refine(validateName, { message: 'Invalid name format' }),
    phone: z.string().refine(validatePhoneNumber, { message: 'Invalid phone number' }).optional(),
    dateOfBirth: z.string().refine(validateDateOfBirth, { message: 'Invalid date of birth' }).optional(),
    bio: z.string().refine(validateBio, { message: 'Invalid bio' }).optional()
  }),
  
  login: z.object({
    identifier: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required')
  }),
  
  profile: z.object({
    name: z.string().refine(validateName, { message: 'Invalid name format' }),
    bio: z.string().refine(validateBio, { message: 'Invalid bio' }).optional(),
    phone: z.string().refine(validatePhoneNumber, { message: 'Invalid phone number' }).optional(),
    avatar: z.string().url().optional()
  }),
  
  location: z.object({
    type: z.enum(['gps', 'manual']),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      accuracy: z.number().optional()
    }).optional(),
    address: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    stateCode: z.string().length(2),
    pincode: z.string().refine(validatePincode, { message: 'Invalid pincode' }).optional()
  }),
  
  skill: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    experience: z.enum(['beginner', 'intermediate', 'expert']).optional(),
    hourlyRate: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }).optional()
  }),
  
  otp: z.object({
    email: z.string().email(),
    otp: z.string().refine(validateOTP, { message: 'OTP must be 6 digits' }),
    type: z.enum(['email_verification', 'password_reset', 'two_factor', 'phone_verification'])
  })
}

// Sanitization functions
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

// Rate limiting validation
export function validateRateLimit(timestamp: number, windowMs: number, maxRequests: number, currentRequests: number): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (timestamp < windowStart) {
    // Outside window, reset counter
    return true
  }
  
  return currentRequests < maxRequests
}

// Export all validation functions
export const validators = {
  email: validateEmail,
  password: validatePassword,
  username: validateUsername,
  phoneNumber: validatePhoneNumber,
  name: validateName,
  location: validateLocation,
  skill: validateSkill,
  bio: validateBio,
  url: validateURL,
  dateOfBirth: validateDateOfBirth,
  pincode: validatePincode,
  otp: validateOTP,
  passwordStrength: getPasswordStrength
}

export default validators