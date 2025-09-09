import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, refreshAccessToken, blacklistToken } from '@/lib/auth/jwt'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import { createAuthMiddleware } from '@/lib/auth/middleware'
import jwt from 'jsonwebtoken'

// Apply rate limiting
const middleware = createAuthMiddleware({
  requireAuth: false,
  rateLimitConfig: {
    maxRequests: 20, // 20 refresh attempts per 15 minutes
    windowMs: 15 * 60 * 1000,
    message: 'Too many token refresh attempts'
  }
})

export async function POST(request: NextRequest) {
  // Apply middleware
  const middlewareResponse = await middleware(request)
  if (middlewareResponse && middlewareResponse.status !== 200) {
    return middlewareResponse
  }

  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    if (payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Get user from database
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      )
    }

    // Verify the refresh token matches the stored one
    if ((user.metadata as any)?.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Generate new access token
    const { accessToken, expiresIn } = refreshAccessToken(payload, {
      userId: (user._id as any).toString(),
      email: user.email,
      username: user.username,
      role: user.role
    })

    // Update last login time
    user.metadata.lastLoginAt = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      accessToken,
      expiresIn,
      tokenType: 'Bearer',
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.metadata?.emailVerified || false
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid refresh token format' },
        { status: 401 }
      )
    }
    
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Refresh token has expired' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Logout endpoint - blacklist both access and refresh tokens
export async function DELETE(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json()

    const promises = []

    // Blacklist access token if provided
    if (accessToken) {
      try {
        const decoded = jwt.decode(accessToken) as any
        if (decoded?.jti) {
          promises.push(blacklistToken(decoded.jti, decoded.exp - Math.floor(Date.now() / 1000)))
        }
      } catch (error) {
        console.warn('Error blacklisting access token:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    // Blacklist refresh token if provided
    if (refreshToken) {
      try {
        const decoded = jwt.decode(refreshToken) as any
        if (decoded?.jti) {
          promises.push(blacklistToken(decoded.jti, decoded.exp - Math.floor(Date.now() / 1000)))
        }

        // Remove refresh token from user record
        if (decoded?.userId) {
          await connectToDatabase()
          await User.findByIdAndUpdate(decoded.userId, {
            'metadata.refreshToken': null,
            'metadata.lastLogoutAt': new Date()
          })
        }
      } catch (error) {
        console.warn('Error processing refresh token:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    await Promise.all(promises)

    return NextResponse.json({
      success: true,
      message: 'Successfully logged out'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}