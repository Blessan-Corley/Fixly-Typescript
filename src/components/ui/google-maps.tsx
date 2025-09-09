'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Search, X, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'

interface Location {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  placeId?: string
  components?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

interface GoogleMapsProps {
  onLocationSelect: (location: Location) => void
  initialLocation?: Location
  placeholder?: string
  className?: string
}

// Google Maps integration component
export function GoogleMapsLocationPicker({ 
  onLocationSelect, 
  initialLocation,
  placeholder = "Enter your address",
  className = ""
}: GoogleMapsProps) {
  const { addToast } = useToast()
  const [query, setQuery] = useState(initialLocation?.address || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null)
  const [mapCenter, setMapCenter] = useState(initialLocation?.coordinates || { lat: 28.6139, lng: 77.2090 }) // Delhi default
  const [mapZoom, setMapZoom] = useState(13)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!(window as any).google || !mapRef.current) return

      // Initialize map
      mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f8fafc' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#a5b4fc' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [{ color: '#e2e8f0' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      })

      // Initialize services
      autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService()
      placesServiceRef.current = new (window as any).google.maps.places.PlacesService(mapInstanceRef.current)

      // Initialize marker
      markerRef.current = new (window as any).google.maps.Marker({
        map: mapInstanceRef.current,
        position: mapCenter,
        draggable: true,
        animation: (window as any).google.maps.Animation.DROP
      })

      // Handle marker drag
      markerRef.current.addListener('dragend', handleMarkerDrag)
      
      // Handle map click
      mapInstanceRef.current.addListener('click', handleMapClick)

      // Set initial location if provided
      if (initialLocation) {
        updateMapLocation(initialLocation)
      }
    }

    if ((window as any).google) {
      initializeMap()
    } else {
      // Load Google Maps script
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.onload = initializeMap
      document.head.appendChild(script)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleMarkerDrag = useCallback(() => {
    const position = markerRef.current.getPosition()
    const coordinates = { lat: position.lat(), lng: position.lng() }
    reverseGeocode(coordinates)
  }, [])

  const handleMapClick = useCallback((event: any) => {
    const coordinates = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    markerRef.current.setPosition(coordinates)
    reverseGeocode(coordinates)
  }, [])

  const reverseGeocode = useCallback(async (coordinates: { lat: number; lng: number }) => {
    if (!(window as any).google) return

    const geocoder = new (window as any).google.maps.Geocoder()
    
    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: coordinates }, (results: any, status: any) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0])
          } else {
            reject(new Error('Geocoding failed'))
          }
        })
      })

      const result = response as any
      const location = parseGoogleMapsResult(result, coordinates)
      setSelectedLocation(location)
      setQuery(location.address)
      onLocationSelect(location)
      
      addToast({
        type: 'success',
        title: 'Location updated',
        message: 'Address detected from map location'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Location error',
        message: 'Could not detect address for this location'
      })
    }
  }, [onLocationSelect, addToast])

  const handleInputChange = useCallback((value: string) => {
    setQuery(value)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim().length > 2 && autocompleteServiceRef.current) {
        setIsLoading(true)
        
        autocompleteServiceRef.current.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: 'IN' }, // Restrict to India
            types: ['establishment', 'geocode']
          },
          (predictions: any[], status: any) => {
            setIsLoading(false)
            if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(predictions.slice(0, 5))
              setShowSuggestions(true)
            } else {
              setSuggestions([])
              setShowSuggestions(false)
            }
          }
        )
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
  }, [])

  const handleSuggestionSelect = useCallback((suggestion: any) => {
    if (!placesServiceRef.current) return

    setIsLoading(true)
    setShowSuggestions(false)
    
    placesServiceRef.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['geometry', 'formatted_address', 'address_components']
      },
      (place: any, status: any) => {
        setIsLoading(false)
        
        if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place) {
          const coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
          
          const location = parseGoogleMapsResult(place, coordinates)
          updateMapLocation(location)
          setSelectedLocation(location)
          setQuery(location.address)
          onLocationSelect(location)
          
          addToast({
            type: 'success',
            title: 'Address selected',
            message: 'Location updated on map'
          })
        }
      }
    )
  }, [onLocationSelect, addToast])

  const updateMapLocation = useCallback((location: Location) => {
    if (!mapInstanceRef.current || !markerRef.current) return
    
    const { coordinates } = location
    mapInstanceRef.current.setCenter(coordinates)
    mapInstanceRef.current.setZoom(15)
    markerRef.current.setPosition(coordinates)
    setMapCenter(coordinates)
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      addToast({
        type: 'error',
        title: 'Geolocation not supported',
        message: 'Your browser does not support location access'
      })
      return
    }

    setIsLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        markerRef.current.setPosition(coordinates)
        reverseGeocode(coordinates)
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)
        let message = 'Could not access your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please allow location access in your browser.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out.'
            break
        }
        
        addToast({
          type: 'error',
          title: 'Location access failed',
          message
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [reverseGeocode, addToast])

  const parseGoogleMapsResult = (result: any, coordinates: { lat: number; lng: number }): Location => {
    const components: any = {}
    
    if (result.address_components) {
      result.address_components.forEach((component: any) => {
        const types = component.types
        if (types.includes('street_number') || types.includes('route')) {
          components.street = (components.street || '') + ' ' + component.long_name
        }
        if (types.includes('locality') || types.includes('administrative_area_level_3')) {
          components.city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          components.state = component.long_name
        }
        if (types.includes('postal_code')) {
          components.postalCode = component.long_name
        }
        if (types.includes('country')) {
          components.country = component.long_name
        }
      })
    }

    return {
      address: result.formatted_address || result.name || 'Unknown Address',
      coordinates,
      placeId: result.place_id,
      components: {
        street: components.street?.trim(),
        city: components.city,
        state: components.state,
        postalCode: components.postalCode,
        country: components.country
      }
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            className="w-full pl-10 pr-12 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
            placeholder={placeholder}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSuggestions([])
                setShowSuggestions(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-lg border border-border-subtle z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.place_id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left p-3 hover:bg-surface-elevated transition-colors border-b border-border-subtle last:border-b-0 flex items-start gap-3"
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-text-primary text-sm">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-text-muted text-xs">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Current Location Button */}
      <motion.button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
          isLoading 
            ? 'bg-surface-secondary text-text-muted border-border-subtle cursor-not-allowed'
            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
        }`}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        <Navigation className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Getting location...' : 'Use Current Location'}
      </motion.button>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-xl overflow-hidden border border-border-subtle"
          style={{ minHeight: '16rem' }}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-text-primary">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                Location Selected
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                {selectedLocation.address}
              </p>
              {selectedLocation.components?.city && selectedLocation.components?.state && (
                <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                  {selectedLocation.components.city}, {selectedLocation.components.state}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-xs text-text-muted space-y-1">
        <p>• Type your address in the search box above for suggestions</p>
        <p>• Click "Use Current Location" to automatically detect your location</p>
        <p>• Click anywhere on the map or drag the marker to set your precise location</p>
      </div>
    </div>
  )
}