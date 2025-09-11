'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Shield, Clock, X, AlertCircle, Navigation } from 'lucide-react'

interface LocationPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onPermissionSelected: (permission: 'always' | 'session' | 'never') => void
  context?: 'service' | 'general' | 'first_time'
  serviceName?: string
}

export function LocationPermissionModal({
  isOpen,
  onClose,
  onPermissionSelected,
  context = 'general',
  serviceName
}: LocationPermissionModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handlePermissionSelect = (permission: 'always' | 'session' | 'never') => {
    onPermissionSelected(permission)
    handleClose()
  }

  const getContextText = () => {
    switch (context) {
      case 'service':
        return {
          title: `${serviceName || 'Service'} needs your location`,
          subtitle: 'To show you nearby services and accurate pricing'
        }
      case 'first_time':
        return {
          title: 'Welcome to Fixly!',
          subtitle: 'Help us provide better service by sharing your location'
        }
      default:
        return {
          title: 'Fixly wants to know your location',
          subtitle: 'This helps us show you relevant services and fixers nearby'
        }
    }
  }

  const { title, subtitle } = getContextText()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: isClosing ? 0 : 1, 
              scale: isClosing ? 0.9 : 1, 
              y: isClosing ? 20 : 0 
            }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="p-6 space-y-4">
              {/* Always Allow */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePermissionSelect('always')}
                className="w-full p-4 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Allow everytime
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Automatically update your location every 30 minutes for the best experience
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Clock className="w-3 h-3" />
                      Auto-updates every 30 minutes
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Allow This Session */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePermissionSelect('session')}
                className="w-full p-4 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Allow only this time
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Use location for this session only. Updates every 30 mins until you leave.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <Clock className="w-3 h-3" />
                      Session-based updates
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Never Allow */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePermissionSelect('never')}
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Don't allow
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Use your home address for services. You can manually select location when needed.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <AlertCircle className="w-3 h-3" />
                      Manual location selection required
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Footer Info */}
            <div className="p-6 pt-0">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Your privacy matters. Location data is only used to improve your service experience and is never shared with third parties.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing location permissions
export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] = useState<'always' | 'session' | 'denied' | 'not_requested'>('not_requested')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)

  const requestPermission = (context?: 'service' | 'general' | 'first_time', serviceName?: string) => {
    return new Promise<'always' | 'session' | 'never'>((resolve) => {
      setIsModalOpen(true)
      
      const handlePermissionSelected = (permission: 'always' | 'session' | 'never') => {
        setPermissionStatus(permission === 'never' ? 'denied' : permission)
        setIsModalOpen(false)
        
        // Update user preference via API
        updateLocationPermission(permission)
        
        if (permission !== 'never') {
          getCurrentLocation()
        }
        
        resolve(permission)
      }
      
      // Pass the handler through modal props
      ;(window as any).__locationPermissionHandler = handlePermissionSelected
    })
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position)
        // Update location via API
        updateCurrentLocation(position)
      },
      (error) => {
        console.error('Location error:', error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const updateLocationPermission = async (permission: 'always' | 'session' | 'never') => {
    try {
      await fetch('/api/user/location/permission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ permission })
      })
    } catch (error) {
      console.error('Failed to update location permission:', error)
    }
  }

  const updateCurrentLocation = async (position: GeolocationPosition) => {
    try {
      const { latitude: lat, longitude: lng, accuracy } = position.coords
      
      await fetch('/api/user/location/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          coordinates: { lat, lng, accuracy },
          method: 'gps'
        })
      })
    } catch (error) {
      console.error('Failed to update current location:', error)
    }
  }

  return {
    permissionStatus,
    isModalOpen,
    currentPosition,
    requestPermission,
    getCurrentLocation,
    LocationPermissionModal: (props: Omit<LocationPermissionModalProps, 'onPermissionSelected'>) => (
      <LocationPermissionModal
        {...props}
        onPermissionSelected={(window as any).__locationPermissionHandler}
      />
    )
  }
}