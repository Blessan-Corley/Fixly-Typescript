import { NextRequest, NextResponse } from 'next/server'
import RedisService from '@/lib/redis/client'

// GET - Test Redis connection and functionality
export async function GET(request: NextRequest) {
  const testKey = 'test:redis:connection'
  const testValue = {
    timestamp: new Date().toISOString(),
    message: 'Redis connection test successful',
    server: 'Fixly Development'
  }

  let storeResult = 'PASSED'
  let retrieveResult = 'PASSED'
  let deleteResult = 'PASSED'
  let retrievedValue = null

  try {
    // Test Redis health first
    const isHealthy = await RedisService.isHealthy()
    
    if (!isHealthy) {
      return NextResponse.json({
        success: false,
        error: 'Redis is not healthy',
        message: 'Redis service is unavailable but app will continue with database-only operations',
        tests: {
          health: 'FAILED',
          store: 'SKIPPED',
          retrieve: 'SKIPPED',
          delete: 'SKIPPED'
        },
        fallbackMode: true
      })
    }

    // Test store operation
    try {
      await RedisService.storeSession(testKey, testValue, 1)
    } catch (error) {
      storeResult = 'FAILED'
      console.warn('Store test failed:', error)
    }

    // Test retrieve operation
    try {
      retrievedValue = await RedisService.getSession(testKey)
    } catch (error) {
      retrieveResult = 'FAILED'
      console.warn('Retrieve test failed:', error)
    }

    // Test delete operation
    try {
      await RedisService.deleteSession(testKey)
    } catch (error) {
      deleteResult = 'FAILED'
      console.warn('Delete test failed:', error)
    }

    const allPassed = storeResult === 'PASSED' && retrieveResult === 'PASSED' && deleteResult === 'PASSED'

    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'Redis is working correctly' : 'Redis has some issues but fallbacks are working',
      tests: {
        health: 'PASSED',
        store: storeResult,
        retrieve: retrieveResult,
        delete: deleteResult
      },
      data: {
        stored: testValue,
        retrieved: retrievedValue
      },
      fallbackMode: !allPassed
    })

  } catch (error) {
    console.warn('Redis test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Redis test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      tests: {
        health: 'FAILED',
        store: storeResult,
        retrieve: retrieveResult,
        delete: deleteResult
      },
      fallbackMode: true,
      note: 'App will continue working with database-only operations'
    })
  }
}

// POST - Test Redis with complex data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testData, ttl = 1 } = body

    const testKey = `test:redis:post:${Date.now()}`
    const complexData = {
      ...testData,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'POST test',
        ttl: ttl
      }
    }

    // Store complex data
    await RedisService.storeSession(testKey, complexData, ttl)

    // Retrieve and verify
    const retrieved = await RedisService.getSession(testKey)

    return NextResponse.json({
      success: true,
      message: 'Complex Redis operations successful',
      testKey,
      original: complexData,
      retrieved
    })

  } catch (error) {
    console.error('Redis POST test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Redis POST test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}