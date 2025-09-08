'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, Shield } from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'
import { BirthdayPicker } from '@/components/ui/birthday-picker'

export default function AgeVerificationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidAge, setIsValidAge] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Check if user already verified age
  useEffect(() => {
    const checkAgeVerification = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/auth/age-verification/status')
          const data = await response.json()
          
          if (data.isVerified) {
            // Already verified, redirect to dashboard
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error checking age verification:', error)
        }
      }
    }

    if (status === 'authenticated') {
      checkAgeVerification()
    }
  }, [session, status, router])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    
    // Validate age based on user role
    const today = new Date()
    const age = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    const minAge = session?.user?.role === 'fixer' ? 18 : 16
    
    setIsValidAge(age >= minAge)
  }

  const handleSubmit = async () => {
    if (!selectedDate || !isValidAge) {
      addToast({
        type: 'error',
        title: 'Invalid Date',
        message: 'Please select a valid birth date'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/age-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateOfBirth: selectedDate.toISOString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Age verification failed')
      }

      addToast({
        type: 'success',
        title: 'Age Verified Successfully!',
        message: 'Welcome to Fixly! Redirecting to your dashboard...'
      })

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Age verification error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify age'
      
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Background blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/10" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Card */}
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-border-subtle/50 relative">
            {/* Security badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Secure Verification</span>
              </div>
            </div>

            {/* Header */}
            <motion.div
              className="text-center mb-8 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold gradient-text mb-2">
                One Last Step, {session.user.name?.split(' ')[0]}!
              </h1>
              <p className="text-text-secondary">
                We need to verify your age to ensure platform safety and comply with regulations.
              </p>
            </motion.div>

            {/* Birthday Picker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <BirthdayPicker
                onDateSelect={handleDateSelect}
                role={session.user.role as 'hirer' | 'fixer'}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                onClick={handleSubmit}
                disabled={!isValidAge || isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                  isValidAge && !isSubmitting
                    ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
                    : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                }`}
                whileHover={isValidAge && !isSubmitting ? { scale: 1.02, y: -2 } : {}}
                whileTap={isValidAge && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Age...
                  </>
                ) : (
                  <>
                    Complete Verification
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
                <strong>🔒 Your privacy matters:</strong> Your birth date is encrypted and stored securely. 
                We only use this information for age verification and will never share it publicly.
              </p>
            </motion.div>
          </div>

          {/* Help Text */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <p className="text-text-muted text-sm">
              This is a one-time verification required by law. 
              <br />
              Your information is protected by our privacy policy.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}