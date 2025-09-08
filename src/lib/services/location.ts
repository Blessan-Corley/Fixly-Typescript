import { LocationData, LocationHistory, ApproximateLocation } from '@/types'

// India geographical boundaries
export const INDIA_BOUNDARIES = {
  LAT_MIN: 6.0,
  LAT_MAX: 37.6,
  LNG_MIN: 68.0,
  LNG_MAX: 97.25
}

// Major Indian states with their coordinates for validation
export const INDIAN_STATES = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Bihar': { lat: 25.0961, lng: 85.3131 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Manipur': { lat: 24.6637, lng: 93.9063 },
  'Meghalaya': { lat: 25.4670, lng: 91.3662 },
  'Mizoram': { lat: 23.1645, lng: 92.9376 },
  'Nagaland': { lat: 26.1584, lng: 94.5624 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Sikkim': { lat: 27.5330, lng: 88.5122 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Telangana': { lat: 18.1124, lng: 79.0193 },
  'Tripura': { lat: 23.9408, lng: 91.9882 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Jammu and Kashmir': { lat: 34.0837, lng: 74.7973 },
  'Ladakh': { lat: 34.1526, lng: 77.5770 },
  'Andaman and Nicobar Islands': { lat: 11.7401, lng: 92.6586 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Dadra and Nagar Haveli and Daman and Diu': { lat: 20.1809, lng: 73.0169 },
  'Lakshadweep': { lat: 10.5667, lng: 72.6417 },
  'Puducherry': { lat: 11.9416, lng: 79.8083 }
}

export class LocationService {
  /**
   * Validates if coordinates are within India's geographical boundaries
   */
  static isWithinIndiaBounds(lat: number, lng: number): boolean {
    return (
      lat >= INDIA_BOUNDARIES.LAT_MIN && 
      lat <= INDIA_BOUNDARIES.LAT_MAX &&
      lng >= INDIA_BOUNDARIES.LNG_MIN && 
      lng <= INDIA_BOUNDARIES.LNG_MAX
    )
  }

  /**
   * Gets current GPS location with India validation
   */
  static async getCurrentLocation(): Promise<{
    coordinates: { lat: number; lng: number; accuracy: number };
    error?: string;
  }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ 
          coordinates: { lat: 0, lng: 0, accuracy: 0 }, 
          error: 'Geolocation is not supported by this browser' 
        })
        return
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes cache
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          
          // Validate location is within India
          if (!this.isWithinIndiaBounds(latitude, longitude)) {
            resolve({
              coordinates: { lat: latitude, lng: longitude, accuracy: accuracy || 0 },
              error: 'Location must be within India. Please ensure you are located in India.'
            })
            return
          }

          resolve({
            coordinates: { 
              lat: Number(latitude.toFixed(6)), 
              lng: Number(longitude.toFixed(6)), 
              accuracy: accuracy || 0 
            }
          })
        },
        (error) => {
          let errorMessage = 'Failed to get your location. '
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access denied. Please enable location permissions.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.'
              break
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.'
              break
            default:
              errorMessage += 'An unknown error occurred.'
          }

          resolve({ 
            coordinates: { lat: 0, lng: 0, accuracy: 0 }, 
            error: errorMessage 
          })
        },
        options
      )
    })
  }

  /**
   * Reverse geocode coordinates to get address details
   */
  static async reverseGeocode(lat: number, lng: number): Promise<{
    address?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    pincode?: string;
    error?: string;
  }> {
    try {
      // Using a free geocoding service (you can replace with Google Maps API)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      if (!data || !data.address) {
        return { error: 'Unable to determine address for this location' }
      }

      const address = data.address
      
      return {
        address: data.display_name,
        city: address.city || address.town || address.village || address.hamlet,
        state: address.state,
        stateCode: this.getStateCode(address.state),
        pincode: address.postcode
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return { error: 'Failed to get address details' }
    }
  }

  /**
   * Forward geocode address to get coordinates
   */
  static async forwardGeocode(address: string): Promise<{
    coordinates?: { lat: number; lng: number };
    formattedAddress?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1&countrycodes=in`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      if (!data || data.length === 0) {
        return { error: 'Address not found in India' }
      }

      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      
      // Validate coordinates are within India
      if (!this.isWithinIndiaBounds(lat, lng)) {
        return { error: 'Address must be located within India' }
      }

      return {
        coordinates: { 
          lat: Number(lat.toFixed(6)), 
          lng: Number(lng.toFixed(6)) 
        },
        formattedAddress: result.display_name
      }
    } catch (error) {
      console.error('Forward geocoding error:', error)
      return { error: 'Failed to geocode address' }
    }
  }

  /**
   * Get state code from state name
   */
  static getStateCode(stateName: string): string {
    const stateCodes: { [key: string]: string } = {
      'Andhra Pradesh': 'AP',
      'Arunachal Pradesh': 'AR',
      'Assam': 'AS',
      'Bihar': 'BR',
      'Chhattisgarh': 'CG',
      'Delhi': 'DL',
      'Goa': 'GA',
      'Gujarat': 'GJ',
      'Haryana': 'HR',
      'Himachal Pradesh': 'HP',
      'Jharkhand': 'JH',
      'Karnataka': 'KA',
      'Kerala': 'KL',
      'Madhya Pradesh': 'MP',
      'Maharashtra': 'MH',
      'Manipur': 'MN',
      'Meghalaya': 'ML',
      'Mizoram': 'MZ',
      'Nagaland': 'NL',
      'Odisha': 'OR',
      'Punjab': 'PB',
      'Rajasthan': 'RJ',
      'Sikkim': 'SK',
      'Tamil Nadu': 'TN',
      'Telangana': 'TG',
      'Tripura': 'TR',
      'Uttar Pradesh': 'UP',
      'Uttarakhand': 'UK',
      'West Bengal': 'WB',
      'Jammu and Kashmir': 'JK',
      'Ladakh': 'LA',
      'Andaman and Nicobar Islands': 'AN',
      'Chandigarh': 'CH',
      'Dadra and Nagar Haveli and Daman and Diu': 'DN',
      'Lakshadweep': 'LD',
      'Puducherry': 'PY'
    }

    return stateCodes[stateName] || stateName
  }

  /**
   * Get region from state name
   */
  static getRegionFromState(state: string): string {
    const stateToRegion: { [key: string]: string } = {
      // North India
      'Delhi': 'North India',
      'Punjab': 'North India',
      'Haryana': 'North India',
      'Himachal Pradesh': 'North India',
      'Jammu and Kashmir': 'North India',
      'Ladakh': 'North India',
      'Uttarakhand': 'North India',
      'Uttar Pradesh': 'North India',
      'Chandigarh': 'North India',
      
      // West India
      'Rajasthan': 'West India',
      'Gujarat': 'West India',
      'Maharashtra': 'West India',
      'Goa': 'West India',
      'Dadra and Nagar Haveli and Daman and Diu': 'West India',
      
      // South India
      'Karnataka': 'South India',
      'Kerala': 'South India',
      'Tamil Nadu': 'South India',
      'Andhra Pradesh': 'South India',
      'Telangana': 'South India',
      'Puducherry': 'South India',
      'Lakshadweep': 'South India',
      'Andaman and Nicobar Islands': 'South India',
      
      // East India
      'West Bengal': 'East India',
      'Odisha': 'East India',
      'Jharkhand': 'East India',
      'Bihar': 'East India',
      'Sikkim': 'East India',
      
      // Northeast India
      'Assam': 'Northeast India',
      'Arunachal Pradesh': 'Northeast India',
      'Manipur': 'Northeast India',
      'Meghalaya': 'Northeast India',
      'Mizoram': 'Northeast India',
      'Nagaland': 'Northeast India',
      'Tripura': 'Northeast India',
      
      // Central India
      'Madhya Pradesh': 'Central India',
      'Chhattisgarh': 'Central India'
    }
    
    return stateToRegion[state] || 'India'
  }

  /**
   * Calculate distance between two points in kilometers
   */
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Validate if a pincode is valid Indian format
   */
  static isValidIndianPincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode)
  }

  /**
   * Get approximate location for privacy
   */
  static getApproximateLocation(city: string, state: string): ApproximateLocation {
    return {
      city,
      state,
      region: this.getRegionFromState(state),
      lastUpdated: new Date()
    }
  }

  /**
   * Format location for display
   */
  static formatLocation(location: LocationData): string {
    const parts = []
    
    if (location.city) parts.push(location.city)
    if (location.state) parts.push(location.state)
    
    return parts.join(', ') || 'Unknown Location'
  }
}

export default LocationService