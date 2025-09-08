import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import connectToDatabase from '@/lib/database/connection'
import User from '@/lib/database/schemas/user'
import { createTokens, verifyToken } from '@/lib/auth/jwt'
import bcrypt from 'bcryptjs'

// MongoDB client for NextAuth adapter
const client = new MongoClient(process.env.MONGODB_URI!)

export const authOptions: NextAuthOptions = {
  // Use MongoDB adapter for session storage
  adapter: MongoDBAdapter(client),
  
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile'
        }
      }
    }),
    
    // Credentials Provider for email/password login
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/username and password are required')
        }
        
        try {
          await connectToDatabase()
          
          // Find user by email or username
          const user = await User.findByEmailOrUsername(credentials.identifier)
            .select('+passwordHash +metadata')
          
          if (!user) {
            throw new Error('Invalid credentials')
          }
          
          // Check if account is locked
          if (user.isAccountLocked()) {
            throw new Error('Account is temporarily locked due to too many failed login attempts')
          }
          
          // Verify password
          const isValidPassword = await user.comparePassword(credentials.password)
          
          if (!isValidPassword) {
            // Increment login attempts
            await user.incLoginAttempts()
            throw new Error('Invalid credentials')
          }
          
          // Reset login attempts on successful login
          await user.resetLoginAttempts()
          
          // Return user object for NextAuth
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            username: user.username,
            role: user.role,
            emailVerified: user.metadata.emailVerified,
            isActive: user.isActive
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw error
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  callbacks: {
    // Customize JWT token
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.userId = user.id
        token.role = (user as any).role
        token.username = (user as any).username
        token.emailVerified = (user as any).emailVerified
        token.isActive = (user as any).isActive
        
        // Add account type
        if (account) {
          token.accountType = account.provider
        }
      }
      
      // Update session
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }
      
      return token
    },
    
    // Customize session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.username = token.username as string
        session.user.emailVerified = token.emailVerified as boolean
        session.user.isActive = token.isActive as boolean
        session.accountType = token.accountType as string
      }
      
      return session
    },
    
    // Handle sign in
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await connectToDatabase()
        
        // Handle Google OAuth sign in
        if (account?.provider === 'google' && profile) {
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user from Google profile
            const googleProfile = profile as any
            
            // Get role from cookie (set during signup flow)
            const roleFromCookie = credentials?.role || 'hirer' // Default fallback
            
            // Generate username from email
            let baseUsername = user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
            let username = baseUsername
            
            // Ensure username is unique
            let counter = 1
            while (await User.findOne({ username })) {
              username = `${baseUsername}${counter}`
              counter++
            }
            
            const newUser = new User({
              email: user.email,
              username,
              name: user.name,
              avatar: user.image,
              role: roleFromCookie,
              passwordHash: 'google-oauth', // Placeholder for OAuth users
              location: {
                type: 'manual',
                address: '',
                coordinates: { lat: 0, lng: 0 },
                city: 'Unknown',
                state: 'Unknown',
                stateCode: 'XX'
              },
              metadata: {
                emailVerified: googleProfile.verified_email || false,
                source: 'google',
                profileCompleted: false // New users need to complete profile
              }
            })
            
            await newUser.save()
            user.id = newUser._id.toString()
            user.role = newUser.role
            user.username = newUser.username
            user.emailVerified = googleProfile.verified_email || false
            user.isActive = true
          } else {
            // Update existing user
            existingUser.name = user.name || existingUser.name
            existingUser.avatar = user.image || existingUser.avatar
            existingUser.metadata.lastLoginAt = new Date()
            await existingUser.save()
            
            user.id = existingUser._id.toString()
            user.role = existingUser.role
            user.username = existingUser.username
            user.emailVerified = existingUser.metadata?.emailVerified || false
            user.isActive = existingUser.isActive
          }
        }
        
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    
    // Handle redirects
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      return baseUrl
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/complete-profile' // Redirect new users to complete profile
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`)
      
      // Track sign in event
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`)
      }
    },
    
    async signOut({ token, session }) {
      console.log(`User signed out: ${token?.email || session?.user?.email}`)
    }
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  secret: process.env.NEXTAUTH_SECRET,
}

// Export auth for server-side usage  
export async function getServerSession() {
  const { getServerSession: getSession } = await import('next-auth')
  return getSession(authOptions)
}

// Middleware helper for API routes
export async function requireAuth(req: any) {
  const session = await getServerSession()
  
  if (!session || !session.user) {
    throw new Error('Authentication required')
  }
  
  return session
}

// Role-based authorization
export async function requireRole(req: any, allowedRoles: string[]) {
  const session = await requireAuth(req)
  
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      username: string
      emailVerified: boolean
      isActive: boolean
    }
    accountType: string
  }
  
  interface User {
    role: string
    username: string
    emailVerified: boolean
    isActive: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: string
    username: string
    emailVerified: boolean
    isActive: boolean
    accountType: string
  }
}