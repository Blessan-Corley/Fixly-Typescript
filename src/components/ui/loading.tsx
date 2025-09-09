'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Loader2, Wrench } from 'lucide-react'
import { Logo } from './logo'
import { useEffect, useState } from 'react'

interface LoadingProps {
  variant?: 'default' | 'page' | 'overlay' | 'minimal' | 'branded'
  message?: string
  size?: 'sm' | 'md' | 'lg'
  showLogo?: boolean
}

export function Loading({ 
  variant = 'default', 
  message = 'Loading...', 
  size = 'md',
  showLogo = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  // Spinner animation variants
  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  // Pulse animation for dots
  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center gap-2">
        <motion.div
          variants={spinnerVariants}
          animate="spin"
        >
          <Loader2 className={`text-primary ${sizeClasses[size]}`} />
        </motion.div>
        {message && (
          <span className="text-text-secondary text-sm font-medium">{message}</span>
        )}
      </div>
    )
  }

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <motion.div
              variants={spinnerVariants}
              animate="spin"
            >
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-text-secondary font-medium">{message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'branded') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="lg" />
          </motion.div>
        )}
        
        {/* Animated Fixly Logo */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Wrench className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Animated dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  variants={dotVariants}
                  animate="animate"
                  transition={{ delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p 
          className="text-text-secondary font-medium text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>
      </div>
    )
  }

  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <Wrench className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h3 
              className="text-xl font-bold text-text-primary mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.h3>
            
            <motion.p 
              className="text-text-secondary text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Please wait while we prepare everything for you
            </motion.p>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 mt-6">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    backgroundColor: ['rgba(99, 102, 241, 0.3)', 'rgba(99, 102, 241, 1)', 'rgba(99, 102, 241, 0.3)']
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex items-center justify-center gap-3 p-6">
      <motion.div
        variants={spinnerVariants}
        animate="spin"
      >
        <Loader2 className={`text-primary ${sizeClasses[size]}`} />
      </motion.div>
      <p className="text-text-secondary font-medium">{message}</p>
    </div>
  )
}

// Specialized loading components for common use cases
export function PageLoading({ message = "Loading page..." }: { message?: string }) {
  return <Loading variant="page" message={message} showLogo />
}

export function OverlayLoading({ message = "Processing..." }: { message?: string }) {
  return <Loading variant="overlay" message={message} />
}

export function BrandedLoading({ message = "Initializing Fixly..." }: { message?: string }) {
  return <Loading variant="branded" message={message} showLogo />
}

export function MinimalLoading({ message, size = 'md' }: { message?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <Loading variant="minimal" message={message} size={size} />
}

// New Radial Progress Loading Components
interface RadialLoadingProps {
  size?: number
  duration?: number
  color?: string
  backgroundColor?: string
  className?: string
  onComplete?: () => void
}

export function RadialLoading({ 
  size = 120, 
  duration = 3, 
  color = 'rgb(6, 182, 212)', // cyan-500 to match your site's primary color
  backgroundColor = 'rgba(15, 23, 42, 0.95)', // dark background
  className = '',
  onComplete 
}: RadialLoadingProps) {
  const [isVisible, setIsVisible] = useState(true)
  const progress = useMotionValue(0)
  const pathLength = useTransform(progress, [0, 100], [0, 1])
  const opacity = useTransform(progress, [0, 50, 100], [0.3, 0.7, 1])
  const blur = useTransform(progress, [0, 100], [8, 0])
  
  // Calculate circle properties
  const center = size / 2
  const radius = center - 8 // Account for stroke width
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: duration,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
      onComplete: () => {
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 200)
      }
    })

    return controls.stop
  }, [progress, duration, onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      style={{ backgroundColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Progress Circle */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="6"
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={useTransform(pathLength, [0, 1], [circumference, 0])}
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>

        {/* Center Number with Blur Effect */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            filter: useTransform(blur, (v) => `blur(${v}px)`),
            opacity: opacity
          }}
        >
          <motion.span
            className="text-4xl font-bold tracking-wide"
            style={{ color }}
          >
            {useTransform(progress, (v) => Math.round(v))}
          </motion.span>
        </motion.div>

        {/* Glowing Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            opacity: useTransform(progress, [0, 100], [0.5, 1])
          }}
        />
      </div>
    </motion.div>
  )
}

// Compact version for inline use
export function RadialSpinner({ 
  size = 80, 
  duration = 2,
  color = 'rgb(6, 182, 212)',
  className = ''
}: Omit<RadialLoadingProps, 'backgroundColor' | 'onComplete'>) {
  const progress = useMotionValue(0)
  const pathLength = useTransform(progress, [0, 100], [0, 1])
  const blur = useTransform(progress, [0, 100], [4, 0])
  const opacity = useTransform(progress, [0, 50, 100], [0.4, 0.8, 1])
  
  const center = size / 2
  const radius = center - 4
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      repeat: Infinity,
      repeatType: 'restart'
    })

    return controls.stop
  }, [progress, duration])

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="4"
          fill="transparent"
        />
        
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={useTransform(pathLength, [0, 1], [circumference, 0])}
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>

      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          filter: useTransform(blur, (v) => `blur(${v}px)`),
          opacity: opacity
        }}
      >
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
        >
          {useTransform(progress, (v) => Math.round(v))}
        </motion.span>
      </motion.div>
    </div>
  )
}

// Page-level radial loading (perfect for route transitions)
export function RadialPageLoading({ 
  message = "Loading...", 
  onComplete 
}: { 
  message?: string
  onComplete?: () => void 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col items-center justify-center p-6">
      <RadialLoading 
        size={140}
        duration={3}
        color="rgb(99, 102, 241)" // Primary color from your theme
        backgroundColor="transparent"
        onComplete={onComplete}
      />
      
      <motion.p 
        className="text-text-secondary font-medium mt-8 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {message}
      </motion.p>
    </div>
  )
}