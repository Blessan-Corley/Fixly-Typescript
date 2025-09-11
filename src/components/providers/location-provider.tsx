'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { LocationPermissionModal } from '@/components/ui/location-permission-modal'
import { LocationDeniedModal } from '@/components/ui/location-denied-modal'
import { GoogleMapsLocationPicker } from '@/components/ui/google-maps'
import { locationService } from '@/lib/services/location-service'

interface LocationContextType {
  // Permission Management
  requestLocationPermission: (context?: 'service' | 'general' | 'first_time', serviceName?: string) => Promise<'always' | 'session' | 'never'>
  permissionStatus: 'always' | 'session' | 'denied' | 'not_requested'
  
  // Location Data
  currentLocation: any
  homeAddress: any
  approximateLocation: any
  
  // Service Requests
  handleServiceLocationRequest: (serviceName: string) => Promise<any>
  
  // Manual Location Selection
  showManualLocationPicker: (onLocationSelected: (location: any) => void) => void
  
  // Status
  isAutoUpdateActive: boolean
  refreshLocation: () => Promise<void>
}

const LocationContext = createContext<LocationContextType | null>(null)

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

interface LocationProviderProps {
  children: React.ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  // State Management
  const [permissionStatus, setPermissionStatus] = useState<'always' | 'session' | 'denied' | 'not_requested'>('not_requested')
  const [isAutoUpdateActive, setIsAutoUpdateActive] = useState(false)
  
  // Location Data
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [homeAddress, setHomeAddress] = useState<any>(null)
  const [approximateLocation, setApproximateLocation] = useState<any>(null)
  
  // Modal States
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [isDenialModalOpen, setIsDenialModalOpen] = useState(false)
  const [isManualPickerOpen, setIsManualPickerOpen] = useState(false)
  
  // Modal Context
  const [permissionContext, setPermissionContext] = useState<{
    context: 'service' | 'general' | 'first_time'
    serviceName?: string
    resolve: (value: 'always' | 'session' | 'never') => void
  } | null>(null)
  
  const [denialContext, setDenialContext] = useState<{
    serviceName: string
    context: 'service' | 'general'
    resolve: (value: any) => void
  } | null>(null)
  
  const [manualPickerContext, setManualPickerContext] = useState<{
    onLocationSelected: (location: any) => void
  } | null>(null)

