'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  Navigation, 
  X, 
  Check, 
  Loader2, 
  AlertTriangle,
  Crosshair,
  Map as MapIcon
} from 'lucide-react'
import { LocationData } from '@/types'
import { useToast } from '@/components/ui/toast'
import { geocodingService, placesService, MapUtils, requestLocationPermission } from '@/lib/services/googleMaps'

interface EnhancedLocationSelectorProps {
  onLocationSelect: (location: LocationData) => void
  selectedLocation?: LocationData
  className?: string
  showMap?: boolean
}

export function EnhancedLocationSelector({ 
  onLocationSelect, 
  selectedLocation, 
  className = '',
  showMap = true 
}: EnhancedLocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const { addToast } = useToast()

  const mapRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await placesService.searchPlaces(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        addToast({
          type: 'error',
          title: 'Search Error',
          message: 'Failed to search locations. Please try again.',
        })
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, addToast])

  // Initialize Google Maps
  useEffect(() => {
    if (!showMap || !mapRef.current) return

    const initMap = async () => {
      if (typeof google === 'undefined') {
        // Load Google Maps API
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          createMap()
        }
        
        document.head.appendChild(script)
      } else {
        createMap()
      }
    }

    const createMap = () => {
      if (!mapRef.current) return

      const center = selectedLocation?.coordinates || { lat: 20.5937, lng: 78.9629 } // India center
      const mapOptions = MapUtils.createMapOptions(center)
      
      const newMap = new google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      // Add click listener
      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          handleMapClick(event.latLng.lat(), event.latLng.lng())
        }
      })

      // Add initial marker if location exists
      if (selectedLocation?.coordinates) {
        const newMarker = MapUtils.createMarker(
          newMap, 
          selectedLocation.coordinates,
          'Selected Location'
        )
        setMarker(newMarker)
      }
    }

    initMap()

    return () => {
      setMap(null)
      setMarker(null)
    }
  }, [showMap, selectedLocation])

  const handleMapClick = async (lat: number, lng: number) => {
    setIsDetecting(true)
    
    try {
      const locationData = await geocodingService.reverseGeocode(lat, lng)
      
      if (locationData) {
        onLocationSelect(locationData)
        
        // Update marker
        if (map) {
          if (marker) {
            marker.setMap(null)
          }
          
          const newMarker = MapUtils.createMarker(
            map,
            { lat, lng },
            'Selected Location'
          )
          setMarker(newMarker)
        }
        
        addToast({
          type: 'success',
          title: 'Location Selected',
          message: `${locationData.city}, ${locationData.state}`,
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Location Error',
        message: 'Failed to get location details. Please try again.',
      })
    } finally {
      setIsDetecting(false)
    }
  }

  const detectCurrentLocation = async () => {
    setIsDetecting(true)
    
    try {
      // Check location permission first
      const hasPermission = await requestLocationPermission()
      
      if (!hasPermission) {
        addToast({
          type: 'info',
          title: 'Location Permission',
          message: 'Please allow location access for automatic detection.',
        })
      }

      addToast({
        type: 'info',
        title: 'Detecting Location',
        message: 'Please wait while we detect your current location...',
      })

      const locationData = await geocodingService.getCurrentLocation()
      
      if (locationData) {
        onLocationSelect(locationData)
        
        // Update map view
        if (map && locationData.coordinates) {
          map.setCenter(locationData.coordinates)
          map.setZoom(15)
          
          // Update marker
          if (marker) {
            marker.setMap(null)
          }
          
          const newMarker = MapUtils.createMarker(
            map,
            locationData.coordinates,
            'Your Location'
          )
          setMarker(newMarker)
        }
        
        addToast({
          type: 'success',
          title: 'Location Detected!',
          message: `Found: ${locationData.city}, ${locationData.state}`,
        })
      }
    } catch (error: any) {
      console.error('Location detection error:', error)
      
      let errorMessage = 'Failed to detect location. Please try manual search.'
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location services and try again.'
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your internet connection.'
      } else if (error.code === 3) {
        errorMessage = 'Location detection timed out. Please try again or search manually.'
      }
      
      addToast({
        type: 'warning',
        title: 'Location Detection Failed',
        message: errorMessage,
      })
      
      setShowSearch(true)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSearchSelection = async (result: any) => {
    setIsSearching(true)
    
    try {
      const locationData = await placesService.getPlaceDetails(result.placeId)
      
      if (locationData) {
        onLocationSelect(locationData)
        
        // Update map view
        if (map && locationData.coordinates) {
          map.setCenter(locationData.coordinates)
          map.setZoom(15)
          
          // Update marker
          if (marker) {
            marker.setMap(null)
          }
          
          const newMarker = MapUtils.createMarker(
            map,
            locationData.coordinates,
            locationData.address || 'Selected Location'
          )
          setMarker(newMarker)
        }
        
        setShowSearch(false)
        setSearchQuery('')
        setSearchResults([])
        
        addToast({
          type: 'success',
          title: 'Location Selected',
          message: `${locationData.city}, ${locationData.state}`,
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Selection Error',
        message: 'Failed to select location. Please try again.',
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Selection Display */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">
                    {selectedLocation.address}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3 h-3" />
                    {selectedLocation.type === 'gps' ? 'GPS Located' : 'Manually Selected'}
                  </span>
                  {selectedLocation.coordinates?.accuracy && (
                    <span>Accuracy: ±{selectedLocation.coordinates.accuracy}m</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-primary hover:text-primary-600 transition-colors"
                  title="Search different location"
                >
                  <Search className="w-4 h-4" />
                </button>
                {showMap && (
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="text-accent hover:text-accent-600 transition-colors"
                    title={showMap ? 'Hide map' : 'Show map'}
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Options */}
      {!selectedLocation && (
        <div className="space-y-4">
          {/* Auto Detect Button */}
          <motion.button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            className="w-full glass-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!isDetecting ? { scale: 1.02 } : {}}
            whileTap={!isDetecting ? { scale: 0.98 } : {}}
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
                  {isDetecting 
                    ? 'Getting your precise location with GPS' 
                    : 'Automatically detect your current location with high accuracy'
                  }
                </p>
              </div>
            </div>
          </motion.button>

          {/* Manual Search Button */}
          <motion.button
            onClick={() => setShowSearch(true)}
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
                  Search for any location with Google Places integration
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Interactive Map */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl overflow-hidden border border-border"
          >
            <div className="p-4 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Interactive Map</h3>
                <p className="text-sm text-text-secondary">Click on the map to select a location</p>
              </div>
            </div>
            <div className="relative">
              <div 
                ref={mapRef} 
                className="w-full h-64 bg-background-muted"
                style={{ minHeight: '256px' }}
              />
              {isDetecting && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="glass-card p-4 rounded-lg flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-text-primary font-medium">Processing location...</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md rounded-2xl p-6 max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">Search Location</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Search for a location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type city, area, or landmark..."
                    className="w-full pl-12 pr-12 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.placeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSearchSelection(result)}
                      disabled={isSearching}
                      className="w-full p-4 rounded-xl glass border border-border hover:border-primary/50 transition-all duration-200 mb-3 last:mb-0 text-left group disabled:opacity-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                            {result.mainText}
                          </div>
                          <div className="text-sm text-text-secondary mt-1 line-clamp-2">
                            {result.secondaryText}
                          </div>
                        </div>
                        <MapPin className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="text-center py-8 text-text-muted">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No locations found matching "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try searching with different keywords</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-8 text-text-muted">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Start typing to search for locations</p>
                    <p className="text-sm mt-1">Powered by Google Places</p>
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