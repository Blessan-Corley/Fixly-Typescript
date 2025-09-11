import { useState, useCallback } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useToast } from '@/components/ui/toast-provider'

interface GoogleAuthOptions {
  role: 'hirer' | 'fixer'
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  callbackUrl?: string
}

interface UseGoogleAuthReturn {
  signInWithGoogle: (options: GoogleAuthOptions) => Promise<void>
  isLoading: boolean
  checkUserExists: (email: string) => Promise<{ exists: boolean; user?: any }>
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const checkUserExists = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/auth/google-signup?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check user status')
      }
      
      return data
    } catch (error) {
      console.error('Error checking user existence:', error)
      throw error 
    }
  }, [])

  const signInWithGoogle = useCallback(async (options: GoogleAuthOptions) => {
    const { role, onSuccess, onError, callbackUrl = '/dashboard' } = options
    
    setIsLoading(true)
    
    try {
      // Show loading message
      addToast({
        type: 'info',
        title: 'Redirecting to Google',
        message: 'Opening Google authentication...'
      })
      
      // Initiate Google sign-in (existing users only)
      // New users will be redirected to signup page
      const result = await signIn('google', {
        callbackUrl: callbackUrl,
        redirect: true // Let NextAuth handle the redirect
      })
      
      // This won't execute if redirect is true due to redirect, but kept for error handling
      if (result?.error) {
        throw new Error(result.error)
      }
      
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to sign in with Google' 
      
      addToast({
        type: 'error',
        title: 'Sign-In Failed',
        message: errorMessage
      })
      
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  return {
    signInWithGoogle,
    
    isLoading,
    checkUserExists
  }
}

// Utility function to handle Google OAuth callbacks
export async function handleGoogleCallback(
  searchParams: URLSearchParams,
  onExistingUser?: (user: any) => void,
  onNewUser?: (email: string) => void
) {
  const error = searchParams.get('error')
  const code = searchParams.get('code')
  
  if (error) {
    console.error('Google OAuth error:', error)
    return {
      success: false,
      error: error === 'OAuthAccountNotLinked' 
        ? 'This account is already linked to another method' 
        : 'Authentication failed'
    }
  }
  
  if (code) {
    // OAuth was successful, handle user creation/login
    return {
      success: true,
      code
    }
  }
  
  return {
    success: false,
    error: 'Invalid OAuth response'
  }
}