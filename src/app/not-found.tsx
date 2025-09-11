'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

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

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-slate-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-slate-300/20 rounded-full blur-lg" />
      </div>

      <motion.div
        className="max-w-2xl w-full text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Illustration */}
        <motion.div 
          className="mb-8"
          animate={floatingAnimation}
        >
          <motion.div 
            className="text-8xl md:text-9xl font-bold text-slate-300 mb-4"
            variants={itemVariants}
          >
            404
          </motion.div>
          <motion.div
            className="w-32 h-1 bg-slate-900 mx-auto rounded-full"
            variants={itemVariants}
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, it happens to the best of us!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 btn-hover min-w-40"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </motion.button>

          <Link href="/">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 btn-hover min-w-40"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              Home Page
            </motion.button>
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div 
          className="mt-12 pt-8 border-t border-slate-200"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Maybe you're looking for:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/services">
              <motion.div
                className="p-4 glass-card rounded-xl hover:shadow-lg transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Search className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Find Services
                </p>
              </motion.div>
            </Link>

            <Link href="/help">
              <motion.div
                className="p-4 glass-card rounded-xl hover:shadow-lg transition-all duration-200 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <HelpCircle className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Help Center
                </p>
              </motion.div>
            </Link>

            <Link href="/contact">
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
                  Contact Us
                </p>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Error Code for Developers */}
        <motion.div
          className="mt-8 text-xs text-slate-400 font-mono"
          variants={itemVariants}
        >
          ERROR_CODE: 404_PAGE_NOT_FOUND
        </motion.div>
      </motion.div>
    </div>
  )
}