'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, AlertTriangle } from 'lucide-react'
import { RadialLoading } from '@/components/ui/loading'

interface User {
  id: string
  email: string
  name: string
  role: 'hirer' | 'fixer' | 'admin'
  isVerified: boolean
  permissions: string[]
  subscription?: {
    plan: string
    status: string
    expiresAt: Date
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  canAccess: (resource: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/messages',
  '/jobs',
  '/payments',
  '/bookings',
  '/reviews',
  '/analytics',
  '/admin'
]

// Define admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/analytics',
  '/admin/settings'
]

// Define role-based route access
const ROLE_ROUTES = {
  hirer: ['/jobs/post', '/jobs/manage', '/fixers/browse'],
  fixer: ['/jobs/browse', '/jobs/applied', '/earnings', '/portfolio'],
  admin: ['/admin', '/admin/users', '/admin/analytics', '/admin/reports']
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  // Convert session to our User type
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // In a real app, you'd fetch additional user data from your API
      const userData: User = {
        id: session.user.id || session.user.email || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'hirer',
        isVerified: (session.user as any).emailVerified || false,
        permissions: (session.user as any).permissions || [],
        subscription: (session.user as any).subscription
      }
      setUser(userData)
    } else {
      setUser(null)
    }
    
    setIsLoading(false)
  }, [session, status])

  // Route protection logic
  useEffect(() => {
    if (isLoading) return

    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    )

    const isAdminRoute = ADMIN_ROUTES.some(route => 
      pathname.startsWith(route)
    )

    // Check if route requires authentication
    if (isProtectedRoute && !user) {
      // Store attempted route for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname)
      router.push('/auth/signin?redirect=' + encodeURIComponent(pathname))
      return
    }

    // Check admin access
    if (isAdminRoute && user?.role !== 'admin') {
      setShowUnauthorized(true)
      return
    }

    // Check role-based access
    if (user) {
      const userRoleRoutes = ROLE_ROUTES[user.role] || []
      const hasRoleAccess = userRoleRoutes.some(route => 
        pathname.startsWith(route)
      )

      // If it's a role-specific route and user doesn't have access
      const isRoleSpecificRoute = Object.values(ROLE_ROUTES)
        .flat()
        .some(route => pathname.startsWith(route))

      if (isRoleSpecificRoute && !hasRoleAccess && user.role !== 'admin') {
        setShowUnauthorized(true)
        return
      }
    }

    setShowUnauthorized(false)
  }, [pathname, user, isLoading, router])

  // Helper functions
  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || user?.role === 'admin' || false
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role || user?.role === 'admin' || false
  }

  const canAccess = (resource: string): boolean => {
    if (!user) return false
    
    // Admin can access everything
    if (user.role === 'admin') return true
    
    // Check specific permissions
    const resourcePermissions = {
      'jobs.create': ['hirer'],
      'jobs.apply': ['fixer'],
      'payments.view': ['hirer', 'fixer'],
      'analytics.view': ['admin'],
      'users.manage': ['admin']
    }

    const allowedRoles = resourcePermissions[resource as keyof typeof resourcePermissions]
    return allowedRoles?.includes(user.role) || false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('redirectAfterLogin')
    router.push('/auth/signin')
  }

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    canAccess,
    logout
  }

  // Show loading state with radial filling animation
  if (isLoading) {
    return (
      <RadialLoading
        size={140}
        duration={2.5}
        color="rgb(99, 102, 241)"
        backgroundColor="rgba(15, 23, 42, 0.95)"
      />
    )
  }

  // Redirect to unauthorized page
  if (showUnauthorized) {
    router.push('/unauthorized')
    return null
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protecting specific components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string,
  requiredPermissions?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated, hasRole, hasPermission } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/auth/signin')
        return
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/unauthorized')
        return
      }

      if (requiredPermissions) {
        const hasAllPermissions = requiredPermissions.every(permission =>
          hasPermission(permission)
        )
        if (!hasAllPermissions) {
          router.push('/unauthorized')
          return
        }
      }
    }, [isAuthenticated, hasRole, hasPermission, router])

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Redirecting to login...</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Component-level protection hook
export function useRequireAuth(requiredRole?: string) {
  const { isAuthenticated, hasRole, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized')
      return
    }
  }, [isAuthenticated, hasRole, requiredRole, router])

  return { isAuthenticated, user }
}