import mongoose, { Document, Schema, Model } from 'mongoose'
import { FixerProfile, PortfolioItem, Document as UserDocument, EntityMetadata } from '@/types'

// Interface for FixerProfile document
export interface IFixerProfile extends Omit<FixerProfile, '_id'>, Document {
  calculateRating(): Promise<number>
  updateAvailability(availability: FixerProfile['availability']): Promise<void>
  addPortfolioItem(item: Omit<PortfolioItem, '_id'>): Promise<void>
  incrementJobsCompleted(): Promise<void>
  metadata: EntityMetadata
}

// Portfolio Item schema
const PortfolioItemSchema = new Schema<PortfolioItem>({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  images: [{ 
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
      },
      message: 'Invalid image URL format'
    }
  }],
  category: { type: String, required: true },
  completedAt: { type: Date, required: true }
}, {
  timestamps: true
})

// Document schema for certifications
const DocumentSchema = new Schema<UserDocument>({
  type: { 
    type: String, 
    required: true, 
    enum: ['license', 'certification', 'identity'] 
  },
  url: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+$/i.test(v)
      },
      message: 'Invalid document URL format'
    }
  },
  verified: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
})

// Availability schema
const AvailabilitySchema = new Schema({
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  startTime: { 
    type: String, 
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: { 
    type: String, 
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  }
}, { _id: false })

// Metadata schema
const MetadataSchema = new Schema<EntityMetadata>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedBy: { type: String },
  version: { type: Number, default: 1 },
  tags: [{ type: String }],
  searchKeywords: [{ type: String }]
}, { _id: false })

// Fixer Profile schema
const FixerProfileSchema = new Schema<IFixerProfile>({
  // Reference to User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  
  // Basic profile info (copied from User for easy access)
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'fixer', immutable: true },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  location: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v: number[]) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90
        }
      }
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    postalCode: { type: String }
  },
  
  // Fixer-specific fields
  skills: [{ 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  }],
  experience: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 50 
  },
  hourlyRate: { 
    type: Number, 
    required: true, 
    min: 10, 
    max: 10000 
  },
  availability: { type: AvailabilitySchema, required: true },
  serviceRadius: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 100,
    default: 10
  },
  portfolio: [PortfolioItemSchema],
  
  // Performance metrics
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  totalJobs: { type: Number, default: 0 },
  completionRate: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  },
  responseTime: { 
    type: Number, 
    default: 60,
    min: 1
  },
  jobsCompleted: { type: Number, default: 0 },
  
  // Subscription and verification
  isProMember: { type: Boolean, default: false },
  proMemberUntil: { type: Date },
  documents: [DocumentSchema],
  
  // Business information
  businessName: { type: String, maxlength: 200 },
  businessLicense: { type: String },
  insuranceInfo: {
    provider: { type: String },
    policyNumber: { type: String },
    expiryDate: { type: Date },
    coverage: { type: Number }
  },
  
  // Search and discovery
  isActive: { type: Boolean, default: true },
  lastActiveAt: { type: Date, default: Date.now },
  featuredUntil: { type: Date },
  
  // Metadata
  metadata: { type: MetadataSchema, default: () => ({}) }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.userId
      return ret
    }
  }
})

// Indexes for performance
FixerProfileSchema.index({ userId: 1 }, { unique: true })
FixerProfileSchema.index({ skills: 1 })
FixerProfileSchema.index({ 'location.coordinates': '2dsphere' })
FixerProfileSchema.index({ rating: -1 })
FixerProfileSchema.index({ hourlyRate: 1 })
FixerProfileSchema.index({ isActive: 1 })
FixerProfileSchema.index({ isProMember: 1 })
FixerProfileSchema.index({ featuredUntil: 1 })
FixerProfileSchema.index({ 'metadata.searchKeywords': 'text' })
FixerProfileSchema.index({ lastActiveAt: 1 })

// Compound indexes for complex queries
FixerProfileSchema.index({ skills: 1, 'location.coordinates': '2dsphere' })
FixerProfileSchema.index({ rating: -1, isActive: 1 })
FixerProfileSchema.index({ isProMember: 1, rating: -1 })

// Pre-save middleware
FixerProfileSchema.pre('save', function(next) {
  // Update metadata
  this.metadata.updatedAt = new Date()
  this.metadata.version += 1
  
  // Generate search keywords
  const keywords = new Set<string>()
  if (this.name) keywords.add(this.name.toLowerCase())
  if (this.businessName) keywords.add(this.businessName.toLowerCase())
  this.skills.forEach(skill => keywords.add(skill.toLowerCase()))
  if (this.location?.city) keywords.add(this.location.city.toLowerCase())
  if (this.location?.state) keywords.add(this.location.state.toLowerCase())
  
  this.metadata.searchKeywords = Array.from(keywords)
  
  // Calculate completion rate
  if (this.totalJobs > 0) {
    this.completionRate = (this.jobsCompleted / this.totalJobs) * 100
  }
  
  next()
})

// Instance methods
FixerProfileSchema.methods.calculateRating = async function(): Promise<number> {
  // This would typically aggregate reviews from a Reviews collection
  // For now, return the stored rating
  return this.rating
}

FixerProfileSchema.methods.updateAvailability = async function(availability: FixerProfile['availability']): Promise<void> {
  this.availability = availability
  await this.save()
}

FixerProfileSchema.methods.addPortfolioItem = async function(item: Omit<PortfolioItem, '_id'>): Promise<void> {
  this.portfolio.push(item)
  await this.save()
}

FixerProfileSchema.methods.incrementJobsCompleted = async function(): Promise<void> {
  this.jobsCompleted += 1
  this.totalJobs += 1
  this.lastActiveAt = new Date()
  await this.save()
}

// Virtuals
FixerProfileSchema.virtual('isProActive').get(function() {
  return this.isProMember && (!this.proMemberUntil || this.proMemberUntil > new Date())
})

FixerProfileSchema.virtual('isFeatured').get(function() {
  return this.featuredUntil && this.featuredUntil > new Date()
})

// Static methods
FixerProfileSchema.statics.findNearbyFixers = function(
  coordinates: [number, number],
  maxDistance: number = 10000, // meters
  skills?: string[]
) {
  const query: any = {
    isActive: true,
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
  
  if (skills && skills.length > 0) {
    query.skills = { $in: skills }
  }
  
  return this.find(query).sort({ rating: -1, isProMember: -1 })
}

FixerProfileSchema.statics.findBySkills = function(skills: string[]) {
  return this.find({ 
    skills: { $in: skills },
    isActive: true
  }).sort({ rating: -1 })
}

FixerProfileSchema.statics.getFeaturedFixers = function(limit: number = 10) {
  return this.find({
    isActive: true,
    featuredUntil: { $gt: new Date() }
  }).sort({ rating: -1 }).limit(limit)
}

FixerProfileSchema.statics.getTopRatedFixers = function(limit: number = 10) {
  return this.find({
    isActive: true,
    totalJobs: { $gte: 5 }
  }).sort({ rating: -1 }).limit(limit)
}

// Prevent re-compilation in development
const FixerProfile: Model<IFixerProfile> = mongoose.models.FixerProfile || mongoose.model<IFixerProfile>('FixerProfile', FixerProfileSchema)

export default FixerProfile