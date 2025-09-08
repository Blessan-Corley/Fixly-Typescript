'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { useToast } from '@/components/ui/toast-provider'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: ''
  })

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

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
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: errorMessage
      })
    }
  }, [error, addToast])

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
        addToast({
          type: 'error',
          title: 'Sign In Failed',
          message: result.error
        })
      } else if (result?.ok) {
        addToast({
          type: 'success',
          title: 'Sign In Successful',
          message: 'Welcome back! Redirecting...'
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
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: errorMessage
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
      addToast({
        type: 'error',
        title: 'Google Sign In Failed',
        message: 'Failed to sign in with Google'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-card p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-bold gradient-text mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome Back
            </motion.h1>
            <p className="text-text-secondary">Sign in to your Fixly account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => {
                    setFormData({ ...formData, identifier: e.target.value })
                    if (errors.identifier) setErrors({ ...errors, identifier: '' })
                  }}
                  className={`w-full pl-10 pr-4 py-3 glass rounded-xl border transition-colors ${
                    errors.identifier 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-border-subtle focus:border-primary'
                  } focus:outline-none`}
                  placeholder="Enter your email or username"
                  disabled={isLoading || googleLoading}
                />
                {errors.identifier && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.identifier}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  className={`w-full pl-10 pr-12 py-3 glass rounded-xl border transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-border-subtle focus:border-primary'
                  } focus:outline-none`}
                  placeholder="Enter your password"
                  disabled={isLoading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  disabled={isLoading || googleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border-subtle text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || googleLoading || !formData.identifier || !formData.password}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                isLoading || googleLoading || !formData.identifier || !formData.password
                  ? 'bg-surface-secondary text-text-muted cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
              }`}
              whileHover={!isLoading && !googleLoading && formData.identifier && formData.password ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isLoading && !googleLoading && formData.identifier && formData.password ? { scale: 0.98 } : {}}
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
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-muted">Or continue with</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || googleLoading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 glass rounded-xl border transition-all duration-300 ${
                isLoading || googleLoading
                  ? 'border-border-subtle cursor-not-allowed opacity-50'
                  : 'border-border-subtle hover:shadow-glass-hover'
              }`}
              whileHover={!isLoading && !googleLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading && !googleLoading ? { scale: 0.98 } : {}}
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
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary-600 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
