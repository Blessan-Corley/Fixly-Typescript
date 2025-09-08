import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/database/connection'
import RedisService from '@/lib/redis/client'

// GET - Health check for all services
export async function GET(request: NextRequest) {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'unknown', message: '', responseTime: 0 },
      redis: { status: 'unknown', message: '', responseTime: 0 },
      nextAuth: { status: 'healthy', message: 'NextAuth configuration loaded' },
      api: { status: 'healthy', message: 'API server responding' }
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      nextjsVersion: '15.5.2',
      redisConfigured: !!process.env.REDIS_URL,
      databaseConfigured: !!process.env.MONGODB_URI
    }
  }

  // Test Database Connection
  const dbStart = Date.now()
  try {
    await connectToDatabase()
    healthStatus.services.database = {
      status: 'healthy',
      message: 'MongoDB connection successful',
      responseTime: Date.now() - dbStart
    }
  } catch (error) {
    healthStatus.services.database = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: Date.now() - dbStart
    }
    healthStatus.status = 'degraded'
  }

  // Test Redis Connection
  const redisStart = Date.now()
  try {
    const isHealthy = await RedisService.isHealthy()
    healthStatus.services.redis = {
      status: isHealthy ? 'healthy' : 'degraded',
      message: isHealthy 
        ? 'Redis connection successful' 
        : 'Redis unavailable - using fallback mode',
      responseTime: Date.now() - redisStart
    }
    
    if (!isHealthy) {
      healthStatus.status = 'degraded'
    }
  } catch (error) {
    healthStatus.services.redis = {
      status: 'degraded',
      message: 'Redis unavailable - using database-only mode',
      responseTime: Date.now() - redisStart
    }
    healthStatus.status = 'degraded'
  }

  // Determine overall status
  const hasUnhealthyServices = Object.values(healthStatus.services)
    .some(service => service.status === 'unhealthy')

  if (hasUnhealthyServices) {
    healthStatus.status = 'unhealthy'
  }

  const statusCode = healthStatus.status === 'unhealthy' ? 503 : 200

  return NextResponse.json(healthStatus, { status: statusCode })
}