  // Initialize location service
  useEffect(() => {
    initializeLocationData()
    setupLocationEventListeners()
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('requestLocationPermission', handlePermissionRequest)
      window.removeEventListener('locationUpdated', handleLocationUpdate)
    }
  }, [])

  const initializeLocationData = async () => {
    try {
      const response = await fetch('/api/user/location/permission', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPermissionStatus(data.permission.status)
        setCurrentLocation(data.locations.current)
        setHomeAddress(data.locations.home)
        setApproximateLocation(data.locations.approximate)
        setIsAutoUpdateActive(data.permission.autoUpdateEnabled)
      }
    } catch (error) {
      console.error('Failed to initialize location data:', error)
    }
  }

  const setupLocationEventListeners = () => {
    window.addEventListener('requestLocationPermission', handlePermissionRequest)
    window.addEventListener('locationUpdated', handleLocationUpdate)
  }

  const handlePermissionRequest = (event: any) => {
    const { context, serviceName, callback } = event.detail
    setPermissionContext({
      context: context || 'general',
      serviceName,
      resolve: callback
    })
    setIsPermissionModalOpen(true)
  }

  const handleLocationUpdate = (event: any) => {
    // Refresh location data when auto-update occurs
    refreshLocation()
  }

  // Permission Management
  const requestLocationPermission = useCallback((
    context: 'service' | 'general' | 'first_time' = 'general',
    serviceName?: string
  ): Promise<'always' | 'session' | 'never'> => {
    return new Promise((resolve) => {
      setPermissionContext({
        context,
        serviceName,
        resolve
      })
      setIsPermissionModalOpen(true)
    })
  }, [])

  const handlePermissionSelected = async (permission: 'always' | 'session' | 'never') => {
    setIsPermissionModalOpen(false)
    
    // Update permission via API
    await locationService.updatePermission(permission)
    setPermissionStatus(permission === 'never' ? 'denied' : permission)
    setIsAutoUpdateActive(permission !== 'never')
    
    // Resolve promise
    if (permissionContext) {
      permissionContext.resolve(permission)
      setPermissionContext(null)
    }
    
    // Refresh location data
    await refreshLocation()
  }

  // Service Location Request
  const handleServiceLocationRequest = useCallback(async (serviceName: string): Promise<any> => {
    return new Promise(async (resolve) => {
      const result = await locationService.handleServiceRequest(serviceName)
      
      if (result.error === 'location_denied') {
        // Show denial modal with options
        setDenialContext({
          serviceName,
          context: 'service',
          resolve
        })
        setIsDenialModalOpen(true)
      } else {
        resolve(result)
      }
    })
  }, [])

  // Denial Modal Handlers
  const handleDenialRetry = async () => {
    setIsDenialModalOpen(false)
    if (denialContext) {
      const permission = await requestLocationPermission('service', denialContext.serviceName)
      if (permission !== 'never') {
        const result = await locationService.getCurrentLocation()
        denialContext.resolve(result)
      } else {
        denialContext.resolve({
          error: 'location_denied',
          fallback: 'home'
        })
      }
      setDenialContext(null)
    }
  }

  const handleDenialManualSelect = () => {
    setIsDenialModalOpen(false)
    if (denialContext) {
      showManualLocationPicker((location) => {
        denialContext.resolve({
          location,
          source: 'manual'
        })
      })
      setDenialContext(null)
    }
  }

  const handleDenialUseHome = () => {
    setIsDenialModalOpen(false)
    if (denialContext) {
      denialContext.resolve({
        location: homeAddress,
        source: 'home'
      })
      setDenialContext(null)
    }
  }

  // Manual Location Picker
  const showManualLocationPicker = useCallback((onLocationSelected: (location: any) => void) => {
    setManualPickerContext({ onLocationSelected })
    setIsManualPickerOpen(true)
  }, [])

  const handleManualLocationSelected = (location: any) => {
    setIsManualPickerOpen(false)
    if (manualPickerContext) {
      manualPickerContext.onLocationSelected(location)
      setManualPickerContext(null)
    }
  }

  // Refresh Location Data
  const refreshLocation = useCallback(async () => {
    try {
      const response = await fetch('/api/user/location/permission', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentLocation(data.locations.current)
        setHomeAddress(data.locations.home)
        setApproximateLocation(data.locations.approximate)
      }
    } catch (error) {
      console.error('Failed to refresh location data:', error)
    }
  }, [])

  const contextValue: LocationContextType = {
    // Permission Management
    requestLocationPermission,
    permissionStatus,
    
    // Location Data
    currentLocation,
    homeAddress,
    approximateLocation,
    
    // Service Requests
    handleServiceLocationRequest,
    
    // Manual Location Selection
    showManualLocationPicker,
    
    // Status
    isAutoUpdateActive,
    refreshLocation
  }

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
      
      {/* Permission Modal */}
      {isPermissionModalOpen && permissionContext && (
        <LocationPermissionModal
          isOpen={isPermissionModalOpen}
          onClose={() => {
            setIsPermissionModalOpen(false)
            if (permissionContext) {
              permissionContext.resolve('never')
              setPermissionContext(null)
            }
          }}
          onPermissionSelected={handlePermissionSelected}
          context={permissionContext.context}
          serviceName={permissionContext.serviceName}
        />
      )}
      
      {/* Denial Modal */}
      {isDenialModalOpen && denialContext && (
        <LocationDeniedModal
          isOpen={isDenialModalOpen}
          onClose={() => {
            setIsDenialModalOpen(false)
            if (denialContext) {
              denialContext.resolve({ error: 'cancelled' })
              setDenialContext(null)
            }
          }}
          serviceName={denialContext.serviceName}
          context={denialContext.context}
          onRetry={handleDenialRetry}
          onManualSelect={handleDenialManualSelect}
          onUseHome={handleDenialUseHome}
        />
      )}
      
      {/* Manual Location Picker */}
      {isManualPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Your Location
              </h3>
              <button
                onClick={() => setIsManualPickerOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <GoogleMapsLocationPicker
              onLocationSelect={handleManualLocationSelected}
              placeholder="Search for your location"
            />
          </div>
        </div>
      )}
    </LocationContext.Provider>
  )
}