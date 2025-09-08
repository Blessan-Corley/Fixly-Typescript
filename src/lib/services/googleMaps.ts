// Essential Google Maps services for Fixly
// Required APIs:
// 1. Maps JavaScript API - For interactive maps
// 2. Geocoding API - For address to coordinates conversion
// 3. Places API - For place search and autocomplete
// 4. Distance Matrix API - For calculating distances between locations
// 5. Geolocation API - For user location detection

import { GoogleMapsGeocodingResult, LocationData } from '@/types'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

// Enhanced Geocoding Service
export class GeocodingService {
  private static instance: GeocodingService
  private cache = new Map<string, any>()
  private rateLimitQueue: Array<() => void> = []
  private lastRequestTime = 0
  private readonly minRequestInterval = 100 // 100ms between requests

  static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService()
    }
    return GeocodingService.instance
  }

  private async throttleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      )
    }

    this.lastRequestTime = Date.now()
    return requestFn()
  }

  // Reverse geocoding: coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
    const cacheKey = `reverse_${lat}_${lng}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const result = await this.throttleRequest(async () => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&region=IN`
        )
        return response.json()
      })

      if (result.status === 'OK' && result.results.length > 0) {
        const location = this.parseGeocodingResult(result.results[0], lat, lng)
        this.cache.set(cacheKey, location)
        return location
      }

      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  // Forward geocoding: address to coordinates
  async geocode(address: string): Promise<LocationData | null> {
    const cacheKey = `forward_${address.toLowerCase()}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const result = await this.throttleRequest(async () => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}&region=IN&components=country:IN`
        )
        return response.json()
      })

      if (result.status === 'OK' && result.results.length > 0) {
        const bestResult = result.results[0]
        const location = this.parseGeocodingResult(
          bestResult,
          bestResult.geometry.location.lat,
          bestResult.geometry.location.lng
        )
        this.cache.set(cacheKey, location)
        return location
      }

      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  private parseGeocodingResult(result: GoogleMapsGeocodingResult, lat: number, lng: number): LocationData {
    const components = result.address_components
    let city = '', state = '', stateCode = '', pincode = ''

    components.forEach(component => {
      const types = component.types
      
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name
      }
      
      if (types.includes('administrative_area_level_1')) {
        state = component.long_name
        stateCode = component.short_name
      }
      
      if (types.includes('postal_code')) {
        pincode = component.long_name
      }
    })

    return {
      type: 'gps',
      coordinates: {
        lat,
        lng,
        accuracy: result.geometry.location_type === 'ROOFTOP' ? 10 : 100
      },
      address: result.formatted_address,
      city: city || 'Unknown',
      state: state || 'Unknown',
      stateCode: stateCode || 'XX',
      pincode,
      timestamp: new Date()
    }
  }

  // Get current location using browser API with Google fallback
  async getCurrentLocation(): Promise<LocationData | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords
          
          try {
            // Use Google Geocoding for address details
            const locationData = await this.reverseGeocode(latitude, longitude)
            
            if (locationData) {
              locationData.coordinates!.accuracy = accuracy
              resolve(locationData)
            } else {
              // Fallback location data without address details
              resolve({
                type: 'gps',
                coordinates: { lat: latitude, lng: longitude, accuracy },
                city: 'Unknown',
                state: 'Unknown',
                stateCode: 'XX',
                timestamp: new Date()
              })
            }
          } catch (error) {
            reject(error)
          }
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }
}

// Places Autocomplete Service
export class PlacesService {
  private static instance: PlacesService
  private sessionToken: string = ''

