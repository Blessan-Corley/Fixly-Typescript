import mongoose, { Document, Schema, Model } from 'mongoose'
import bcryptjs from 'bcryptjs'
import type { User } from '@/types'
import { LocationData } from '@/types'

// Interface for the User document (modified to match the Mongoose schema)
interface IUserSchema extends Document {
  name: string
  email: string
  password?: string
  phone?: string
  role: 'hirer' | 'fixer'
  profilePicture?: string
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  location?: Location
  
  // Google OAuth fields
  googleId?: string
  
  // Security and audit fields
  lastActiveAt: Date
  loginAttempts: number
  lockUntil?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  
  // Metadata
  metadata?: any
}

export interface IUser extends IUserSchema {
  comparePassword(candidatePassword: string): Promise<boolean>
  updateLastActive(): Promise<void>
  addSearchKeyword(keyword: string): Promise<void>
  metadata?: any
}

// Location schema
const LocationSchema = new Schema({
  address: { type: String, required: true },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: function(v: number[]) {
        return v.length === 2 && 
               v[0] >= -180 && v[0] <= 180 && // longitude
               v[1] >= -90 && v[1] <= 90      // latitude
      },
      message: 'Coordinates must be [longitude, latitude] with valid ranges'
    }
  },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  postalCode: { type: String }
}, { _id: false })

// Create geospatial index for location-based queries
LocationSchema.index({ coordinates: '2dsphere' })

// Metadata schema for tracking entity lifecycle
const MetadataSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedBy: { type: String },
  version: { type: Number, default: 1 },
  tags: [{ type: String }],
  searchKeywords: [{ type: String }]
}, { _id: false })

// User schema
const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: { 
    type: String,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  phone: { 
    type: String,
    match: [/^[+]?[0-9]{10,15}$/, 'Invalid phone number format']
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['hirer', 'fixer'] 
  },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  location: LocationSchema,
  
  // Google OAuth fields
  googleId: { type: String, sparse: true },
  
  // Security and audit fields
  lastActiveAt: { type: Date, default: Date.now },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  
  // Metadata
  metadata: { type: MetadataSchema, default: () => ({}) }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).password
      delete (ret as any).passwordResetToken
      delete (ret as any).emailVerificationToken
      delete (ret as any).loginAttempts
      delete (ret as any).lockUntil
      return ret
    }
  }
})

// Indexes for performance
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ googleId: 1 }, { sparse: true })
UserSchema.index({ role: 1 })
UserSchema.index({ 'location.coordinates': '2dsphere' })
UserSchema.index({ 'metadata.searchKeywords': 'text' })
UserSchema.index({ isVerified: 1 })
UserSchema.index({ lastActiveAt: 1 })

// Pre-save middleware
UserSchema.pre('save', async function(next) {
  // Update metadata
  this.metadata.updatedAt = new Date()
  this.metadata.version += 1
  
  // Hash password if it's modified
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcryptjs.genSalt(12)
      this.password = await bcryptjs.hash(this.password, salt)
      
      // Clear any existing reset tokens when password changes
      this.passwordResetToken = undefined
      this.passwordResetExpires = undefined
    } catch (error) {
      return next(error as Error)
    }
  }
  
  // Generate search keywords
  const keywords = new Set<string>()
  if (this.name) keywords.add(this.name.toLowerCase())
  if (this.email) keywords.add(this.email.toLowerCase())
  if ((this.location as any)?.city) keywords.add((this.location as any).city.toLowerCase())
  if ((this.location as any)?.state) keywords.add((this.location as any).state.toLowerCase())
  
  this.metadata.searchKeywords = Array.from(keywords)
  
  next()
})

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcryptjs.compare(candidatePassword, this.password)
}

UserSchema.methods.updateLastActive = async function(): Promise<void> {
  this.lastActiveAt = new Date()
  await this.save()
}

UserSchema.methods.addSearchKeyword = async function(keyword: string): Promise<void> {
  if (!this.metadata.searchKeywords.includes(keyword.toLowerCase())) {
    this.metadata.searchKeywords.push(keyword.toLowerCase())
    await this.save()
  }
}

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date())
})

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password')
}

UserSchema.statics.findActiveUsers = function(limit: number = 100) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return this.find({ lastActiveAt: { $gte: thirtyDaysAgo } }).limit(limit)
}

UserSchema.statics.findNearbyUsers = function(
  coordinates: [number, number], 
  maxDistance: number = 10000, // meters
  role?: 'hirer' | 'fixer'
) {
  const query: any = {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    }
  }
  
  if (role) query.role = role
  
  return this.find(query)
}

// Prevent re-compilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User