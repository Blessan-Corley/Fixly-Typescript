'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
        <div className="w-5 h-5 bg-slate-300 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-xl glass-card hover:shadow-elevated border-0 bg-surface/80 hover:bg-surface-elevated/90 transition-all duration-200 flex items-center justify-center group"
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      title={`Current: ${theme}. Click to switch.`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.8, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.3
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors" />
        ) : (
          <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors" />
        )}
      </motion.div>
    </motion.button>
  )
}

// Simplified ThemeSelector - only day/night toggle
export function ThemeSelector() {
  return <ThemeToggle />
}