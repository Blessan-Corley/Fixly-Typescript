import mongoose, { Schema, Document, Model } from 'mongoose'
import { UserSession } from '@/types'

// User Session Schema for secure JWT session management
const UserSessionSchema = new Schema<UserSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ipAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(ip: string) {
        // Basic IP validation (IPv4 and IPv6)
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
        return ipv4Regex.test(ip) || ipv6Regex.test(ip)
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    required: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  location: {
    country: { type: String, maxlength: 100 },
    city: { type: String, maxlength: 100 },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 }
    }
  }
}, {
  timestamps: false, // We handle timestamps manually
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v
      delete ret.refreshToken // Don't expose refresh token in JSON
      return ret
    }
  }
})

// Indexes for performance and automatic cleanup
UserSessionSchema.index({ userId: 1, isActive: 1 })
UserSessionSchema.index({ sessionId: 1, isActive: 1 })
UserSessionSchema.index({ refreshToken: 1 }, { sparse: true })
UserSessionSchema.index({ createdAt: 1 })
UserSessionSchema.index({ expiresAt: 1 })

// Compound index for user session management
UserSessionSchema.index({ userId: 1, createdAt: -1 })

// Pre-save middleware to update lastAccessedAt
UserSessionSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastAccessedAt = new Date()
  }
  next()
})

// Instance methods
UserSessionSchema.methods.updateLastAccessed = async function(): Promise<void> {
  this.lastAccessedAt = new Date()
  await this.save()
}

UserSessionSchema.methods.revoke = async function(): Promise<void> {
  this.isActive = false
  await this.save()
}

UserSessionSchema.methods.isExpired = function(): boolean {
  return this.expiresAt < new Date()
}

UserSessionSchema.methods.getRemainingTime = function(): number {
  const now = new Date()
  return Math.max(0, this.expiresAt.getTime() - now.getTime())
}

// Static methods
UserSessionSchema.statics.createSession = async function(
  userId: string, 
  sessionId: string, 
  refreshToken: string,
  ipAddress: string,
  userAgent: string,
  expiresIn: number = 7 * 24 * 60 * 60 * 1000, // 7 days default
  location?: { country?: string, city?: string, coordinates?: { lat: number, lng: number } }
) {
  const expiresAt = new Date(Date.now() + expiresIn)
  
  const session = new this({
    userId,
    sessionId,
    refreshToken,
    ipAddress,
    userAgent,
    expiresAt,
    location
  })
  
  return session.save()
}

UserSessionSchema.statics.findActiveSession = function(sessionId: string) {
  return this.findOne({
    sessionId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId', 'email username role isActive isVerified')
}

UserSessionSchema.statics.findByRefreshToken = function(refreshToken: string) {
  return this.findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId', 'email username role isActive isVerified')
}

UserSessionSchema.statics.revokeUserSessions = async function(userId: string, exceptSessionId?: string) {
  const query: any = { userId, isActive: true }
  if (exceptSessionId) {
    query.sessionId = { $ne: exceptSessionId }
  }
  
  return this.updateMany(query, { 
    isActive: false,
    lastAccessedAt: new Date()
  })
}

UserSessionSchema.statics.cleanupExpiredSessions = async function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, lastAccessedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Keep inactive sessions for 7 days for audit
    ]
  })
}

UserSessionSchema.statics.getUserActiveSessions = function(userId: string) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ lastAccessedAt: -1 })
}

UserSessionSchema.statics.getSessionStats = async function(userId: string) {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: '$userId',
        totalSessions: { $sum: 1 },
        activeSessions: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$isActive', true] }, { $gt: ['$expiresAt', new Date()] }] },
              1,
              0
            ]
          }
        },
        uniqueIPs: { $addToSet: '$ipAddress' },
        lastSession: { $max: '$createdAt' },
        firstSession: { $min: '$createdAt' }
      }
    },
    {
      $project: {
        totalSessions: 1,
        activeSessions: 1,
        uniqueIPCount: { $size: '$uniqueIPs' },
        lastSession: 1,
        firstSession: 1
      }
    }
  ]
  
  const result = await this.aggregate(pipeline)
  return result[0] || {
    totalSessions: 0,
    activeSessions: 0,
    uniqueIPCount: 0,
    lastSession: null,
    firstSession: null
  }
}

// Security method to detect suspicious activity
UserSessionSchema.statics.detectSuspiciousActivity = async function(userId: string) {
  const recentSessions = await this.find({
    userId,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
  }).sort({ createdAt: -1 })
  
  if (recentSessions.length === 0) return { suspicious: false }
  
  const uniqueIPs = new Set(recentSessions.map(s => s.ipAddress))
  const uniqueUserAgents = new Set(recentSessions.map(s => s.userAgent))
  const locations = recentSessions
    .filter(s => s.location?.coordinates)
    .map(s => s.location!.coordinates!)
  
  const suspicious = {
    suspicious: false,
    reasons: [] as string[],
    sessionCount: recentSessions.length,
    uniqueIPs: uniqueIPs.size,
    uniqueUserAgents: uniqueUserAgents.size
  }
  
  // Multiple IPs in short time
  if (uniqueIPs.size > 3) {
    suspicious.suspicious = true
    suspicious.reasons.push('Multiple IP addresses detected')
  }
  
  // Too many sessions
  if (recentSessions.length > 10) {
    suspicious.suspicious = true
    suspicious.reasons.push('Excessive login attempts')
  }
  
  // Geographic impossibility (simple distance check)
  if (locations.length > 1) {
    const distances = []
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1]
      const curr = locations[i]
      const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
      distances.push(distance)
    }
    
    const maxDistance = Math.max(...distances)
    if (maxDistance > 1000) { // 1000km
      suspicious.suspicious = true
      suspicious.reasons.push('Geographically impossible login locations')
    }
  }
  
  return suspicious
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface UserSessionDocument extends UserSession, Document {
  updateLastAccessed(): Promise<void>
  revoke(): Promise<void>
  isExpired(): boolean
  getRemainingTime(): number
}

export interface UserSessionModel extends Model<UserSessionDocument> {
  createSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
    expiresIn?: number,
    location?: { country?: string, city?: string, coordinates?: { lat: number, lng: number } }
  ): Promise<UserSessionDocument>
  findActiveSession(sessionId: string): Promise<UserSessionDocument | null>
  findByRefreshToken(refreshToken: string): Promise<UserSessionDocument | null>
  revokeUserSessions(userId: string, exceptSessionId?: string): Promise<any>
  cleanupExpiredSessions(): Promise<any>
  getUserActiveSessions(userId: string): Promise<UserSessionDocument[]>
  getSessionStats(userId: string): Promise<any>
  detectSuspiciousActivity(userId: string): Promise<any>
}

export default mongoose.models.UserSession as UserSessionModel || mongoose.model<UserSessionDocument, UserSessionModel>('UserSession', UserSessionSchema)