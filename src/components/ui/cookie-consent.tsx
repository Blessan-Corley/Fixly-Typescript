'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Check, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CookieConsentProps {
  onAccept?: () => void
  onDecline?: () => void
  onCustomize?: () => void
  className?: string
}

// Cookie utilities
const COOKIE_CONSENT_KEY = 'fixly-cookie-consent'
const COOKIE_PREFERENCES_KEY = 'fixly-cookie-preferences'

export const setCookieConsent = (consent: boolean, preferences?: CookiePreferences) => {
  const expires = new Date(Date.now() + 365 * 864e5).toUTCString()
  document.cookie = `${COOKIE_CONSENT_KEY}=${consent}; expires=${expires}; path=/`
  
  if (preferences) {
    document.cookie = `${COOKIE_PREFERENCES_KEY}=${JSON.stringify(preferences)}; expires=${expires}; path=/`
  }
}

export const getCookieConsent = (): boolean | null => {
  if (typeof document === 'undefined') return null
  
  const consent = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_CONSENT_KEY}=`))
    ?.split('=')[1]
    
  return consent === 'true' ? true : consent === 'false' ? false : null
}

export const getCookiePreferences = (): CookiePreferences => {
  if (typeof document === 'undefined') return getDefaultPreferences()
  
  const prefs = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_PREFERENCES_KEY}=`))
    ?.split('=')[1]
    
  if (prefs) {
    try {
      return JSON.parse(decodeURIComponent(prefs))
    } catch {
      return getDefaultPreferences()
    }
  }
  
  return getDefaultPreferences()
}

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

const getDefaultPreferences = (): CookiePreferences => ({
  necessary: true, // Always true, cannot be disabled
  analytics: true,
  marketing: false,
  functional: true
})

const CookieDetailsModal = ({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: CookiePreferences) => void
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences())

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Necessary Cookies',
      description: 'Essential for website functionality, security, and user authentication. These cannot be disabled.',
      disabled: true
    },
    {
      key: 'functional' as keyof CookiePreferences,
      title: 'Functional Cookies',
      description: 'Remember your preferences like theme settings, language, and location for a personalized experience.',
      disabled: false
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our website to improve performance and user experience.',
      disabled: false
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Enable personalized advertisements and measure campaign effectiveness across websites.',
      disabled: false
    }
  ]

  const handleSave = () => {
    onSave(preferences)
    onClose()
  }

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-[101]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-slate-900" />
                  </div>
                  <h2 className="text-xl font-bold text-text-slate-900">Cookie Preferences</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg glass hover:shadow-glass-hover transition-all"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {cookieTypes.map((type, index) => (
                  <motion.div
                    key={type.key}
                    className="glass p-4 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-slate-900 mb-1">
                          {type.title}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {type.description}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <motion.button
                          className={cn(
                            "relative w-12 h-6 rounded-full transition-colors duration-300",
                            preferences[type.key]
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600",
                            type.disabled && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => handleToggle(type.key)}
                          disabled={type.disabled}
                          whileTap={{ scale: type.disabled ? 1 : 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                            animate={{
                              x: preferences[type.key] ? 26 : 2,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30
                            }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 glass rounded-xl text-text-secondary hover:shadow-glass-hover transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-glow-primary transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function CookieConsent({ onAccept, onDecline, onCustomize, className }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if user has already made a choice
    const consent = getCookieConsent()
    if (consent === null) {
      // Delayed appearance for better UX - show after user has time to explore the site
      setTimeout(() => {
        setIsVisible(true)
      }, 5000) // 5 seconds delay for better user experience
    }
  }, [])

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    setCookieConsent(true, preferences)
    setIsVisible(false)
    onAccept?.()
  }

  const handleDeclineAll = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    setCookieConsent(false, preferences)
    setIsVisible(false)
    onDecline?.()
  }

  const handleCustomize = () => {
    setShowDetails(true)
    onCustomize?.()
  }

  const handleSavePreferences = (preferences: CookiePreferences) => {
    setCookieConsent(true, preferences)
    setIsVisible(false)
    onAccept?.()
  }

  if (!mounted) return null

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              "fixed bottom-6 right-6 z-50 max-w-sm",
              className
            )}
            initial={{ 
              opacity: 0, 
              y: 100, 
              scale: 0.8,
              filter: 'blur(10px)'
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{ 
              opacity: 0, 
              y: 100, 
              scale: 0.8,
              filter: 'blur(10px)'
            }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              stiffness: 100,
              damping: 20
            }}
          >
            {/* Background with glass effect */}
            <motion.div
              className="glass-card rounded-2xl p-6 border border-border-glass shadow-2xl backdrop-blur-xl bg-surface/95"
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(12px)' }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Header */}
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="font-bold text-text-slate-900 text-lg">We value your privacy</h3>
              </motion.div>

              {/* Content */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  We use cookies to enhance your experience, provide personalized content, and analyze our traffic. 
                  Choose your preferences or accept all to continue with our recommended settings.
                </p>
                
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>This popup will only appear once</span>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 group"
                  >
                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Accept All
                  </button>
                  
                  <button
                    onClick={handleDeclineAll}
                    className="px-4 py-3 glass rounded-xl text-text-secondary hover:shadow-glass-hover transition-all duration-300"
                  >
                    Decline
                  </button>
                </div>
                
                <button
                  onClick={handleCustomize}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-slate-900 border border-border-glass rounded-xl hover:shadow-glass-hover transition-all duration-300 group"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Customize Preferences
                </button>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-primary/20 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" as const
                }}
              />
              
              <motion.div
                className="absolute -bottom-1 -left-1 w-6 h-6 bg-accent/20 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onSave={handleSavePreferences}
      />
    </>
  )
}

// Hook for checking cookie preferences
export const useCookiePreferences = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences())
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  useEffect(() => {
    setPreferences(getCookiePreferences())
    setHasConsent(getCookieConsent())
  }, [])

  return {
    preferences,
    hasConsent,
    updatePreferences: (newPrefs: CookiePreferences) => {
      setCookieConsent(true, newPrefs)
      setPreferences(newPrefs)
      setHasConsent(true)
    }
  }
}

export default CookieConsent