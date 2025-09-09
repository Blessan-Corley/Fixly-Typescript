import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { User, UserMetadata, LocationData } from '@/types'

// User Schema with comprehensive security and metadata
const UserMetadataSchema = new Schema<UserMetadata>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  ipAddress: { type: String, select: false }, // Sensitive data not selected by default
  userAgent: { type: String, select: false },
  source: { type: String, enum: ['web', 'mobile', 'api'], default: 'web' },
  referrer: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  ageVerified: { type: Boolean, default: false },
  ageVerifiedAt: { type: Date },
  agreementVersion: { type: String },
  marketingConsent: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lastLoginAttempt: { type: Date },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date }
})

const LocationDataSchema = new Schema<LocationData>({
  type: { type: String, enum: ['gps', 'manual'], required: true },
  coordinates: {
    lat: { 
      type: Number, 
      required: true,
      validate: {
        validator: function(lat: number) {
          // India boundaries: roughly 6°N to 37°N
          return lat >= 6.0 && lat <= 37.6
        },
        message: 'Location must be within India (latitude between 6°N and 37.6°N)'
      }
    },
    lng: { 
      type: Number, 
      required: true,
      validate: {
        validator: function(lng: number) {
          // India boundaries: roughly 68°E to 97°E
          return lng >= 68.0 && lng <= 97.25
        },
        message: 'Location must be within India (longitude between 68°E and 97.25°E)'
      }
    },
    accuracy: { type: Number } // GPS accuracy in meters
  },
  address: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  stateCode: { type: String, required: true },
  pincode: { 
    type: String,
    validate: {
      validator: function(pincode: string) {
        return !pincode || /^[1-9][0-9]{5}$/.test(pincode)
      },
      message: 'Please enter a valid 6-digit Indian pincode'
    }
  },
  timestamp: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
})

// Location History Schema for tracking user movements
const LocationHistorySchema = new Schema({
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }
  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  timestamp: { type: Date, default: Date.now },
  method: { type: String, enum: ['gps', 'manual', 'auto'], default: 'gps' }
})

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      message: 'Please enter a valid email address'
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
    validate: {
      validator: function(username: string) {
        return /^[a-z0-9_]+$/.test(username) && !/(.)\1{2,}/.test(username)
      },
      message: 'Username must contain only lowercase letters, numbers, and underscores with no consecutive repeating characters'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    validate: {
      validator: function(name: string) {
        return /^[a-zA-Z\s]+$/.test(name.trim())
      },
      message: 'Name must contain only letters and spaces'
    }
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(phone: string) {
        const cleaned = phone.replace(/\D/g, '')
        return cleaned.length === 10 && /^[6-9]/.test(cleaned)
      },
      message: 'Phone number must be 10 digits and start with 6-9'
    }
  },
  role: {
    type: String,
    enum: ['hirer', 'fixer'],
    required: true,
    index: true,
    immutable: true // Lock role permanently once set
  },
  dateOfBirth: {
    type: Date,
    required: false, // Will be required after initial signup
    validate: {
      validator: function(date: Date) {
        if (!date) return true // Allow null initially
        const now = new Date()
        const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate())
        return date <= now && date >= hundredYearsAgo
      },
      message: 'Date of birth must be a valid date within the last 100 years'
    }
  },
  avatar: {
    type: String,
    validate: {
      validator: function(url: string) {
        return !url || /^https?:\/\//.test(url)
      },
      message: 'Avatar must be a valid URL'
    }
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // Location with GPS support
  location: {
    type: LocationDataSchema,
    required: true
  },
  // Location History (last 3 locations)
  locationHistory: [{
    type: LocationHistorySchema,
    default: []
  }],
  // Approximate location for privacy
  approximateLocation: {
    city: { type: String },
    state: { type: String },
    region: { type: String }, // North, South, East, West, Central India
    lastUpdated: { type: Date, default: Date.now }
  },
  serviceRadius: {
    type: Number,
    min: 1,
    max: 100,
    default: 10 // km, for fixers
  },
  
  // Skills (for fixers)
  skills: [{
    type: String,
    trim: true,
    validate: {
      validator: function(skill: string) {
        return skill.length >= 2 && skill.length <= 50
      },
      message: 'Each skill must be between 2 and 50 characters'
    }
  }],
  skillCategories: [String],
  experience: [{
    skillId: { type: String, required: true },
    years: { type: Number, min: 0, max: 50 },
    verified: { type: Boolean, default: false }
  }],
  
  // Ratings & Reviews
  rating: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  
  // Statistics
  stats: {
    jobsCompleted: { type: Number, default: 0 },
    jobsPosted: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0, select: false }, // Sensitive financial data
    totalSpent: { type: Number, default: 0, select: false },
    responseTime: { type: Number, default: 0 }, // in minutes
    acceptanceRate: { type: Number, min: 0, max: 1, default: 0 }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true, index: true },
  isVerified: { type: Boolean, default: false, index: true },
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
    expiresAt: { type: Date },
    features: [String]
  },
  
  // Security - marked as select: false for sensitive data
  passwordHash: { type: String, required: true, select: false },
  refreshTokens: [{ type: String, select: false }],
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  
  // Metadata with security
  metadata: {
    type: UserMetadataSchema,
    default: () => ({})
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete (ret as any).passwordHash
      delete (ret as any).refreshTokens
      delete (ret as any).twoFactorSecret
      delete (ret as any).__v
      return ret
    }
  }
})

