'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { ReactNode } from 'react'

// ========== LOADING COMPONENTS ==========

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'muted'
}

export function Spinner({ size = 'md', className = '', color = 'primary' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    muted: 'text-slate-400'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  )
}

// Skeleton Loading Components
interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  const baseClasses = "bg-slate-200 rounded-lg"
  const animationClasses = animate ? "animate-pulse" : ""
  
  return <div className={`${baseClasses} ${animationClasses} ${className}`} />
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  hasImage?: boolean
  hasAvatar?: boolean
  className?: string
}

export function SkeletonCard({ hasImage = false, hasAvatar = false, className = '' }: SkeletonCardProps) {
  return (
    <div className={`glass-card p-6 rounded-xl ${className}`}>
      {hasImage && <Skeleton className="w-full h-48 mb-4" />}
      <div className="flex items-start space-x-4">
        {hasAvatar && <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  )
}

// ========== FULL-PAGE LOADERS ==========

interface PageLoaderProps {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PageLoader({ title = "Loading", description, size = 'md' }: PageLoaderProps) {
  const sizeClasses = {
    sm: { spinner: 'w-8 h-8', title: 'text-lg', desc: 'text-sm' },
    md: { spinner: 'w-12 h-12', title: 'text-xl', desc: 'text-base' },
    lg: { spinner: 'w-16 h-16', title: 'text-2xl', desc: 'text-lg' }
  }

  const classes = sizeClasses[size]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`${classes.spinner} text-slate-600 mx-auto mb-4`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
        <motion.h2
          className={`${classes.title} font-semibold text-slate-900 mb-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            className={`${classes.desc} text-slate-600`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

// Inline loading state for components
interface InlineLoaderProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineLoader({ text = "Loading...", size = 'md', className = '' }: InlineLoaderProps) {
  const sizeClasses = {
    sm: { spinner: 'w-4 h-4', text: 'text-sm' },
    md: { spinner: 'w-5 h-5', text: 'text-base' },
    lg: { spinner: 'w-6 h-6', text: 'text-lg' }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`flex items-center justify-center gap-2 p-4 ${className}`}>
      <motion.div
        className={`${classes.spinner} text-slate-600`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      <span className={`${classes.text} text-slate-700 font-medium`}>
        {text}
      </span>
    </div>
  )
}

// ========== STATUS INDICATORS ==========

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'info'
  title: string
  description?: string
  className?: string
}

export function StatusIndicator({ status, title, description, className = '' }: StatusIndicatorProps) {
  const statusConfig = {
    loading: {
      icon: Loader2,
      iconClass: 'text-slate-600 animate-spin',
      bgClass: 'bg-slate-100',
      borderClass: 'border-slate-300',
      titleClass: 'text-slate-900',
      descClass: 'text-slate-600'
    },
    success: {
      icon: CheckCircle,
      iconClass: 'text-green-600',
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      titleClass: 'text-green-900',
      descClass: 'text-green-700'
    },
    error: {
      icon: AlertCircle,
      iconClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      titleClass: 'text-red-900',
      descClass: 'text-red-700'
    },
    info: {
      icon: Info,
      iconClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      titleClass: 'text-blue-900',
      descClass: 'text-blue-700'
    }
  }

  const config = statusConfig[status]
  const IconComponent = config.icon

  return (
    <motion.div
      className={`p-4 rounded-xl border ${config.bgClass} ${config.borderClass} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 ${config.iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`font-medium ${config.titleClass}`}>{title}</h4>
          {description && (
            <p className={`text-sm mt-1 ${config.descClass}`}>{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ========== PROGRESSIVE LOADING ==========

interface ProgressLoaderProps {
  progress: number
  title?: string
  className?: string
}

export function ProgressLoader({ progress, title = "Loading...", className = '' }: ProgressLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{title}</span>
          <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-slate-900 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// ========== LOADING WRAPPER ==========

interface LoadingWrapperProps {
  isLoading: boolean
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export function LoadingWrapper({ isLoading, children, fallback, className = '' }: LoadingWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback || <InlineLoader />}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== BUTTON LOADING STATES ==========

interface LoadingButtonProps {
  isLoading: boolean
  disabled?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingButton({ 
  isLoading, 
  disabled, 
  children, 
  className = '', 
  onClick,
  variant = 'primary',
  size = 'md'
}: LoadingButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 disabled:bg-slate-300 disabled:text-slate-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400 border border-slate-300",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-400 disabled:text-slate-400"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }

  const spinnerSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Loader2 className={`${spinnerSizes[size]} animate-spin`} />
            <span>Loading...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}