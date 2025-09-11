import { useState, useCallback } from 'react'

interface ValidationResult {
  available: boolean
  message: string
  shouldRedirectToLogin?: boolean
}

interface UseValidationReturn {
  validateUsername: (username: string) => Promise<ValidationResult>
  validatePhone: (phone: string) => Promise<ValidationResult>
  validateEmail: (email: string) => Promise<ValidationResult>
  isValidating: boolean
}

export function useValidation(): UseValidationReturn {
  const [isValidating, setIsValidating] = useState(false)

  const validateUsername = useCallback(async (username: string): Promise<ValidationResult> => {
    if (!username || username.length < 3) {
      return {
        available: false,
        message: 'Username must be at least 3 characters'
      }
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return {
        available: false,
        message: 'Username can only contain lowercase letters, numbers, and underscores'
      }
    }

    setIsValidating(true)
    try {
      const response = await fetch(`/api/auth/validate/username?username=${encodeURIComponent(username)}`)
      const result = await response.json()
      return result
    } catch (error) {
      return {
        available: false,
        message: 'Error validating username'
      }
    } finally {
      setIsValidating(false)
    }
  }, [])

  const validatePhone = useCallback(async (phone: string): Promise<ValidationResult> => {
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (!phone) {
      return {
        available: false,
        message: 'Phone number is required'
      }
    }

    if (cleanPhone.length !== 10) {
      return {
        available: false,
        message: 'Phone number must be exactly 10 digits'
      }
    }

    if (!/^[6-9]/.test(cleanPhone)) {
      return {
        available: false,
        message: 'Phone number must start with 6, 7, 8, or 9'
      }
    }

    setIsValidating(true)
    try {
      const response = await fetch(`/api/auth/validate/phone?phone=${encodeURIComponent(cleanPhone)}`)
      const result = await response.json()
      return result
    } catch (error) {
      return {
        available: false,
        message: 'Error validating phone number'
      }
    } finally {
      setIsValidating(false)
    }
  }, [])

  const validateEmail = useCallback(async (email: string): Promise<ValidationResult> => {
    if (!email) {
      return {
        available: false,
        message: 'Email is required'
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        available: false,
        message: 'Please enter a valid email address'
      }
    }

    setIsValidating(true)
    try {
      const response = await fetch(`/api/auth/validate/email?email=${encodeURIComponent(email)}`)
      const result = await response.json()
      return result
    } catch (error) {
      return {
        available: false,
        message: 'Error validating email'
      }
    } finally {
      setIsValidating(false)
    }
  }, [])

  return {
    validateUsername,
    validatePhone,
    validateEmail,
    isValidating
  }
}