  static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService()
    }
    return PlacesService.instance
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Search places with autocomplete
  async searchPlaces(input: string, location?: { lat: number; lng: number }): Promise<any[]> {
    if (!input || input.length < 3) return []

    try {
      this.sessionToken = this.generateSessionToken()
      
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}&sessiontoken=${this.sessionToken}&components=country:in&types=(cities)`

      if (location) {
        url += `&location=${location.lat},${location.lng}&radius=50000` // 50km radius
      }

      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 'OK') {
        return result.predictions.map((prediction: any) => ({
          placeId: prediction.place_id,
          description: prediction.description,
          mainText: prediction.structured_formatting.main_text,
          secondaryText: prediction.structured_formatting.secondary_text,
          types: prediction.types
        }))
      }

      return []
    } catch (error) {
      console.error('Places search error:', error)
      return []
    }
  }

  // Get place details
  async getPlaceDetails(placeId: string): Promise<LocationData | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&sessiontoken=${this.sessionToken}&fields=address_components,formatted_address,geometry`
      )
      const result = await response.json()

      if (result.status === 'OK' && result.result) {
        const place = result.result
        const components = place.address_components
        let city = '', state = '', stateCode = '', pincode = ''

        components.forEach((component: any) => {
          const types = component.types
          
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            city = component.long_name
          }
          
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name
            stateCode = component.short_name
          }
          
          if (types.includes('postal_code')) {
            pincode = component.long_name
          }
        })

        return {
          type: 'manual',
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          address: place.formatted_address,
          city: city || 'Unknown',
          state: state || 'Unknown',
          stateCode: stateCode || 'XX',
          pincode,
          timestamp: new Date()
        }
      }

      return null
    } catch (error) {
      console.error('Place details error:', error)
      return null
    }
  }
}

// Distance calculation service
export class DistanceService {
  private static instance: DistanceService

  static getInstance(): DistanceService {
    if (!DistanceService.instance) {
      DistanceService.instance = new DistanceService()
    }
    return DistanceService.instance
  }

  // Calculate distance between two points using Haversine formula
  calculateHaversineDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Get precise distance and duration using Google Distance Matrix API
  async getDistanceMatrix(
    origins: Array<{ lat: number; lng: number }>,
    destinations: Array<{ lat: number; lng: number }>,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): Promise<any> {
    try {
      const originsStr = origins.map(o => `${o.lat},${o.lng}`).join('|')
      const destinationsStr = destinations.map(d => `${d.lat},${d.lng}`).join('|')

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsStr}&destinations=${destinationsStr}&mode=${mode}&units=metric&key=${GOOGLE_MAPS_API_KEY}`
      )
      
      const result = await response.json()
      
      if (result.status === 'OK') {
        return result
      }
      
      return null
    } catch (error) {
      console.error('Distance Matrix error:', error)
      return null
    }
  }

  // Find nearby fixers within radius
  async findNearbyFixers(
    userLocation: { lat: number; lng: number },
    radiusKm: number = 25
  ): Promise<Array<{ distance: number; duration?: string; fixer: any }>> {
    // This would integrate with your user database
    // For now, returning mock data structure
    return []
  }
}

// Map utilities
export class MapUtils {
  static createMapOptions(center: { lat: number; lng: number }): google.maps.MapOptions {
    return {
      zoom: 13,
      center,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    }
  }

  static createMarker(
    map: google.maps.Map,
    position: { lat: number; lng: number },
    title?: string,
    icon?: string
  ): google.maps.Marker {
    return new google.maps.Marker({
      position,
      map,
      title,
      icon: icon || {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="8" fill="#6366F1" stroke="#FFFFFF" stroke-width="2"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      }
    })
  }

  static createInfoWindow(content: string): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; font-family: system-ui;">
          ${content}
        </div>
      `
    })
  }

  static fitBounds(map: google.maps.Map, locations: Array<{ lat: number; lng: number }>): void {
    const bounds = new google.maps.LatLngBounds()
    
    locations.forEach(location => {
      bounds.extend(new google.maps.LatLng(location.lat, location.lng))
    })
    
    map.fitBounds(bounds)
  }
}

// Singleton services
export const geocodingService = GeocodingService.getInstance()
export const placesService = PlacesService.getInstance()
export const distanceService = DistanceService.getInstance()

// Location permission helper
export async function requestLocationPermission(): Promise<boolean> {
  if (!navigator.permissions) return false

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    return permission.state === 'granted'
  } catch (error) {
    return false
  }
}

// Check if location is in India (for service area validation)
export function isLocationInIndia(lat: number, lng: number): boolean {
  // Rough bounding box for India
  const indiaBounds = {
    north: 37.6,
    south: 6.4,
    east: 97.25,
    west: 68.7
  }

  return lat >= indiaBounds.south && 
         lat <= indiaBounds.north && 
         lng >= indiaBounds.west && 
         lng <= indiaBounds.east
}