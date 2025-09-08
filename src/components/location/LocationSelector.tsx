'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, X, Check, Loader2 } from 'lucide-react'
import { searchCities, indianStates } from '@/data/cities'
import { useToast, toastMessages } from '@/components/ui/toast'

interface LocationData {
  type: 'gps' | 'manual'
  coordinates?: {
    lat: number
    lng: number
  }
  address?: string
  city: string
  state: string
  stateCode: string
  pincode?: string
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void
  selectedLocation?: LocationData
  className?: string
}

export function LocationSelector({ onLocationSelect, selectedLocation, className = '' }: LocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ city: string, state: string, stateCode: string }>>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const { addToast } = useToast()

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      const results = searchCities(searchQuery, selectedState)
      setSearchResults(results)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedState])

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      addToast({
        type: 'error',
        title: 'Geolocation Not Supported',
        message: 'Your browser does not support location detection.',
      })
      setShowManualSearch(true)
      return
    }

    setIsDetecting(true)
    addToast(toastMessages.info.locationDetecting)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocoding using Google Maps API (if available)
      if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          )
          const data = await response.json()

          if (data.results && data.results[0]) {
            const result = data.results[0]
            const addressComponents = result.address_components

            let city = '', state = '', stateCode = '', pincode = ''

            addressComponents.forEach((component: any) => {
              if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                city = component.long_name
              }
              if (component.types.includes('administrative_area_level_1')) {
                state = component.long_name
                stateCode = component.short_name
              }
              if (component.types.includes('postal_code')) {
                pincode = component.long_name
              }
            })

            // Find matching state code
            const matchedState = indianStates.find(s => 
              s.name.toLowerCase().includes(state.toLowerCase()) || 
              s.code === stateCode
            )

            if (matchedState && city) {
              const locationData: LocationData = {
                type: 'gps',
                coordinates: { lat: latitude, lng: longitude },
                address: result.formatted_address,
                city,
                state: matchedState.name,
                stateCode: matchedState.code,
                pincode
              }
              onLocationSelect(locationData)
              addToast({
                type: 'success',
                title: 'Location Detected',
                message: `Found: ${city}, ${matchedState.name}`,
              })
              return
            }
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error)
        }
      }

      // Fallback: Use coordinates without address details
      addToast({
        type: 'warning',
        title: 'Location Detected',
        message: 'Please select your city manually for better accuracy.',
      })
      setShowManualSearch(true)

    } catch (error) {
      console.error('Geolocation error:', error)
      addToast(toastMessages.warning.locationDenied)
      setShowManualSearch(true)
    } finally {
      setIsDetecting(false)
    }
  }, [addToast, onLocationSelect])

  const handleManualSelection = (result: { city: string, state: string, stateCode: string }) => {
    const locationData: LocationData = {
      type: 'manual',
      city: result.city,
      state: result.state,
      stateCode: result.stateCode
    }
    onLocationSelect(locationData)
    setShowManualSearch(false)
    setSearchQuery('')
    setSearchResults([])
    addToast({
      type: 'success',
      title: 'Location Selected',
      message: `${result.city}, ${result.state}`,
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Selection Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">Selected Location</h3>
              <p className="text-sm text-text-secondary">
                {selectedLocation.city}, {selectedLocation.state}
              </p>
              {selectedLocation.address && (
                <p className="text-xs text-text-muted mt-1">
                  {selectedLocation.address}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowManualSearch(true)}
              className="text-primary hover:text-primary-600 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Location Options */}
      {!selectedLocation && (
        <div className="space-y-4">
          {/* Auto Detect Button */}
          <motion.button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full glass-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white group-hover:shadow-glow-primary transition-all">
                {isDetecting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Navigation className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-text-primary mb-1">
                  {isDetecting ? 'Detecting Location...' : 'Use Current Location'}
                </h3>
                <p className="text-sm text-text-secondary">
                  {isDetecting ? 'Please wait while we detect your location' : 'Automatically detect your current location'}
                </p>
              </div>
            </div>
          </motion.button>

          {/* Manual Search Button */}
          <motion.button
            onClick={() => setShowManualSearch(true)}
            className="w-full glass-card p-6 rounded-xl border border-border hover:border-accent/50 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-warning rounded-xl flex items-center justify-center text-white group-hover:shadow-glow-accent transition-all">
                <Search className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-text-primary mb-1">
                  Search Manually
                </h3>
                <p className="text-sm text-text-secondary">
                  Choose your city from our comprehensive list
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Manual Search Modal */}
      <AnimatePresence>
        {showManualSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowManualSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md rounded-2xl p-6 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">Select Location</h2>
                <button
                  onClick={() => setShowManualSearch(false)}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* State Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Filter by State (Optional)
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All States</option>
                  {indianStates.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Search City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type city name..."
                    className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={`${result.city}-${result.stateCode}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleManualSelection(result)}
                      className="w-full p-3 rounded-xl glass border border-border hover:border-primary/50 transition-all duration-200 mb-2 last:mb-0 text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-text-primary group-hover:text-primary transition-colors">
                            {result.city}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {result.state}
                          </div>
                        </div>
                        <MapPin className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8 text-text-muted">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No cities found matching "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try adjusting your search or select a different state</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-8 text-text-muted">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Start typing to search for cities</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}