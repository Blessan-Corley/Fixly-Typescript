import mongoose from 'mongoose'

interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Cache the database connection in development to prevent multiple connections
let cached: CachedConnection = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectToDatabase(): Promise<typeof mongoose> {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn
  }

  // If we don't have a connection but we have a promise, await it
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable')
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increase timeout
      socketTimeoutMS: 45000,
      family: 4,
      
      // Remove explicit auth mechanism - let MongoDB Atlas handle it
      // authMechanism: 'SCRAM-SHA-256',
      
      // Performance options
      maxIdleTimeMS: 30000,
      compressors: ['zlib' as const],
      
      // Resilience options  
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10000,
      
      // Application name for monitoring
      appName: 'Fixly-App',
      
      // Additional connection options for Atlas
      autoIndex: false, // Don't build indexes
    }

    // Create the connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB')
      
      // Set up connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err)
      })

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected')
      })

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected')
      })

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close()
        console.log('🛑 MongoDB connection closed through app termination')
        process.exit(0)
      })

      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

// Health check function
export async function checkDatabaseHealth(): Promise<{ 
  status: 'healthy' | 'unhealthy', 
  details: any 
}> {
  try {
    const connection = await connectToDatabase()
    const db = connection.connection.db
    
    if (!db) {
      throw new Error('Database connection not established')
    }
    
    // Ping the database
    const adminDb = db.admin()
    const result = await adminDb.ping()
    
    // Get connection stats
    const stats = {
      readyState: connection.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length,
      ping: result
    }
    
    return {
      status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
      details: stats
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        readyState: mongoose.connection.readyState
      }
    }
  }
}

// Initialize indexes for better performance
export async function initializeIndexes(): Promise<void> {
  try {
    console.log('🔄 Initializing database indexes...')
    
    // Import models to ensure schemas are registered
    await import('./schemas/user')
    await import('./schemas/session')
    await import('./schemas/otp')
    
    // Create indexes
    if (mongoose.connection.db) {
      await mongoose.connection.db.command({ createIndexes: 'users' })
      await mongoose.connection.db.command({ createIndexes: 'usersessions' })
      await mongoose.connection.db.command({ createIndexes: 'otps' })
    }
    
    console.log('✅ Database indexes initialized')
  } catch (error) {
    console.error('❌ Failed to initialize indexes:', error)
    throw error
  }
}

// Clean up expired documents
export async function cleanupExpiredDocuments(): Promise<void> {
  try {
    console.log('🧹 Cleaning up expired documents...')
    
    const UserSession = (await import('./schemas/session')).default
    const OTP = (await import('./schemas/otp')).default
    
    // Clean up expired sessions
    const sessionsDeleted = await UserSession.cleanupExpiredSessions()
    console.log(`🗑️ Deleted ${sessionsDeleted.deletedCount} expired sessions`)
    
    // Clean up expired OTPs
    const otpsDeleted = await OTP.cleanupExpired()
    console.log(`🗑️ Deleted ${otpsDeleted.deletedCount} expired OTPs`)
    
    console.log('✅ Cleanup completed')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  }
}

// Database maintenance function (run periodically)
export async function performMaintenance(): Promise<void> {
  try {
    console.log('🔧 Starting database maintenance...')
    
    // Clean up expired documents
    await cleanupExpiredDocuments()
    
    // Compact collections if needed (MongoDB 4.4+)
    if (process.env.NODE_ENV === 'production') {
      try {
        const db = mongoose.connection.db
        if (db) {
          await db.command({ compact: 'usersessions' })
          await db.command({ compact: 'otps' })
          console.log('💾 Collections compacted')
        }
      } catch (error) {
        console.warn('⚠️ Collection compaction failed (may not be supported):', error)
      }
    }
    
    console.log('✅ Database maintenance completed')
  } catch (error) {
    console.error('❌ Database maintenance failed:', error)
  }
}

// Connection status utility
export function getConnectionStatus(): {
  isConnected: boolean
  readyState: number
  host?: string
  port?: number
  name?: string
} {
  const connection = mongoose.connection
  
  return {
    isConnected: connection.readyState === 1,
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name
  }
}

// Export the main connection function
export default connectToDatabase

// Schedule periodic maintenance (every 6 hours)
if (process.env.NODE_ENV === 'production') {
  setInterval(performMaintenance, 6 * 60 * 60 * 1000)
}