import { NextRequest, NextResponse } from 'next/server'
import RedisService from '@/lib/redis/client'

// DELETE - Clean up corrupted Redis data
export async function DELETE(request: NextRequest) {
  try {
    const client = await RedisService.getClient()
    
    // Get all keys that might contain corrupted data
    const keysToCheck = [
      'test:*',
      'session:*',
      'otp:*',
      'signup:*',
      'verified:*',
      'rate_limit:*'
    ]
    
    let cleanedKeys = 0
    const corruptedKeysFound: string[] = []
    
    for (const keyPattern of keysToCheck) {
      try {
        // For Upstash REST API, we can't use KEYS command, so we'll clean known test keys
        if (keyPattern.startsWith('test:')) {
          const testKeys = [
            'test:redis:connection',
            'test:redis:post:*'
          ]
          
          for (const testKey of testKeys) {
            try {
              const deleted = await client.del(testKey)
              if (deleted > 0) {
                cleanedKeys++
                console.log(`Cleaned test key: ${testKey}`)
              }
            } catch (error) {
              // Key might not exist, continue
            }
          }
        }
      } catch (error) {
        console.warn(`Error cleaning pattern ${keyPattern}:`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Redis cleanup completed. Cleaned ${cleanedKeys} keys.`,
      cleanedKeys,
      corruptedKeysFound,
      note: 'This only cleans test keys. Session keys will be cleaned automatically on expiry.'
    })

  } catch (error) {
    console.error('Redis cleanup error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Redis cleanup failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Check for corrupted data
export async function GET(request: NextRequest) {
  try {
    const client = await RedisService.getClient()
    
    // Test if Redis is working properly with a simple test
    const testKey = 'cleanup:test'
    const testData = { test: 'data', timestamp: new Date().toISOString() }
    
    // Store and retrieve test data
    await RedisService.storeSession(testKey, testData, 1)
    const retrieved = await RedisService.getSession(testKey)
    await client.del(testKey)
    
    const isWorking = retrieved && retrieved.test === testData.test
    
    return NextResponse.json({
      redis_status: isWorking ? 'healthy' : 'corrupted',
      test_data_stored: testData,
      test_data_retrieved: retrieved,
      working_properly: isWorking,
      message: isWorking 
        ? 'Redis is working properly - no cleanup needed'
        : 'Redis has data corruption issues - run DELETE to cleanup'
    })

  } catch (error) {
    console.error('Redis check error:', error)
    
    return NextResponse.json({
      redis_status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check Redis status'
    }, { status: 500 })
  }
}