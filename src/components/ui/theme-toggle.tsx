'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Load theme from cookie on mount
    const savedTheme = getCookie('fixly-theme')
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      // Default to light theme for new users
      setTheme('light')
      setCookie('fixly-theme', 'light')
    }
  }, [])

  React.useEffect(() => {
    // Save theme to cookie when it changes
    if (mounted && theme && (theme === 'light' || theme === 'dark')) {
      setCookie('fixly-theme', theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setTheme(newTheme)
    setCookie('fixly-theme', newTheme)
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 hover:shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Toggle slider */}
      <motion.div
        className="relative w-5 h-5 bg-white dark:bg-gray-100 rounded-full shadow-lg flex items-center justify-center z-10"
        animate={{
          x: isDark ? 26 : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 180
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Moon className="w-3 h-3 text-blue-600" />
        </motion.div>
        
        <motion.div
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 180 : 0
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sun className="w-3 h-3 text-yellow-500" />
        </motion.div>
      </motion.div>
      
      {/* Background icons */}
      <Sun className="absolute left-1 w-3 h-3 text-yellow-400/30 dark:text-gray-600" />
      <Moon className="absolute right-1 w-3 h-3 text-gray-600 dark:text-blue-400/60" />
    </motion.button>
  )
}

// Simplified ThemeSelector - only day/night toggle
export function ThemeSelector() {
  return <ThemeToggle />
}