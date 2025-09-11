'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { UserCheck, Wrench, Mail, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff, User, Phone, MapPin, Shield, Search, Chrome, Home, Loader2, AlertCircle, Info } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Modal, ConfirmModal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { GoogleMapsLocationPicker } from '@/components/ui/google-maps'
import { SKILLS, SKILL_CATEGORIES, searchSkills, getSkillsByCategory } from '@/data/skills'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useValidation } from '@/hooks/useValidation'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Using sonner toast instead of custom provider
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth()
  const { validateUsername, validatePhone, validateEmail, isValidating } = useValidation()
  
  // Check if user came from Google OAuth redirect
  const googleProvider = searchParams.get('provider')
  const googleEmail = searchParams.get('email')
  const googleName = searchParams.get('name')
  const googleImage = searchParams.get('image')
  
  // Load saved progress from localStorage
  const loadSavedProgress = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fixly_signup_progress')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.warn('Failed to parse saved signup progress')
        }
      }
    }
    return null
  }

  const savedProgress = loadSavedProgress()
  
  const [currentStep, setCurrentStep] = useState(savedProgress?.currentStep || 1)
  const [selectedRole, setSelectedRole] = useState<'hirer' | 'fixer' | null>(savedProgress?.selectedRole || null)
  const [loginMethod, setLoginMethod] = useState<'google' | 'email' | null>(savedProgress?.loginMethod || null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(0)
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(savedProgress?.termsAccepted || false)
  const [privacyAccepted, setPrivacyAccepted] = useState(savedProgress?.privacyAccepted || false)
  const [returnUrl, setReturnUrl] = useState('')
  const [skillsSearch, setSkillsSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Validation state
  const [validationResults, setValidationResults] = useState<{
    username: { available: boolean; message: string } | null
    phone: { available: boolean; message: string } | null
    email: { available: boolean; message: string } | null
  }>({
    username: null,
    phone: null,
    email: null
  })
  
  const [formData, setFormData] = useState({
    email: savedProgress?.formData?.email || googleEmail || '',
    password: '',
    confirmPassword: '',
    firstName: savedProgress?.formData?.firstName || (googleName?.split(' ')[0]) || '',
    lastName: savedProgress?.formData?.lastName || (googleName?.split(' ').slice(1).join(' ')) || '',
    username: savedProgress?.formData?.username || '',
    phone: savedProgress?.formData?.phone || '',
    address: savedProgress?.formData?.address || '',
    coordinates: savedProgress?.formData?.coordinates || { lat: 0, lng: 0 },
    city: savedProgress?.formData?.city || '',
    state: savedProgress?.formData?.state || '',
    stateCode: savedProgress?.formData?.stateCode || '',
    pincode: savedProgress?.formData?.pincode || '',
    skills: savedProgress?.formData?.skills || [] as string[],
    otp: ['', '', '', '', '', ''],
    avatar: savedProgress?.formData?.avatar || googleImage || ''
  })

  // Save progress to localStorage
  const saveProgress = () => {
    if (typeof window !== 'undefined') {
      const progressData = {
        currentStep,
        selectedRole,
        loginMethod,
        termsAccepted,
        privacyAccepted,
        formData: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          phone: formData.phone,
          address: formData.address,
          coordinates: formData.coordinates,
          city: formData.city,
          state: formData.state,
          stateCode: formData.stateCode,
          pincode: formData.pincode,
          skills: formData.skills
        }
      }
      localStorage.setItem('fixly_signup_progress', JSON.stringify(progressData))
    }
  }

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Choose Role", desc: "Hirer or Fixer?" },
      { id: 2, title: "Login Method", desc: "Google or Email?" },
      { id: 3, title: "Email Verify", desc: "Verify your email" },
      { id: 4, title: "Details", desc: "Personal info" },
      { id: 5, title: "Location", desc: "Your address" },
    ]
    
    if (selectedRole === 'fixer') {
      baseSteps.push({ id: 6, title: "Skills", desc: "Your expertise" })
      baseSteps.push({ id: 7, title: "Complete", desc: "All done!" })
    } else {
      baseSteps.push({ id: 6, title: "Complete", desc: "All done!" })
    }
    
    return baseSteps
  }

  const steps = getSteps()

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Save progress when important state changes
  useEffect(() => {
    if (currentStep > 1 || selectedRole || loginMethod) {
      saveProgress()
    }
  }, [currentStep, selectedRole, loginMethod, formData, termsAccepted, privacyAccepted])

  // Handle Google sign-in redirect for new users
  useEffect(() => {
    if (googleProvider === 'google' && googleEmail) {
      toast.success('Google Profile Loaded', {
        description: 'Your Google profile has been pre-filled. Please complete the remaining fields.',
        duration: 4000
      })
      
      // Pre-select email login method since Google profile is auto-filled
      setLoginMethod('email')
      
      // Skip to email verification since Google email is already verified
      // But still require them to complete all other fields
    }
  }, [googleProvider, googleEmail])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...formData.otp]
    newOtp[index] = value
    setFormData({ ...formData, otp: newOtp })

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length))
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1))

  // Clear progress when signup is completed
  const clearProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fixly_signup_progress')
    }
  }

  // Validation functions
  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters"
    if (/^[0-9]+$/.test(password)) return "Password cannot be only numbers"
    if (/^[a-z]+$/.test(password)) return "Password must contain mixed characters"
    if (password === "12345678" || password === "password" || password === "123456789") return "Password too common"
    return ""
  }

  // Note: validatePhone and validateUsername are provided by useValidation hook

  const getFilteredSkills = () => {
    let filteredSkills = SKILLS
    
    if (selectedCategory !== 'all') {
      filteredSkills = SKILLS.filter(skill => skill.category === selectedCategory)
    }
    
    if (skillsSearch.trim()) {
      filteredSkills = SKILLS.filter(skill => 
        skill.name.toLowerCase().includes(skillsSearch.toLowerCase()) &&
        (selectedCategory === 'all' || skill.category === selectedCategory)
      )
    }
    
    return filteredSkills
  }

  const toggleSkill = (skillId: string) => {
    const newSkills = formData.skills.includes(skillId)
      ? formData.skills.filter(s => s !== skillId)
      : [...formData.skills, skillId]
    setFormData({ ...formData, skills: newSkills })
  }

  // Real-time validation handlers with debouncing
  const handleUsernameValidation = useCallback(async (username: string) => {
    if (!username) {
      setValidationResults(prev => ({ ...prev, username: null }))
      return
    }

    const result = await validateUsername(username)
    setValidationResults(prev => ({ ...prev, username: result }))
  }, [validateUsername])

  const handlePhoneValidation = useCallback(async (phone: string) => {
    if (!phone) {
      setValidationResults(prev => ({ ...prev, phone: null }))
      return
    }

    const result = await validatePhone(phone)
    setValidationResults(prev => ({ ...prev, phone: result }))
  }, [validatePhone])

  const handleEmailValidation = useCallback(async (email: string) => {
    if (!email) {
      setValidationResults(prev => ({ ...prev, email: null }))
      return
    }

    const result = await validateEmail(email)
    setValidationResults(prev => ({ ...prev, email: result }))
    
    // Show redirect suggestion if user already exists
    if (result.shouldRedirectToLogin) {
      toast.error('Account Already Exists', {
        description: result.message + ' Would you like to go to the login page?',
        duration: 8000,
        action: {
          label: 'Go to Login',
          onClick: () => router.push('/auth/signin')
        }
      })
    }
  }, [validateEmail, router])

  // Debounced validation effects
  useEffect(() => {
    if (!formData.username) return
    
    const timeoutId = setTimeout(() => {
      handleUsernameValidation(formData.username)
    }, 800) // 800ms delay
    
    return () => clearTimeout(timeoutId)
  }, [formData.username, handleUsernameValidation])

  useEffect(() => {
    if (!formData.phone) return
    
    const timeoutId = setTimeout(() => {
      handlePhoneValidation(formData.phone)
    }, 800) // 800ms delay
    
    return () => clearTimeout(timeoutId)
  }, [formData.phone, handlePhoneValidation])

  useEffect(() => {
    if (!formData.email || googleProvider === 'google') return // Skip validation for Google pre-filled emails
    
    const timeoutId = setTimeout(() => {
      handleEmailValidation(formData.email)
    }, 800) // 800ms delay
    
    return () => clearTimeout(timeoutId)
  }, [formData.email, handleEmailValidation, googleProvider])

  const handleBackToHome = () => {
    setShowAbandonModal(true)
  }

  const confirmAbandonSignup = () => {
    router.push('/')
  }

  const handleTermsClick = () => {
    const currentUrl = encodeURIComponent(window.location.href)
    router.push(`/terms-of-service?returnUrl=${currentUrl}`)
  }

  const handlePrivacyClick = () => {
    const currentUrl = encodeURIComponent(window.location.href)
    router.push(`/privacy-policy?returnUrl=${currentUrl}`)
  }

  const sendOTP = async () => {
    if (!formData.email) {
      toast.error('Email Required', {
        description: 'Please enter your email address first'
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'signup'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setCountdown(60)
      toast.success('Verification code sent', {
        description: `We've sent a 6-digit code to ${formData.email}`
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send code'
      toast.error('Failed to send code', {
        description: errorMessage
      })
      setErrors({ email: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!selectedRole) {
      toast.error('Role Required', {
        description: 'Please select a role first'
      })
      return
    }
    
    try {
      await signInWithGoogle({
        role: selectedRole,
        callbackUrl: '/dashboard',
        onSuccess: (data) => {
          toast.success('Google Sign-In Successful', {
            description: 'Redirecting to complete your profile...'
          })
        },
        onError: (error) => {
          toast.error('Google Sign-In Failed', {
            description: error
          })
        }
      })
    } catch (error) {
      console.error('Google signup error:', error)
    }
  }

  const verifyOTP = async () => {
    const otpCode = formData.otp.join('')
    
    if (otpCode.length !== 6) {
      toast.error('Invalid Code', {
        description: 'Please enter the complete 6-digit code'
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpCode,
          type: 'signup'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      toast.success('Email verified successfully', {
        description: 'You can now proceed to complete your profile'
      })
      
      nextStep()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code'
      toast.error('Verification Failed', {
        description: errorMessage
      })
      setErrors({ otp: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const completeSignup = async () => {
    if (!termsAccepted || !privacyAccepted) {
      toast.error('Terms Required', {
        description: 'Please accept the terms of service and privacy policy'
      })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        role: selectedRole,
        location: {
          address: formData.address,
          coordinates: formData.coordinates,
          city: formData.city,
          state: formData.state,
          stateCode: formData.stateCode,
          pincode: formData.pincode
        },
        skills: selectedRole === 'fixer' ? formData.skills : [],
        termsAccepted,
        privacyAccepted
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      toast.success('Account created successfully!', {
        description: 'Welcome to Fixly! Redirecting to dashboard...'
      })

      // Store access token if provided
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      toast.error('Signup Failed', {
        description: errorMessage
      })
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-strong card-xl hover-lift-subtle" data-testid="signup-form">
          {/* Back to Home Button */}
          <div className="mb-6">
            <motion.button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-all duration-200 group hover-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">← Back to Home</span>
            </motion.button>
          </div>

          {/* Progress Bar - Responsive for 7 steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4 px-2">
              <div className="flex items-center gap-1 sm:gap-2 max-w-full">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                        currentStep >= step.id 
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow-primary' 
                          : 'bg-surface-secondary text-text-muted'
                      }`}
                      animate={{
                        scale: currentStep === step.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep > step.id ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : step.id}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`w-4 sm:w-6 h-1 mx-0.5 sm:mx-1 transition-colors duration-300 ${
                        currentStep > step.id ? 'bg-gradient-to-r from-primary to-accent' : 'bg-border-subtle'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h2 className="heading-lg text-primary">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-secondary">{steps[currentStep - 1].desc}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Google User Notice */}
                {googleProvider === 'google' && googleEmail && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-success border-l-4 border-l-green-500 mb-6"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-primary">Google Profile Pre-filled!</h3>
                        <p className="text-sm text-secondary mt-1">
                          We've auto-filled your email and name from Google. Please select your role and complete the remaining required fields.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-6">
                  <h1 className="heading-xl text-primary mb-2">Join Fixly Today</h1>
                  <p className="text-secondary">Choose how you'd like to use our platform</p>
                </div>

                <motion.div
                  className={`card-glass p-6 cursor-pointer transition-all duration-300 hover-lift-subtle ${
                    selectedRole === 'hirer' 
                      ? 'border-primary bg-primary/5 shadow-glow-primary' 
                      : 'border-subtle hover-glow'
                  }`}
                  onClick={() => setSelectedRole('hirer')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedRole === 'hirer' ? 'bg-primary text-white' : 'bg-surface-elevated text-secondary'
                    }`}>
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">I need help with tasks</h3>
                      <p className="text-sm text-secondary">Find skilled professionals for your projects</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={`card-glass p-6 cursor-pointer transition-all duration-300 hover-lift-subtle ${
                    selectedRole === 'fixer' 
                      ? 'border-primary bg-primary/5 shadow-glow-primary' 
                      : 'border-subtle hover-glow'
                  }`}
                  onClick={() => setSelectedRole('fixer')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedRole === 'fixer' ? 'bg-primary text-white' : 'bg-surface-elevated text-secondary'
                    }`}>
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">I want to offer my skills</h3>
                      <p className="text-sm text-secondary">Earn money helping others with your expertise</p>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  onClick={nextStep}
                  disabled={!selectedRole}
                  className={`btn-base btn-primary btn-lg w-full group ${
                    selectedRole
                      ? 'hover-glow'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={selectedRole ? { scale: 1.01, y: -1 } : {}}
                  whileTap={selectedRole ? { scale: 0.99 } : {}}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Login Method */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="heading-lg text-primary mb-2">Choose Sign Up Method</h2>
                  <p className="text-secondary">How would you like to create your account?</p>
                </div>

                <motion.div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    loginMethod === 'google' 
                      ? 'border-primary bg-primary/10 shadow-glow-primary' 
                      : 'border-border-subtle glass hover:shadow-glass-hover'
                  } ${googleLoading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => setLoginMethod('google')}
                  whileHover={!googleLoading ? { y: -2 } : {}}
                  whileTap={!googleLoading ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      loginMethod === 'google' ? 'bg-primary text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {googleLoading && loginMethod === 'google' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Chrome className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">Continue with Google</h3>
                      <p className="text-sm text-secondary">
                        {googleLoading && loginMethod === 'google' 
                          ? 'Connecting to Google...' 
                          : 'Quick start - auto-fills your profile, you complete the rest'
                        }
                      </p>
                    </div>
                    {loginMethod === 'google' && (
                      <motion.div
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, type: 'spring' }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    loginMethod === 'email' 
                      ? 'border-primary bg-primary/10 shadow-glow-primary' 
                      : 'border-border-subtle glass hover:shadow-glass-hover'
                  }`}
                  onClick={() => setLoginMethod('email')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      loginMethod === 'email' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">Sign up with Email</h3>
                      <p className="text-sm text-text-secondary">Create account with email and password verification</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={googleLoading}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={loginMethod === 'google' ? handleGoogleSignup : nextStep}
                    disabled={!loginMethod || googleLoading}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      loginMethod && !googleLoading
                        ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                    whileHover={loginMethod && !googleLoading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={loginMethod && !googleLoading ? { scale: 0.98 } : {}}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {loginMethod === 'google' ? 'Connecting to Google...' : 'Loading...'}
                      </>
                    ) : (
                      <>
                        {loginMethod === 'google' ? 'Continue with Google' : 'Continue'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Email Verification */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Email Verification</h2>
                  <p className="text-text-secondary">
                    We've sent a 6-digit code to<br />
                    <strong>{formData.email || 'your email address'}</strong>
                  </p>
                </div>

                {!formData.email && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value })
                          // Clear validation result when user types
                          if (validationResults.email) {
                            setValidationResults(prev => ({ ...prev, email: null }))
                          }
                        }}
                        className={`w-full pl-10 pr-12 py-3 glass rounded-xl border transition-all duration-300 ${
                          validationResults.email 
                            ? validationResults.email.available 
                              ? 'border-success shadow-glow-success' 
                              : 'border-error shadow-glow-error'
                            : 'border-subtle focus:border-primary focus:shadow-glow-primary'
                        } focus:outline-none`}
                        placeholder="Enter your email"
                        autoFocus
                      />
                      {/* Real-time validation indicator with animation */}
                      <motion.div 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {isValidating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted" />
                        ) : validationResults.email ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            {validationResults.email.available ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-error" />
                            )}
                          </motion.div>
                        ) : null}
                      </motion.div>
                    </div>
                    <AnimatePresence mode="wait">
                      {validationResults.email && !validationResults.email.available ? (
                        <motion.p 
                          key="error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-error text-sm mt-1 flex items-center gap-2"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {validationResults.email.message}
                        </motion.p>
                      ) : validationResults.email && validationResults.email.available ? (
                        <motion.p 
                          key="success"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-success text-sm mt-1 flex items-center gap-2"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {validationResults.email.message}
                        </motion.p>
                      ) : errors.email ? (
                        <motion.p 
                          key="server-error"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-error text-sm mt-1 flex items-center gap-2"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </motion.p>
                      ) : (
                        <motion.p 
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-muted mt-1"
                        >
                          Enter a valid email address
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-4 text-center">Enter verification code</label>
                  <div className="flex gap-3 justify-center">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-text-muted mb-4">Didn't receive the code?</p>
                  <button 
                    disabled={countdown > 0}
                    className={`font-medium text-sm transition-colors ${
                      countdown > 0 
                        ? 'text-muted cursor-not-allowed' 
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    disabled={formData.otp.join('').length !== 6}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      formData.otp.join('').length === 6
                        ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                    whileHover={formData.otp.join('').length === 6 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={formData.otp.join('').length === 6 ? { scale: 0.98 } : {}}
                  >
                    Verify Code
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-border-subtle bg-surface-secondary text-text-muted cursor-not-allowed"
                      placeholder="your-email@example.com"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">Email verified ✓</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => {
                        const username = e.target.value.toLowerCase()
                        setFormData({ ...formData, username })
                        // Clear validation result when user types
                        if (validationResults.username) {
                          setValidationResults(prev => ({ ...prev, username: null }))
                        }
                      }}
                      className={`w-full pl-10 pr-12 py-3 glass rounded-xl border transition-all duration-300 ${
                        validationResults.username 
                          ? validationResults.username.available 
                            ? 'border-success shadow-glow-success' 
                            : 'border-error shadow-glow-error'
                          : 'border-subtle focus:border-primary focus:shadow-glow-primary'
                      } focus:outline-none`}
                      placeholder="johndoe_123"
                    />
                    {/* Real-time validation indicator with animation */}
                    <motion.div 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted" />
                      ) : validationResults.username ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          {validationResults.username.available ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-error" />
                          )}
                        </motion.div>
                      ) : null}
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    {validationResults.username && !validationResults.username.available ? (
                      <motion.p 
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-error text-sm mt-1 flex items-center gap-2"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {validationResults.username.message}
                      </motion.p>
                    ) : validationResults.username && validationResults.username.available ? (
                      <motion.p 
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-success text-sm mt-1 flex items-center gap-2"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {validationResults.username.message}
                      </motion.p>
                    ) : (
                      <motion.p 
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted mt-1"
                      >
                        Lowercase letters, numbers, and underscores only
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const phone = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setFormData({ ...formData, phone })
                        // Clear validation result when user types
                        if (validationResults.phone) {
                          setValidationResults(prev => ({ ...prev, phone: null }))
                        }
                      }}
                      className={`w-full pl-10 pr-12 py-3 glass rounded-xl border transition-all duration-300 ${
                        validationResults.phone 
                          ? validationResults.phone.available 
                            ? 'border-success shadow-glow-success' 
                            : 'border-error shadow-glow-error'
                          : 'border-subtle focus:border-primary focus:shadow-glow-primary'
                      } focus:outline-none`}
                      placeholder="9876543210"
                    />
                    {/* Real-time validation indicator with animation */}
                    <motion.div 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted" />
                      ) : validationResults.phone ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          {validationResults.phone.available ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-error" />
                          )}
                        </motion.div>
                      ) : null}
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    {validationResults.phone && !validationResults.phone.available ? (
                      <motion.p 
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-error text-sm mt-1 flex items-center gap-2"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {validationResults.phone.message}
                      </motion.p>
                    ) : validationResults.phone && validationResults.phone.available ? (
                      <motion.p 
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-success text-sm mt-1 flex items-center gap-2"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {validationResults.phone.message}
                      </motion.p>
                    ) : (
                      <motion.p 
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted mt-1"
                      >
                        10 digits starting with 6, 7, 8, or 9
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        setErrors({ ...errors, password: validatePassword(e.target.value) })
                      }}
                      className={`w-full pl-4 pr-12 py-3 glass rounded-xl border transition-colors ${
                        errors.password ? 'border-error' : 'border-border-subtle focus:border-primary'
                      } focus:outline-none`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value })
                        if (e.target.value !== formData.password) {
                          setErrors({ ...errors, confirmPassword: "Passwords do not match" })
                        } else {
                          const { confirmPassword, ...restErrors } = errors
                          setErrors(restErrors)
                        }
                      }}
                      className={`w-full pl-4 pr-12 py-3 glass rounded-xl border transition-colors ${
                        errors.confirmPassword ? 'border-error' : 'border-border-subtle focus:border-primary'
                      } focus:outline-none`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms and Privacy Policy */}
                <div className="space-y-4 p-4 bg-surface-elevated/50 rounded-xl border border-border-subtle">
                  <div className="text-sm text-text-secondary font-medium mb-3">
                    To continue, please agree to our terms:
                  </div>
                  
                  <div className="space-y-3">
                    <motion.label 
                      className="flex items-start gap-3 cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                            termsAccepted 
                              ? 'bg-primary border-primary shadow-glow-primary' 
                              : 'border-border-subtle group-hover:border-primary'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {termsAccepted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      <div className="text-sm text-text-secondary">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={handleTermsClick}
                          className="text-primary hover:text-primary-600 font-medium underline"
                        >
                          Terms of Service
                        </button>
                      </div>
                    </motion.label>

                    <motion.label 
                      className="flex items-start gap-3 cursor-pointer group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                            privacyAccepted 
                              ? 'bg-primary border-primary shadow-glow-primary' 
                              : 'border-border-subtle group-hover:border-primary'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {privacyAccepted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      <div className="text-sm text-text-secondary">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={handlePrivacyClick}
                          className="text-primary hover:text-primary-600 font-medium underline"
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </motion.label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    disabled={Object.keys(errors).length > 0 || !formData.firstName || !formData.lastName || !formData.username || !formData.phone || !formData.password || !formData.confirmPassword || !termsAccepted || !privacyAccepted}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      Object.keys(errors).length === 0 && formData.firstName && formData.lastName && formData.username && formData.phone && formData.password && formData.confirmPassword && termsAccepted && privacyAccepted
                        ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                    whileHover={Object.keys(errors).length === 0 && termsAccepted && privacyAccepted ? { scale: 1.02, y: -2 } : {}}
                    whileTap={Object.keys(errors).length === 0 && termsAccepted && privacyAccepted ? { scale: 0.98 } : {}}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Location */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Your Location</h2>
                  <p className="text-text-secondary">Help {selectedRole === 'hirer' ? 'fixers find you' : 'clients find you nearby'}</p>
                </div>

                <GoogleMapsLocationPicker
                  onLocationSelect={(location) => {
                    setFormData({
                      ...formData,
                      address: location.address,
                      coordinates: location.coordinates,
                      city: location.components?.city || '',
                      state: location.components?.state || '',
                      stateCode: location.components?.state ? 
                        location.components.state.substring(0, 2).toUpperCase() : '',
                      pincode: location.components?.postalCode || ''
                    })
                  }}
                  initialLocation={formData.address ? {
                    address: formData.address,
                    coordinates: formData.coordinates
                  } : undefined}
                  placeholder="Enter your address to get started"
                />

                <div className="flex gap-3">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    disabled={!formData.address}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      formData.address
                        ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary'
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                    whileHover={formData.address ? { scale: 1.02, y: -2 } : {}}
                    whileTap={formData.address ? { scale: 0.98 } : {}}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Skills (Only for Fixers) */}
            {currentStep === 6 && selectedRole === 'fixer' && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Your Skills & Services</h2>
                  <p className="text-text-secondary">Select the services you can provide (choose at least 3)</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={skillsSearch}
                    onChange={(e) => setSkillsSearch(e.target.value)}
                    placeholder="Search skills and services..."
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-surface-elevated text-text-secondary hover:bg-primary/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All Categories
                  </motion.button>
                  {SKILL_CATEGORIES.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-text-secondary hover:bg-primary/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>

                {/* Skills Grid */}
                <div className="max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getFilteredSkills().map((skill) => (
                      <motion.button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`p-4 rounded-xl text-left border-2 transition-all duration-300 ${
                          formData.skills.includes(skill.id)
                            ? 'border-accent bg-accent/10 shadow-glow-accent'
                            : 'border-border-subtle bg-surface-elevated hover:border-accent/50 hover:bg-accent/5'
                        }`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold text-sm ${
                            formData.skills.includes(skill.id) ? 'text-accent' : 'text-text-primary'
                          }`}>
                            {skill.name}
                          </h3>
                          {formData.skills.includes(skill.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-accent rounded-full flex items-center justify-center"
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mb-2">{skill.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {skill.category}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {getFilteredSkills().length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-text-muted">No skills found matching your search.</p>
                      <button
                        onClick={() => {
                          setSkillsSearch('')
                          setSelectedCategory('all')
                        }}
                        className="text-primary hover:text-primary-600 text-sm mt-2"
                      >
                        Clear filters
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Selection Summary */}
                <div className="bg-surface-elevated/50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      Selected Skills: {formData.skills.length}
                    </span>
                    {formData.skills.length >= 3 ? (
                      <span className="text-xs text-green-600 font-medium">✓ Ready to continue</span>
                    ) : (
                      <span className="text-xs text-warning font-medium">
                        Select {3 - formData.skills.length} more
                      </span>
                    )}
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.slice(0, 5).map(skillId => {
                        const skill = SKILLS.find(s => s.id === skillId)
                        return skill ? (
                          <span key={skillId} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                            {skill.name}
                          </span>
                        ) : null
                      })}
                      {formData.skills.length > 5 && (
                        <span className="text-xs text-text-muted px-2 py-1">
                          +{formData.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={prevStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    disabled={formData.skills.length < 3}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                      formData.skills.length >= 3
                        ? 'bg-gradient-to-r from-accent to-accent-600 text-white hover:shadow-glow-accent'
                        : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                    }`}
                    whileHover={formData.skills.length >= 3 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={formData.skills.length >= 3 ? { scale: 0.98 } : {}}
                  >
                    Complete Signup
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Final Step: Complete */}
            {(currentStep === 6 && selectedRole === 'hirer') || (currentStep === 7 && selectedRole === 'fixer') && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h2 className="heading-xl text-primary mb-4">Welcome to Fixly! 🎉</h2>
                  <p className="text-secondary mb-6">
                    Your account has been created successfully. You're ready to {selectedRole === 'fixer' ? 'start earning with your skills' : 'find amazing fixers for your needs'}!
                  </p>
                </div>

                <Link href="/dashboard">
                  <motion.button
                    className="btn-base btn-primary btn-lg w-full flex items-center justify-center gap-3 hover-glow"
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStep === 1 && (
            <div className="text-center mt-8">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-secondary hover:text-primary font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Abandon Signup Confirmation Modal */}
        <ConfirmModal
          isOpen={showAbandonModal}
          onClose={() => setShowAbandonModal(false)}
          onConfirm={confirmAbandonSignup}
          title="Abandon Sign Up?"
          message="Are you sure you want to leave? Your progress will be lost and you'll be redirected to the home page."
          confirmText="Yes, Leave"
          cancelText="Continue Signup"
          variant="warning"
        />
      </motion.div>
    </div>
  )
}