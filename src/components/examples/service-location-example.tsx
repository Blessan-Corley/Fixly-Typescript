'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Wrench, Zap, Clock } from 'lucide-react'
import { useLocation } from '@/components/providers/location-provider'

// Example service component showing how to use location system
export function ServiceLocationExample() {
  const { 
    handleServiceLocationRequest, 
    permissionStatus, 
    isAutoUpdateActive,
    currentLocation,
    homeAddress
  } = useLocation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [locationResult, setLocationResult] = useState<any>(null)

  const handleServiceRequest = async (serviceName: string) => {
    setIsLoading(true)
    setLocationResult(null)
    
    try {
      const result = await handleServiceLocationRequest(serviceName)
      setLocationResult(result)
      
      if (!result.error) {
        // Success! Service can now use location
        console.log(`${serviceName} can now access location:`, result.location)
      } else if (result.error === 'location_denied') {
        // User chose fallback option
        console.log(`${serviceName} using fallback:`, result.fallback)
      }
    } catch (error) {
      console.error('Service location request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const services = [
    { name: 'Plumbing Service', icon: Wrench, color: 'blue' },
    { name: 'Electrical Service', icon: Zap, color: 'yellow' },
    { name: 'Cleaning Service', icon: Clock, color: 'green' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Status Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Location System Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Permission Status:</span>
            <div className={`font-medium capitalize ${
              permissionStatus === 'always' ? 'text-green-600' :
              permissionStatus === 'session' ? 'text-blue-600' :
              permissionStatus === 'denied' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {permissionStatus === 'not_requested' ? 'Not Requested' : permissionStatus}
            </div>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Auto-Update:</span>
            <div className={`font-medium ${
              isAutoUpdateActive ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isAutoUpdateActive ? 'Active (30 mins)' : 'Inactive'}
            </div>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current Location:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {currentLocation ? 'Available' : 'Not Available'}
            </div>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Home Address:</span>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {homeAddress ? 'Available' : 'Not Set'}
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Test Location Requests
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click on any service to see how the location permission system works:
        </p>
        
        <div className="grid gap-3">
          {services.map((service) => (
            <motion.button
              key={service.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServiceRequest(service.name)}
              disabled={isLoading}
              className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                service.color === 'blue' ? 'border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20' :
                service.color === 'yellow' ? 'border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/20' :
                'border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <service.icon className={`w-6 h-6 ${
                  service.color === 'blue' ? 'text-blue-600' :
                  service.color === 'yellow' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Request {service.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tap to see location permission flow
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {locationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Location Result
          </h4>
          
          {locationResult.error ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="font-medium text-red-800 dark:text-red-200">
                Error: {locationResult.error}
              </div>
              {locationResult.message && (
                <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {locationResult.message}
                </div>
              )}
              {locationResult.fallback && (
                <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Fallback: Using {locationResult.fallback} address
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="font-medium text-green-800 dark:text-green-200 mb-2">
                ✅ Location Access Granted
              </div>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Source:</span>{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {locationResult.source || 'current'}
                  </span>
                </div>
                {locationResult.location && (
                  <>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>{' '}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {locationResult.location.address || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">City:</span>{' '}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {locationResult.location.city || 'N/A'}
                      </span>
                    </div>
                    {locationResult.location.coordinates && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>{' '}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {locationResult.location.coordinates.lat.toFixed(4)}, {locationResult.location.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}