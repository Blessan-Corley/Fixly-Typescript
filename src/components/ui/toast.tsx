'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastColors = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-500',
    title: 'text-green-700 dark:text-green-400',
    message: 'text-green-600 dark:text-green-300',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-500',
    title: 'text-red-700 dark:text-red-400',
    message: 'text-red-600 dark:text-red-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-500',
    title: 'text-amber-700 dark:text-amber-400',
    message: 'text-amber-600 dark:text-amber-300',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
    title: 'text-blue-700 dark:text-blue-400',
    message: 'text-blue-600 dark:text-blue-300',
  },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = toastIcons[toast.type]
  const colors = toastColors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative glass-card border ${colors.bg} ${colors.border} rounded-xl p-4 shadow-glass-strong max-w-sm w-full pointer-events-auto`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${colors.title}`}>
            {toast.title}
          </h3>
          {toast.message && (
            <p className={`text-sm mt-1 ${colors.message}`}>
              {toast.message}
            </p>
          )}
        </div>
        
        <motion.button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${colors.icon.replace('text-', 'bg-')} rounded-b-xl`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: toast.duration || 5, ease: 'linear' }}
        onAnimationComplete={() => onRemove(toast.id)}
      />
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]) // Keep max 5 toasts
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Utility functions for common toast messages
export const toastMessages = {
  success: {
    emailSent: {
      title: 'Verification Email Sent',
      message: 'Please check your email and enter the OTP code.',
    },
    passwordSet: {
      title: 'Password Created',
      message: 'Your password has been set successfully.',
    },
    profileSaved: {
      title: 'Profile Saved',
      message: 'Your profile information has been saved.',
    },
    signupComplete: {
      title: 'Welcome to Fixly!',
      message: 'Your account has been created successfully.',
    },
  },
  error: {
    emailExists: {
      title: 'Email Already Registered',
      message: 'This email is already associated with an account.',
    },
    usernameExists: {
      title: 'Username Taken',
      message: 'This username is already in use. Please choose another.',
    },
    phoneExists: {
      title: 'Phone Number Registered',
      message: 'This phone number is already associated with an account.',
    },
    invalidOTP: {
      title: 'Invalid OTP',
      message: 'The OTP you entered is incorrect. Please try again.',
    },
    weakPassword: {
      title: 'Weak Password',
      message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
    },
    networkError: {
      title: 'Connection Error',
      message: 'Please check your internet connection and try again.',
    },
    serverError: {
      title: 'Server Error',
      message: 'Something went wrong. Please try again later.',
    },
  },
  warning: {
    fillRequired: {
      title: 'Required Fields',
      message: 'Please fill in all required fields before continuing.',
    },
    otpExpired: {
      title: 'OTP Expired',
      message: 'Your OTP has expired. Please request a new one.',
    },
    locationDenied: {
      title: 'Location Access Denied',
      message: 'Please select your location manually from the list.',
    },
  },
  info: {
    otpResent: {
      title: 'OTP Resent',
      message: 'A new verification code has been sent to your email.',
    },
    locationDetecting: {
      title: 'Detecting Location',
      message: 'Please wait while we detect your current location.',
    },
  },
}