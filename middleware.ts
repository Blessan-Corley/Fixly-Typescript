import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = req.nextauth?.token
    const { pathname } = req.nextUrl

    // Skip middleware for API routes, static files, and auth pages
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/auth/') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
    ) {
      return NextResponse.next()
    }

    // If user is authenticated and accessing dashboard-related pages
    if (token && (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/jobs') ||
      pathname.startsWith('/messages') ||
      pathname.startsWith('/settings')
    )) {
      try {
        // Check if user has completed age verification
        const baseUrl = req.nextUrl.origin
        const response = await fetch(`${baseUrl}/api/auth/age-verification/status`, {
          headers: {
            cookie: req.headers.get('cookie') || ''
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          // If age is not verified, redirect to age verification page
          if (!data.isVerified) {
            const url = req.nextUrl.clone()
            url.pathname = '/auth/age-verification'
            return NextResponse.redirect(url)
          }
        }
      } catch (error) {
        console.error('Middleware age verification check failed:', error)
        // Continue without redirect if check fails to avoid blocking users
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public pages
        if (
          pathname === '/' ||
          pathname.startsWith('/auth/') ||
          pathname.startsWith('/api/') ||
          pathname.startsWith('/_next/') ||
          pathname.includes('.')
        ) {
          return true
        }

        // Require authentication for protected pages
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)'
  ]
}