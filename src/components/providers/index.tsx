'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from './auth-provider'
import { SecurityProvider } from './security-provider'
import { ErrorBoundaryProvider } from './error-boundary-provider'
import { RadialLoading } from '@/components/ui/loading'

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={5000}
        toastOptions={{
          style: {
            background: 'hsl(var(--surface))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--text-primary))',
          },
          className: 'glass-card',
        }}
        theme="light"
      />
    </>
  )
}

// Production-grade Loading Component with Radial Animation
function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <RadialLoading
          size={120}
          duration={2.5}
          color="rgb(99, 102, 241)"
          backgroundColor="transparent"
          className="mb-6"
        />
        <motion.h2 
          className="text-xl font-semibold text-slate-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Loading Fixly
        </motion.h2>
        <motion.p 
          className="text-slate-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Preparing your experience...
        </motion.p>
      </div>
    </div>
  )
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
          <motion.div
            className="max-w-md w-full glass-card p-8 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6">We apologize for the inconvenience. Please try refreshing the page.</p>
            <motion.button
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </motion.button>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Query Client Provider with production settings
function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry for 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Theme Provider with enhanced configuration
function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
      themes={['light', 'dark']}
      storageKey="fixly-theme"
    >
      {children}
    </ThemeProvider>
  )
}

// Performance monitoring component
function PerformanceMonitor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.duration)
          }
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
        })
      })

      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] })

      return () => observer.disconnect()
    }
  }, [])

  return <>{children}</>
}

// Main Providers Component
interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading screen while mounting
  if (!mounted) {
    return <GlobalLoading />
  }

  return (
    <ErrorBoundaryProvider
      enableRetry={true}
      maxRetries={3}
      onError={(error, errorInfo) => {
        console.error('Global error caught:', error, errorInfo)
        if (error.message.includes('security') || error.message.includes('auth')) {
          console.error('Critical security-related error detected')
        }
      }}
    >
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <SecurityProvider>
          <CustomThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <ToastProvider>
                  <PerformanceMonitor>
                    <AnimatePresence mode="wait">
                      <Suspense fallback={<GlobalLoading />}>
                        {children}
                      </Suspense>
                    </AnimatePresence>
                  </PerformanceMonitor>
                </ToastProvider>
              </AuthProvider>
            </QueryProvider>
          </CustomThemeProvider>
        </SecurityProvider>
      </SessionProvider>
    </ErrorBoundaryProvider>
  )
}

// Individual provider exports for granular use
export { ErrorBoundary, QueryProvider, CustomThemeProvider, PerformanceMonitor }

// Export new comprehensive providers and hooks
export { AuthProvider } from './auth-provider'
export { SecurityProvider } from './security-provider'
export { ErrorBoundaryProvider } from './error-boundary-provider'
export { PerformanceProvider } from './performance-provider'

export { useAuth } from './auth-provider'
export { useSecurity } from './security-provider'
export { useErrorBoundary } from './error-boundary-provider'
export { usePerformance } from './performance-provider'