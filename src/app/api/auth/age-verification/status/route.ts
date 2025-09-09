import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import RedisService from '@/lib/redis/client'

// GET - Check age verification status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // First, try to get status from Redis cache
    try {
      const cached = await RedisService.getSession(`age_verified:${session.user.id}`)
      if (cached?.verified) {
        return NextResponse.json({
          isVerified: true,
          verifiedAt: cached.verifiedAt,
          age: cached.age,
          source: 'cache'
        })
      }
    } catch (redisError) {
      console.warn('Redis cache unavailable, checking database:', redisError instanceof Error ? redisError.message : 'Unknown error')
    }

    // If not in cache, check database
    await connectToDatabase()

    const user = await User.findById(session.user.id)
      .select('dateOfBirth metadata.ageVerified metadata.ageVerifiedAt role')

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isVerified = user.metadata?.ageVerified || false
    let age: number | null = null

    if (user.dateOfBirth && isVerified) {
      const today = new Date()
      const birth = new Date(user.dateOfBirth)
      age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }

      // Cache the result for faster future access
      try {
        await RedisService.storeSession(
          `age_verified:${session.user.id}`,
          { verified: true, verifiedAt: user.metadata.ageVerifiedAt, age },
          24 * 7 // Cache for 1 week
        )
      } catch (redisError) {
        console.warn('Failed to cache verification status:', redisError instanceof Error ? redisError.message : 'Unknown error')
      }
    }

    return NextResponse.json({
      isVerified,
      verifiedAt: user.metadata?.ageVerifiedAt || null,
      age,
      userRole: user.role,
      hasDateOfBirth: !!user.dateOfBirth,
      source: 'database'
    })

  } catch (error) {
    console.error('Age verification status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}