import mongoose, { Schema, Document, Model } from 'mongoose'
import { OTPData } from '@/types'

// OTP Schema for secure email verification and password reset
const OTPSchema = new Schema<OTPData>({
  email: {
    type: String,
    required: true,
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
  otp: {
    type: String,
    required: true,
    length: 6,
    validate: {
      validator: function(otp: string) {
        return /^\d{6}$/.test(otp)
      },
      message: 'OTP must be exactly 6 digits'
    }
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic cleanup
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset', '2fa'],
    required: true,
    index: true
  },
  ipAddress: {
    type: String,
    validate: {
      validator: function(ip: string) {
        if (!ip) return true // Optional field
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
        return ipv4Regex.test(ip) || ipv6Regex.test(ip)
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.otp // Never expose OTP in JSON responses
      delete ret.__v
      return ret
    }
  }
})

// Indexes for performance and security
OTPSchema.index({ email: 1, type: 1, verified: 1 })
OTPSchema.index({ email: 1, type: 1, createdAt: -1 })
OTPSchema.index({ createdAt: 1 })
OTPSchema.index({ expiresAt: 1 })

// Compound index for rate limiting
OTPSchema.index({ email: 1, ipAddress: 1, createdAt: -1 })

// Instance methods
OTPSchema.methods.isExpired = function(): boolean {
  return this.expiresAt < new Date()
}

OTPSchema.methods.isValid = function(): boolean {
  return !this.isExpired() && !this.verified && this.attempts < 5
}

OTPSchema.methods.canRetry = function(): boolean {
  return this.attempts < 5 && !this.verified
}

OTPSchema.methods.verify = async function(inputOTP: string): Promise<boolean> {
  if (this.isExpired()) {
    return false
  }
  
  if (this.verified) {
    return false
  }
  
  this.attempts += 1
  
  if (this.otp === inputOTP) {
    this.verified = true
    await this.save()
    return true
  } else {
    // Lock after 5 failed attempts
    if (this.attempts >= 5) {
      this.expiresAt = new Date() // Immediately expire
    }
    await this.save()
    return false
  }
}

OTPSchema.methods.getRemainingAttempts = function(): number {
  return Math.max(0, 5 - this.attempts)
}

OTPSchema.methods.getTimeRemaining = function(): number {
  const now = new Date()
  return Math.max(0, this.expiresAt.getTime() - now.getTime())
}

// Static methods
OTPSchema.statics.generateOTP = function(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

OTPSchema.statics.createOTP = async function(
  email: string,
  type: 'email_verification' | 'password_reset' | '2fa',
  expiryMinutes: number = 10,
  ipAddress?: string,
  userAgent?: string
): Promise<{ otp: string, otpDocument: any }> {
  // Clean up old OTPs for this email and type
  await this.deleteMany({
    email,
    type,
    $or: [
      { verified: true },
      { expiresAt: { $lt: new Date() } },
      { attempts: { $gte: 5 } }
    ]
  })
  
  const otp = this.generateOTP()
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)
  
  const otpDocument = new this({
    email,
    otp,
    expiresAt,
    type,
    ipAddress,
    userAgent
  })
  
  await otpDocument.save()
  return { otp, otpDocument }
}

OTPSchema.statics.verifyOTP = async function(
  email: string,
  inputOTP: string,
  type: 'email_verification' | 'password_reset' | '2fa'
): Promise<{ success: boolean, message: string, attempts?: number }> {
  const otpDoc = await this.findOne({
    email,
    type,
    verified: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 })
  
  if (!otpDoc) {
    return {
      success: false,
      message: 'No valid OTP found. Please request a new one.'
    }
  }
  
  if (!otpDoc.canRetry()) {
    return {
      success: false,
      message: 'Maximum attempts exceeded. Please request a new OTP.'
    }
  }
  
  const isValid = await otpDoc.verify(inputOTP)
  
  if (isValid) {
    return {
      success: true,
      message: 'OTP verified successfully.'
    }
  } else {
    const remainingAttempts = otpDoc.getRemainingAttempts()
    return {
      success: false,
      message: remainingAttempts > 0 
        ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
        : 'Maximum attempts exceeded. Please request a new OTP.',
      attempts: remainingAttempts
    }
  }
}

OTPSchema.statics.checkRateLimit = async function(
  email: string,
  ipAddress?: string,
  windowMinutes: number = 60,
  maxAttempts: number = 5
): Promise<{ allowed: boolean, remainingAttempts: number, resetTime?: Date }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)
  
  const query: any = {
    email,
    createdAt: { $gte: windowStart }
  }
  
  if (ipAddress) {
    query.ipAddress = ipAddress
  }
  
  const recentAttempts = await this.countDocuments(query)
  
  if (recentAttempts >= maxAttempts) {
    const oldestAttempt = await this.findOne(query).sort({ createdAt: 1 })
    const resetTime = oldestAttempt 
      ? new Date(oldestAttempt.createdAt.getTime() + windowMinutes * 60 * 1000)
      : new Date(Date.now() + windowMinutes * 60 * 1000)
    
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime
    }
  }
  
  return {
    allowed: true,
    remainingAttempts: maxAttempts - recentAttempts
  }
}

