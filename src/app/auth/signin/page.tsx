'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { RadialSpinner } from '@/components/ui/loading'

interface SignInFormProps {
  callbackUrl: string
  error: string | null
}

function SignInForm({ callbackUrl, error }: SignInFormProps) {
  const router = useRouter()
  // Using sonner toast instead of custom provider
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  // Auto-remember users for 7 days (no checkbox needed)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: ''
  })

  // Handle OAuth errors
  useEffect(() => {
    if (error) {
      let errorMessage = 'Sign in failed'
      switch (error) {
        case 'OAuthAccountNotLinked':
          errorMessage = 'This account is already linked to another sign-in method'
          break
        case 'OAuthCallback':
          errorMessage = 'OAuth authentication failed'
          break
        case 'AccessDenied':
          errorMessage = 'Access was denied'
          break
        default:
          errorMessage = 'An error occurred during sign in'
      }
      toast.error('Sign In Failed', {
        description: errorMessage
      })
    }
  }, [error])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signIn('credentials', {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        setErrors({ submit: result.error })
        toast.error('Sign In Failed', {
          description: result.error
        })
      } else if (result?.ok) {
        toast.success('Sign In Successful', {
          description: 'Welcome back! Redirecting...'
        })
        
        // Get updated session
        const session = await getSession()
        if (session?.user) {
          // Redirect based on user role or callback URL
          const redirectUrl = callbackUrl.includes('/dashboard') 
            ? `/dashboard` 
            : callbackUrl
          
          setTimeout(() => {
            router.push(redirectUrl)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setErrors({ submit: errorMessage })
      toast.error('Sign In Failed', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl,
        redirect: true // Let NextAuth handle the redirect
      })
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('Google Sign In Failed', {
        description: 'Failed to sign in with Google'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="glass-strong card-xl hover-lift-subtle">
          <div className="text-center mb-8">
            <motion.h1 
              className="heading-xl text-primary mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Welcome Back
            </motion.h1>
            <p className="text-secondary text-base">Sign in to your Fixly account</p>
          </div>

          <form className="space-y-spacing-lg" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => {
                    setFormData({ ...formData, identifier: e.target.value })
                    if (errors.identifier) setErrors({ ...errors, identifier: '' })
                  }}
                  className={`input input-lg pl-10 ${
                    errors.identifier 
                      ? 'border-error focus:border-error' 
                      : ''
                  }`}
                  placeholder="Enter your email or username"
                  disabled={isLoading || googleLoading}
                />
                {errors.identifier && (
                  <div className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.identifier}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  className={`input input-lg pl-10 pr-12 ${
                    errors.password 
                      ? 'border-error focus:border-error' 
                      : ''
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-secondary transition-all duration-200 hover-lift-subtle"
                  disabled={isLoading || googleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-secondary hover:text-primary transition-all duration-200 hover-glow">
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <div className="alert alert-error">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || googleLoading || !formData.identifier || !formData.password}
              className={`btn-base btn-primary btn-lg w-full group ${
                isLoading || googleLoading || !formData.identifier || !formData.password
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover-glow'
              }`}
              whileHover={!isLoading && !googleLoading && formData.identifier && formData.password ? { scale: 1.01, y: -1 } : {}}
              whileTap={!isLoading && !googleLoading && formData.identifier && formData.password ? { scale: 0.99 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-subtle" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted">Or continue with</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || googleLoading}
              className={`btn-base btn-ghost btn-lg w-full ${
                isLoading || googleLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover-lift-subtle'
              }`}
              whileHover={!isLoading && !googleLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading && !googleLoading ? { scale: 0.99 } : {}}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </motion.button>
          </form>

          <div className="text-center mt-8">
            <p className="text-secondary">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary-600 font-medium transition-all duration-200 hover-glow">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SignInWithSearchParams() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')
  
  return <SignInForm callbackUrl={callbackUrl} error={error} />
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="glass-strong card-xl">
            <div className="text-center">
              <RadialSpinner size={80} duration={2} className="mx-auto mb-4" />
              <p className="text-secondary">Loading sign in...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignInWithSearchParams />
    </Suspense>
  )
}
