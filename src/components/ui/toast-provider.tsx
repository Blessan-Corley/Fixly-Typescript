'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration (default 5 seconds)
    const duration = toast.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    success: 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    info: 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  }

  const Icon = icons[toast.type]

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.9 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1 
      }}
      exit={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.9 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className={`glass-card p-4 rounded-xl border shadow-lg min-w-80 max-w-md ${colors[toast.type]}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium mt-2 hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <motion.button
          onClick={onRemove}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
