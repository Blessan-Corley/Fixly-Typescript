'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-red-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-orange-200/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-200/20 rounded-full blur-lg" />
      </div>

      <motion.div
        className="max-w-2xl w-full text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Icon */}
        <motion.div 
          className="mb-8"
          animate={pulseAnimation}
        >
          <motion.div 
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            variants={itemVariants}
          >
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-lg text-slate-600 mb-2 max-w-lg mx-auto">
            We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
          </p>
          
          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="mt-6 p-4 bg-red-50 rounded-xl text-left max-w-lg mx-auto"
              variants={itemVariants}
            >
              <p className="text-sm text-red-800 font-mono break-all">
                <strong>Error:</strong> {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 btn-hover min-w-40"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 btn-hover min-w-40"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Error Report */}
        <motion.div 
          className="mt-12 pt-8 border-t border-slate-200"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Need immediate help?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link href="/contact">
              <motion.div
                className="p-4 glass-card rounded-xl hover:shadow-lg transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <MessageSquare className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Contact Support
                </p>
              </motion.div>
            </Link>

            <Link href="/help">
              <motion.div
                className="p-4 glass-card rounded-xl hover:shadow-lg transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <motion.div
                  className="w-6 h-6 bg-slate-600 group-hover:bg-slate-900 transition-colors mx-auto mb-2 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-xs text-white font-bold">?</span>
                </motion.div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Help Center
                </p>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Technical info */}
        <motion.div
          className="mt-8 text-xs text-slate-400 font-mono space-y-1"
          variants={itemVariants}
        >
          <div>ERROR_TYPE: RUNTIME_ERROR</div>
          <div>TIMESTAMP: {new Date().toISOString()}</div>
          {error.digest && <div>REF: {error.digest.slice(0, 8)}</div>}
        </motion.div>
      </motion.div>
    </div>
  )
}