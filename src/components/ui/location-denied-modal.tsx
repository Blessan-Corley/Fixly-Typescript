'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, AlertCircle, Settings, Navigation, X } from 'lucide-react'

interface LocationDeniedModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName?: string
  onRetry: () => void
  onManualSelect: () => void
  onUseHome: () => void
  context: 'service' | 'general'
}

export function LocationDeniedModal({
  isOpen,
  onClose,
  serviceName = 'this service',
  onRetry,
  onManualSelect,
  onUseHome,
  context
}: LocationDeniedModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

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
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Location Access Needed
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {serviceName} needs your location to work properly
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

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Oops! You have rejected location access. To use {serviceName} effectively, we need to know where you are. Here are your options:
                </p>
              </div>

              <div className="space-y-3">
                {/* Enable Location */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRetry}
                  className="w-full p-4 border border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Navigation className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Enable Location Access
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow location access for the best experience. Auto-updates every 30 minutes.
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Manual Select */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onManualSelect}
                  className="w-full p-4 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Select Location Manually
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose your location from map or search. Updated manually.
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Use Home Address */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUseHome}
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                      <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Use Home Address
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use your registered address. Limited location accuracy.
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Browser Settings Help */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                      Need to change browser settings?
                    </h5>
                    <p className="text-yellow-700 dark:text-yellow-300 text-xs leading-relaxed">
                      If you previously denied location access, you may need to click the location icon in your browser's address bar and allow location for this site.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for handling location denial scenarios
export function useLocationDenialHandler() {
  const [isDenialModalOpen, setIsDenialModalOpen] = useState(false)
  const [denialContext, setDenialContext] = useState<{
    serviceName: string
    context: 'service' | 'general'
    onRetry: () => void
    onManualSelect: () => void
    onUseHome: () => void
  } | null>(null)

  const showDenialModal = (options: {
    serviceName: string
    context: 'service' | 'general'
    onRetry: () => void
    onManualSelect: () => void
    onUseHome: () => void
  }) => {
    setDenialContext(options)
    setIsDenialModalOpen(true)
  }

  const hideDenialModal = () => {
    setIsDenialModalOpen(false)
    setDenialContext(null)
  }

  return {
    isDenialModalOpen,
    showDenialModal,
    hideDenialModal,
    DenialModal: denialContext ? (
      <LocationDeniedModal
        isOpen={isDenialModalOpen}
        onClose={hideDenialModal}
        serviceName={denialContext.serviceName}
        context={denialContext.context}
        onRetry={denialContext.onRetry}
        onManualSelect={denialContext.onManualSelect}
        onUseHome={denialContext.onUseHome}
      />
    ) : null
  }
}