OTPSchema.statics.cleanupExpired = async function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { verified: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Keep verified OTPs for 24 hours for audit
      { attempts: { $gte: 5 }, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Keep failed attempts for 24 hours
    ]
  })
}

OTPSchema.statics.getOTPStats = async function(email: string, hours: number = 24) {
  const windowStart = new Date(Date.now() - hours * 60 * 60 * 1000)
  
  const pipeline = [
    {
      $match: {
        email,
        createdAt: { $gte: windowStart }
      }
    },
    {
      $group: {
        _id: '$type',
        totalRequests: { $sum: 1 },
        successfulVerifications: {
          $sum: { $cond: ['$verified', 1, 0] }
        },
        failedAttempts: {
          $sum: { $cond: [{ $gte: ['$attempts', 5] }, 1, 0] }
        },
        avgAttempts: { $avg: '$attempts' }
      }
    }
  ]
  
  const stats = await this.aggregate(pipeline)
  
  // Convert array to object for easier access
  const result: any = {
    email_verification: { totalRequests: 0, successfulVerifications: 0, failedAttempts: 0, avgAttempts: 0 },
    password_reset: { totalRequests: 0, successfulVerifications: 0, failedAttempts: 0, avgAttempts: 0 },
    '2fa': { totalRequests: 0, successfulVerifications: 0, failedAttempts: 0, avgAttempts: 0 }
  }
  
  stats.forEach(stat => {
    result[stat._id] = {
      totalRequests: stat.totalRequests,
      successfulVerifications: stat.successfulVerifications,
      failedAttempts: stat.failedAttempts,
      avgAttempts: Math.round(stat.avgAttempts * 100) / 100
    }
  })
  
  return result
}

// Security method to detect suspicious OTP activity
OTPSchema.statics.detectSuspiciousOTPActivity = async function(email: string, ipAddress?: string) {
  const recentWindow = new Date(Date.now() - 60 * 60 * 1000) // Last hour
  
  const query: any = {
    email,
    createdAt: { $gte: recentWindow }
  }
  
  const recentOTPs = await this.find(query).sort({ createdAt: -1 })
  
  if (recentOTPs.length === 0) return { suspicious: false }
  
  const uniqueIPs = new Set(recentOTPs.map(otp => otp.ipAddress).filter(Boolean))
  const failedCount = recentOTPs.filter(otp => otp.attempts >= 5).length
  
  const suspicious = {
    suspicious: false,
    reasons: [] as string[],
    otpCount: recentOTPs.length,
    uniqueIPs: uniqueIPs.size,
    failedCount
  }
  
  // Too many OTP requests in short time
  if (recentOTPs.length > 10) {
    suspicious.suspicious = true
    suspicious.reasons.push('Excessive OTP requests')
  }
  
  // Multiple IPs requesting OTPs
  if (uniqueIPs.size > 3) {
    suspicious.suspicious = true
    suspicious.reasons.push('Multiple IP addresses requesting OTPs')
  }
  
  // High failure rate
  if (failedCount > 3) {
    suspicious.suspicious = true
    suspicious.reasons.push('Multiple failed verification attempts')
  }
  
  return suspicious
}

export interface OTPDocument extends OTPData, Document {
  isExpired(): boolean
  isValid(): boolean
  canRetry(): boolean
  verify(inputOTP: string): Promise<boolean>
  getRemainingAttempts(): number
  getTimeRemaining(): number
}

export interface OTPModel extends Model<OTPDocument> {
  generateOTP(): string
  createOTP(
    email: string,
    type: 'email_verification' | 'password_reset' | '2fa',
    expiryMinutes?: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ otp: string, otpDocument: OTPDocument }>
  verifyOTP(
    email: string,
    inputOTP: string,
    type: 'email_verification' | 'password_reset' | '2fa'
  ): Promise<{ success: boolean, message: string, attempts?: number }>
  checkRateLimit(
    email: string,
    ipAddress?: string,
    windowMinutes?: number,
    maxAttempts?: number
  ): Promise<{ allowed: boolean, remainingAttempts: number, resetTime?: Date }>
  cleanupExpired(): Promise<any>
  getOTPStats(email: string, hours?: number): Promise<any>
  detectSuspiciousOTPActivity(email: string, ipAddress?: string): Promise<any>
}

export default mongoose.models.OTP as OTPModel || mongoose.model<OTPDocument, OTPModel>('OTP', OTPSchema)