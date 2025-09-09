'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ApiResponse } from '@/types'

function ResetPasswordContent() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
      setTokenValid(false)
    }
  }, [token])

  // Password strength validation
  const passwordStrength = {
    hasLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password)
  }

  const strengthCount = Object.values(passwordStrength).filter(Boolean).length
  const isPasswordValid = strengthCount >= 3 && passwordStrength.hasLength
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters with uppercase, lowercase, and a number')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid reset token')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin?message=Password reset successful')
        }, 3000)
      } else {
        setError(data.message || 'Failed to reset password')
        if (data.message?.includes('Invalid') || data.message?.includes('expired')) {
          setTokenValid(false)
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Reset password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl shadow-glass-strong text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid Reset Link</h1>
            <p className="text-text-secondary mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            
            <Link
              href="/auth/forgot-password"
              className="inline-block w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-glow-primary hover:shadow-glow-lg transition-all duration-300"
            >
              Request New Reset Link
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl shadow-glass-strong text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-2">Password Reset Successful!</h1>
            <p className="text-text-secondary mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to sign in...</span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Theme Toggle */}
        <div className="absolute top-0 right-0 -mt-2">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 rounded-3xl shadow-glass-strong"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Logo size="lg" />
            </Link>
            
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Reset Your Password
            </h1>
            <p className="text-text-secondary">
              Enter your new password below to complete the reset process
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-3 bg-input border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicators */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-muted">Password Strength</span>
                    <span className={`text-xs font-medium ${
                      strengthCount >= 4 ? 'text-green-500' : 
                      strengthCount >= 2 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {strengthCount >= 4 ? 'Strong' : strengthCount >= 2 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${
                        i < strengthCount ? (
                          strengthCount >= 4 ? 'bg-green-500' : 
                          strengthCount >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        ) : 'bg-border'
                      }`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div className={`flex items-center gap-2 ${passwordStrength.hasLength ? 'text-accent' : 'text-text-muted'}`}>
                      <Check className={`w-3 h-3 ${passwordStrength.hasLength ? 'text-accent' : 'text-text-muted'}`} />
                      6+ characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? 'text-accent' : 'text-text-muted'}`}>
                      <Check className={`w-3 h-3 ${passwordStrength.hasUppercase ? 'text-accent' : 'text-text-muted'}`} />
                      Uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasLowercase ? 'text-accent' : 'text-text-muted'}`}>
                      <Check className={`w-3 h-3 ${passwordStrength.hasLowercase ? 'text-accent' : 'text-text-muted'}`} />
                      Lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-accent' : 'text-text-muted'}`}>
                      <Check className={`w-3 h-3 ${passwordStrength.hasNumber ? 'text-accent' : 'text-text-muted'}`} />
                      Number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 bg-input border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:opacity-50 ${
                    formData.confirmPassword && passwordsMatch 
                      ? 'border-green-500 focus:ring-green-500' 
                      : formData.confirmPassword && !passwordsMatch
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-border focus:ring-primary'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${
                  passwordsMatch ? 'text-green-500' : 'text-red-500'
                }`}>
                  {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-glow-primary hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={!isLoading && isPasswordValid && passwordsMatch ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isLoading && isPasswordValid && passwordsMatch ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/signin"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}