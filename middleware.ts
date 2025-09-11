import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Security headers helper
function addSecurityHeaders(response: NextResponse) {
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.fixly.com wss://vercel.live; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  )

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  return response
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Skip middleware for API routes, static files, and auth pages
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/auth/') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico'
    ) {
      return addSecurityHeaders(NextResponse.next())
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
          const data = await response.json() as { isVerified: boolean }
          
          // If age is not verified, redirect to age verification page
          if (!data.isVerified) {
            const url = req.nextUrl.clone()
            url.pathname = '/auth/age-verification'
            return addSecurityHeaders(NextResponse.redirect(url))
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Middleware age verification check failed:', error)
        // Continue without redirect if check fails to avoid blocking users
      }
    }

    return addSecurityHeaders(NextResponse.next())
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