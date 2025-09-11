// Location Service for automatic updates and permission management
export class LocationService {
  private static instance: LocationService
  private updateInterval: number = 30 * 60 * 1000 // 30 minutes in ms
  private intervalId: NodeJS.Timeout | null = null
  private permissionStatus: 'always' | 'session' | 'denied' | 'not_requested' = 'not_requested'
  private sessionExpiry: Date | null = null
  private isInitialized = false

  private constructor() {
    this.initialize()
  }

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  private async initialize() {
    if (typeof window === 'undefined') return // Server-side
    
    try {
      // Get current permission status from server
      const response = await fetch('/api/user/location/permission', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        this.permissionStatus = data.permission.status
        this.sessionExpiry = data.permission.sessionExpiry ? new Date(data.permission.sessionExpiry) : null
        
        // Start auto-update if permission allows
        if (this.shouldAutoUpdate()) {
          this.startAutoUpdate()
        }
      }
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize location service:', error)
    }
  }

  private shouldAutoUpdate(): boolean {
    const now = new Date()
    
    if (this.permissionStatus === 'always') {
      return true
    }
    
    if (this.permissionStatus === 'session' && this.sessionExpiry && now <= this.sessionExpiry) {
      return true
    }
    
    return false
  }

  private startAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    
    // Initial update
    this.updateCurrentLocation()
    
    // Set up recurring updates
    this.intervalId = setInterval(() => {
      if (this.shouldAutoUpdate()) {
        this.updateCurrentLocation()
      } else {
        this.stopAutoUpdate()
      }
    }, this.updateInterval)
    
    console.log('🌍 Location auto-update started (every 30 minutes)')
  }

  private stopAutoUpdate() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('🌍 Location auto-update stopped')
    }
  }

  private async updateCurrentLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported')
      return
    }

    try {
      const position = await this.getCurrentPosition()
      
      await fetch('/api/user/location/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          method: 'gps'
        })
      })
      
      console.log('🌍 Location updated successfully')
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('locationUpdated', {
        detail: { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        }
      }))
      
    } catch (error) {
      console.error('Failed to update location:', error)
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5 * 60 * 1000 // 5 minutes
        }
      )
    })
  }

  // Public methods

  async requestPermission(context?: 'service' | 'general' | 'first_time', serviceName?: string): Promise<'always' | 'session' | 'never'> {
    // This would trigger the permission modal
    // For now, return a promise that resolves when user makes choice
    return new Promise((resolve) => {
      // Dispatch event to show permission modal
      window.dispatchEvent(new CustomEvent('requestLocationPermission', {
        detail: { context, serviceName, callback: resolve }
      }))
    })
  }

  async updatePermission(permission: 'always' | 'session' | 'never'): Promise<boolean> {
    try {
      const response = await fetch('/api/user/location/permission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ permission })
      })
      
      if (response.ok) {
        const data = await response.json()
        this.permissionStatus = data.permission.status
        this.sessionExpiry = data.permission.sessionExpiry ? new Date(data.permission.sessionExpiry) : null
        
        if (permission === 'never') {
          this.stopAutoUpdate()
        } else {
          this.startAutoUpdate()
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to update permission:', error)
      return false
    }
  }

  async getCurrentLocation(): Promise<any> {
    try {
      const response = await fetch('/api/user/location/current', {
        credentials: 'include'
      })
      
      if (response.ok) {
        return await response.json()
      }
      
      return null
    } catch (error) {
      console.error('Failed to get current location:', error)
      return null
    }
  }

  getPermissionStatus(): 'always' | 'session' | 'denied' | 'not_requested' {
    return this.permissionStatus
  }

  isAutoUpdateActive(): boolean {
    return this.intervalId !== null
  }

  // Method to handle service detection and location request
  async handleServiceRequest(serviceName: string): Promise<any> {
    const currentLocation = await this.getCurrentLocation()
    
    // If we have current location and permission, return it
    if (currentLocation?.location && this.shouldAutoUpdate()) {
      return currentLocation
    }
    
    // If location is denied or expired, show appropriate message
    if (this.permissionStatus === 'denied') {
      return {
        error: 'location_denied',
        message: `Oops! You have rejected location access. To use ${serviceName}, please allow location access or manually select your location.`,
        fallback: 'home'
      }
    }
    
    // If session expired or not requested, ask for permission
    const permission = await this.requestPermission('service', serviceName)
    
    if (permission === 'never') {
      return {
        error: 'location_denied',
        message: `To use ${serviceName} effectively, we need your location. You can manually select your location or enable GPS access.`,
        fallback: 'home'
      }
    }
    
    // Permission granted, get fresh location
    return await this.getCurrentLocation()
  }

  // Cleanup method
  destroy() {
    this.stopAutoUpdate()
    this.isInitialized = false
  }
}

// React Hook for using location service
export function useLocationService() {
  const locationService = LocationService.getInstance()
  
  return {
    requestPermission: locationService.requestPermission.bind(locationService),
    getCurrentLocation: locationService.getCurrentLocation.bind(locationService),
    handleServiceRequest: locationService.handleServiceRequest.bind(locationService),
    getPermissionStatus: locationService.getPermissionStatus.bind(locationService),
    isAutoUpdateActive: locationService.isAutoUpdateActive.bind(locationService)
  }
}

// Global instance for convenience
export const locationService = LocationService.getInstance()