// Indexes for performance and security
UserSchema.index({ email: 1, isActive: 1 })
UserSchema.index({ username: 1, isActive: 1 })
UserSchema.index({ phone: 1, isActive: 1 })
UserSchema.index({ role: 1, isActive: 1, isVerified: 1 })
UserSchema.index({ 'location.coordinates.lat': 1, 'location.coordinates.lng': 1 }) // Geo index
UserSchema.index({ 'location.city': 1, 'location.state': 1, role: 1 })
UserSchema.index({ skills: 1, role: 1, isActive: 1 })
UserSchema.index({ 'metadata.createdAt': 1 })
UserSchema.index({ 'metadata.isLocked': 1, 'metadata.lockUntil': 1 })

// Compound index for search performance
UserSchema.index({
  name: 'text',
  username: 'text',
  bio: 'text',
  skills: 'text'
}, {
  weights: {
    name: 10,
    username: 8,
    skills: 6,
    bio: 1
  }
})

// Pre-save middleware to hash password and update metadata
UserSchema.pre('save', async function(next) {
  const user = this as Document & User
  
  // Update metadata timestamp
  if (user.isModified()) {
    user.metadata.updatedAt = new Date()
  }
  
  // Hash password if modified
  if (user.isModified('passwordHash') && !user.passwordHash.startsWith('$2')) {
    const salt = await bcrypt.genSalt(12)
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt)
  }
  
  // Update profile completion status
  const requiredFields = ['email', 'username', 'name', 'phone', 'role', 'location']
  const isComplete = requiredFields.every(field => {
    if (field === 'location') {
      return user.location && user.location.city && user.location.state
    }
    return user[field as keyof User]
  })
  
  if (user.role === 'fixer') {
    user.metadata.profileCompleted = isComplete && Boolean(user.skills && user.skills.length > 0)
  } else {
    user.metadata.profileCompleted = isComplete
  }
  
  next()
})

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

UserSchema.methods.generateRefreshToken = function(): string {
  const token = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15)
  this.refreshTokens.push(token)
  return token
}

UserSchema.methods.removeRefreshToken = function(token: string): void {
  this.refreshTokens = this.refreshTokens.filter((t: string) => t !== token)
}

UserSchema.methods.isAccountLocked = function(): boolean {
  return this.metadata.isLocked && this.metadata.lockUntil && this.metadata.lockUntil > new Date()
}

UserSchema.methods.incLoginAttempts = async function(): Promise<void> {
  const maxAttempts = 5
  const lockTime = 30 * 60 * 1000 // 30 minutes
  
  // Reset attempts if lock has expired
  if (this.metadata.lockUntil && this.metadata.lockUntil < new Date()) {
    this.metadata.loginAttempts = 1
    this.metadata.isLocked = false
    this.metadata.lockUntil = undefined
  } else {
    this.metadata.loginAttempts += 1
  }
  
  this.metadata.lastLoginAttempt = new Date()
  
  // Lock account if max attempts reached
  if (this.metadata.loginAttempts >= maxAttempts && !this.metadata.isLocked) {
    this.metadata.isLocked = true
    this.metadata.lockUntil = new Date(Date.now() + lockTime)
  }
  
  await this.save()
}

UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.metadata.loginAttempts = 0
  this.metadata.isLocked = false
  this.metadata.lockUntil = undefined
  this.metadata.lastLoginAt = new Date()
  await this.save()
}

