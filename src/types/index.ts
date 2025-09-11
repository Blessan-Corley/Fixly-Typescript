// Type definitions

// Location Types
export interface State {
  name: string
  code: string
}

export interface City {
  name: string
  state: string
  lat: number
  lng: number
  isMetro?: boolean
  population?: number
  distance?: number // Used for nearby searches
}

export interface CitySearchResult {
  city: string
  state: string
  stateCode: string
  lat: number
  lng: number
}

export interface LocationSearchParams {
  query: string
  state?: string
  limit?: number
}

export interface LocationData {
  type: 'gps' | 'manual'
  coordinates: {
    lat: number
    lng: number
    accuracy?: number // GPS accuracy in meters
  }
  address?: string
  city: string
  state: string
  stateCode: string
  pincode?: string
  timestamp?: Date
  verified?: boolean
}

export interface LocationHistory {
  coordinates: {
    lat: number
    lng: number
    accuracy?: number
  }
  address?: string
  city?: string
  state?: string
  timestamp: Date
  method: 'gps' | 'manual' | 'auto'
}

export interface ApproximateLocation {
  city?: string
  state?: string
  region?: string // North, South, East, West, Central, Northeast India
  lastUpdated: Date
}

// Skill Types
export interface SkillCategory {
  name: string
  icon: string
  isPopular: boolean
  skills: string[]
  description?: string
  avgPrice?: {
    min: number
    max: number
    currency: string
  }
}

export interface SkillData {
  id: string
  name: string
  category: string
  isPopular: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime?: string
  priceRange?: {
    min: number
    max: number
    currency: string
  }
  tags?: string[]
  relatedSkills?: string[]
  description?: string
}

export interface SkillSearchParams {
  query?: string
  category?: string
  isPopular?: boolean
  difficulty?: 'easy' | 'medium' | 'hard'
  limit?: number
  sortBy?: 'name' | 'popularity' | 'price'
}

// User Types with Security
export interface UserMetadata {
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  ipAddress?: string
  userAgent?: string
  source?: 'web' | 'mobile' | 'api'
  referrer?: string
  emailVerified: boolean
  phoneVerified: boolean
  profileCompleted: boolean
  ageVerified: boolean
  ageVerifiedAt?: Date
  agreementVersion?: string
  marketingConsent?: boolean
  loginAttempts: number
  lastLoginAttempt?: Date
  isLocked: boolean
  lockUntil?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  otpAttempts?: number
  termsAcceptedAt?: Date
  privacyAcceptedAt?: Date
  refreshToken?: string
}

export interface User {
  _id: string
  email: string
  username: string
  name: string
  phone: string
  role: 'hirer' | 'fixer'
  dateOfBirth?: Date
  avatar?: string
  bio?: string
  
  // Location with GPS support
  homeAddress: LocationData // Permanent address from signup
  currentLocation?: LocationData // GPS updated location
  locationPermission: {
    status: 'always' | 'session' | 'denied' | 'not_requested'
    lastAsked?: Date
    sessionExpiry?: Date
    autoUpdateEnabled: boolean
    lastAutoUpdate?: Date
    updateInterval: number
    denialCount: number
  }
  locationHistory?: LocationHistory[] // Last 10 locations
  approximateLocation?: ApproximateLocation & {
    source: 'current' | 'home'
  }
  serviceRadius?: number // in km, for fixers
  
  // Skills (for fixers)
  skills?: string[]
  skillCategories?: string[]
  experience?: {
    skillId: string
    years: number
    verified: boolean
  }[]
  
  // Ratings & Reviews
  rating?: {
    average: number
    count: number
    breakdown: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  
  // Statistics
  stats?: {
    jobsCompleted: number
    jobsPosted: number
    totalEarnings?: number
    totalSpent?: number
    responseTime?: number // in minutes
    acceptanceRate?: number // 0-1
  }
  
  // Account Status
  isActive: boolean
  isVerified: boolean
  subscription?: {
    plan: 'free' | 'premium' | 'pro'
    expiresAt?: Date
    features: string[]
  }
  
  // Security
  passwordHash: string
  refreshTokens: string[]
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  
  // Metadata with security
  metadata: UserMetadata
}

// Authentication Types
export interface LoginCredentials {
  identifier: string // email or username
  password: string
  rememberMe?: boolean
  captcha?: string
}

export interface SignupData {
  email: string
  username: string
  name: string
  phone: string
  password: string
  role: 'hirer' | 'fixer'
  skills?: string[]
  location: LocationData
  agreeToTerms: boolean
  marketingConsent?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
  role: 'hirer' | 'fixer'
  iat: number
  exp: number
  jti: string // JWT ID for token blacklisting
  sessionId: string
}

export interface OTPData {
  email: string
  otp: string
  expiresAt: Date
  attempts: number
  verified: boolean
  type: 'email_verification' | 'password_reset' | '2fa'
  ipAddress?: string
  userAgent?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: Date
    requestId: string
    version: string
    pagination?: {
      page: number
      limit: number
      total: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

// Session Types
export interface UserSession {
  _id: string
  userId: string
  sessionId: string
  refreshToken: string
  ipAddress: string
  userAgent: string
  isActive: boolean
  expiresAt: Date
  createdAt: Date
  lastAccessedAt: Date
  location?: {
    country?: string
    city?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
}

// Rate Limiting Types
export interface RateLimitData {
  key: string
  count: number
  resetTime: Date
  isBlocked: boolean
}

// Cache Types
export interface CacheEntry<T = any> {
  key: string
  value: T
  expiresAt: Date
  tags?: string[]
}

// Configuration Types
export interface AppConfig {
  jwt: {
    accessTokenExpiry: string
    refreshTokenExpiry: string
    secret: string
    issuer: string
  }
  email: {
    from: string
    replyTo: string
    otpExpiry: number // minutes
    maxAttempts: number
  }
  upload: {
    maxFileSize: number
    allowedTypes: string[]
    storageProvider: 'local' | 'aws' | 'cloudinary'
  }
  cache: {
    defaultTTL: number // seconds
    maxSize: number
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
  }
  security: {
    maxLoginAttempts: number
    lockoutDuration: number // minutes
    passwordMinLength: number
    requireStrongPassword: boolean
  }
}

// Utility Types
export type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

export type SoftDelete = {
  deletedAt?: Date
  isDeleted?: boolean
}

export type Pagination = {
  page: number
  limit: number
  skip: number
}

export type SortOrder = 'asc' | 'desc'

export type SearchQuery = {
  q?: string
  filters?: Record<string, any>
  sort?: Record<string, SortOrder>
  pagination?: Pagination
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Google OAuth Types
export interface GoogleProfile {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

// Location Service Types
export interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
    altitudeAccuracy?: number
    heading?: number
    speed?: number
  }
  timestamp: number
}

export interface GoogleMapsGeocodingResult {
  formatted_address: string
  address_components: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
    location_type: string
    viewport: {
      northeast: { lat: number; lng: number }
      southwest: { lat: number; lng: number }
    }
  }
  place_id: string
  types: string[]
}