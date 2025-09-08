'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Clock, Shield } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [passwords, setPasswords] = useState({ new: '', confirm: '' })
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false })
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!email.trim()) return
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(2)
      setCountdown(60)
    }, 2000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    if (otp.join('').length !== 6) return
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(3)
    }, 1500)
  }

  const handleResetPassword = async () => {
    if (passwords.new !== passwords.confirm || passwords.new.length < 8) return
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(4)
    }, 2000)
  }

  const handleResendCode = () => {
    if (countdown > 0) return
    setCountdown(60)
  }

  const steps = [
    { number: 1, title: 'Email', desc: 'Enter your email' },
    { number: 2, title: 'Verify', desc: 'Check your inbox' },
    { number: 3, title: 'Reset', desc: 'New password' },
    { number: 4, title: 'Done', desc: 'All set!' }
  ]

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
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
            <motion.div
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
            <p className="text-text-secondary">We'll help you get back into your account</p>
          </div>

          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: currentStep >= step.number ? 1 : 0.5,
                  scale: currentStep === step.number ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep > step.number 
                    ? 'bg-primary text-white' 
                    : currentStep === step.number 
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow-primary' 
                      : 'bg-surface-secondary text-text-muted'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-xs text-text-muted mt-2 text-center">
                  <div className="font-medium">{step.title}</div>
                  <div>{step.desc}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute h-0.5 w-16 top-5 transition-colors duration-300 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-border-subtle'
                  }`} style={{ left: `${25 + (index * 25)}%`, transform: 'translateX(-50%)' }} />
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter your email address"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Security Notice</p>
                      <p>We'll send a verification code to your email. The code expires in 10 minutes for your security.</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleSendCode}
                  disabled={!email.trim() || isLoading}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    email.trim() && !isLoading
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary hover:scale-105'
                      : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                  }`}
                  whileHover={email.trim() && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={email.trim() && !isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <p className="text-text-secondary mb-2">We sent a 6-digit code to:</p>
                  <p className="font-semibold text-primary">{email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-4">Enter Verification Code</label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                    className={`font-medium transition-colors ${
                      countdown > 0 
                        ? 'text-text-muted cursor-not-allowed' 
                        : 'text-primary hover:text-primary-600'
                    }`}
                  >
                    {countdown > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Resend in {countdown}s
                      </span>
                    ) : (
                      'Resend Code'
                    )}
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    Change Email
                  </button>
                </div>

                <motion.button
                  onClick={handleVerifyCode}
                  disabled={otp.join('').length !== 6 || isLoading}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    otp.join('').length === 6 && !isLoading
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary hover:scale-105'
                      : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                  }`}
                  whileHover={otp.join('').length === 6 && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={otp.join('').length === 6 && !isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter new password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${passwords.new.length >= 8 ? 'text-green-600' : 'text-text-muted'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwords.new.length >= 8 ? 'bg-green-600' : 'bg-border-subtle'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${passwords.new === passwords.confirm && passwords.new ? 'text-green-600' : 'text-text-muted'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwords.new === passwords.confirm && passwords.new ? 'bg-green-600' : 'bg-border-subtle'}`} />
                    Passwords match
                  </div>
                </div>

                <motion.button
                  onClick={handleResetPassword}
                  disabled={passwords.new !== passwords.confirm || passwords.new.length < 8 || isLoading}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    passwords.new === passwords.confirm && passwords.new.length >= 8 && !isLoading
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow-primary hover:scale-105'
                      : 'bg-surface-secondary text-text-muted cursor-not-allowed'
                  }`}
                  whileHover={passwords.new === passwords.confirm && passwords.new.length >= 8 && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={passwords.new === passwords.confirm && passwords.new.length >= 8 && !isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Password Reset!</h2>
                  <p className="text-text-secondary">
                    Your password has been successfully updated. You can now sign in with your new password.
                  </p>
                </div>

                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 group"
                >
                  Continue to Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStep < 4 && (
            <div className="text-center mt-8">
              <Link href="/auth/signin" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