UserSchema.methods.updateLocation = function(locationData: {
  coordinates: { lat: number; lng: number; accuracy?: number };
  address?: string;
  city: string;
  state: string;
  method?: 'gps' | 'manual' | 'auto';
}): void {
  // Update current location
  this.location.coordinates = locationData.coordinates
  this.location.address = locationData.address
  this.location.city = locationData.city
  this.location.state = locationData.state
  this.location.timestamp = new Date()
  
  // Add to location history (keep only last 3)
  const historyEntry = {
    coordinates: locationData.coordinates,
    address: locationData.address,
    city: locationData.city,
    state: locationData.state,
    timestamp: new Date(),
    method: locationData.method || 'gps'
  }
  
  this.locationHistory.unshift(historyEntry)
  if (this.locationHistory.length > 3) {
    this.locationHistory = this.locationHistory.slice(0, 3)
  }
  
  // Update approximate location with region
  this.approximateLocation = {
    city: locationData.city,
    state: locationData.state,
    region: this.getRegionFromState(locationData.state),
    lastUpdated: new Date()
  }
}

UserSchema.methods.getRegionFromState = function(state: string): string {
  const stateToRegion: { [key: string]: string } = {
    // North India
    'Delhi': 'North India',
    'Punjab': 'North India',
    'Haryana': 'North India',
    'Himachal Pradesh': 'North India',
    'Jammu and Kashmir': 'North India',
    'Ladakh': 'North India',
    'Uttarakhand': 'North India',
    'Uttar Pradesh': 'North India',
    
    // West India
    'Rajasthan': 'West India',
    'Gujarat': 'West India',
    'Maharashtra': 'West India',
    'Goa': 'West India',
    'Dadra and Nagar Haveli and Daman and Diu': 'West India',
    
    // South India
    'Karnataka': 'South India',
    'Kerala': 'South India',
    'Tamil Nadu': 'South India',
    'Andhra Pradesh': 'South India',
    'Telangana': 'South India',
    'Puducherry': 'South India',
    'Lakshadweep': 'South India',
    'Andaman and Nicobar Islands': 'South India',
    
    // East India
    'West Bengal': 'East India',
    'Odisha': 'East India',
    'Jharkhand': 'East India',
    'Bihar': 'East India',
    'Sikkim': 'East India',
    
    // Northeast India
    'Assam': 'Northeast India',
    'Arunachal Pradesh': 'Northeast India',
    'Manipur': 'Northeast India',
    'Meghalaya': 'Northeast India',
    'Mizoram': 'Northeast India',
    'Nagaland': 'Northeast India',
    'Tripura': 'Northeast India',
    
    // Central India
    'Madhya Pradesh': 'Central India',
    'Chhattisgarh': 'Central India'
  }
  
  return stateToRegion[state] || 'India'
}

// Static methods
UserSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ],
    isActive: true
  })
}

UserSchema.statics.findNearby = function(lat: number, lng: number, radiusKm: number = 50, role?: string) {
  const query: any = {
    'location.coordinates': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    },
    isActive: true,
    isVerified: true
  }
  
  if (role) {
    query.role = role
  }
  
  return this.find(query)
}

UserSchema.statics.searchBySkills = function(skills: string[], location?: { city: string, state: string }) {
  const query: any = {
    role: 'fixer',
    skills: { $in: skills },
    isActive: true,
    isVerified: true
  }
  
  if (location) {
    query['location.city'] = location.city
    query['location.state'] = location.state
  }
  
  return this.find(query).sort({ 'rating.average': -1, 'stats.jobsCompleted': -1 })
}

// Create compound geo index
UserSchema.index({ 'location.coordinates': '2dsphere' })

export interface UserDocument extends Omit<User, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>
  generateRefreshToken(): string
  removeRefreshToken(token: string): void
  isAccountLocked(): boolean
  incLoginAttempts(): Promise<void>
  resetLoginAttempts(): Promise<void>
}

export interface UserModel extends Model<UserDocument> {
  findByEmailOrUsername(identifier: string): Promise<UserDocument | null>
  findNearby(lat: number, lng: number, radiusKm?: number, role?: string): Promise<UserDocument[]>
  searchBySkills(skills: string[], location?: { city: string, state: string }): Promise<UserDocument[]>
}

export default (mongoose.models.User || mongoose.model('User', UserSchema)) as UserModel