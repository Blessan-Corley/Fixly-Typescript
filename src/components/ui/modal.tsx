'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  className?: string
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleBackdropClick}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative w-full ${sizeClasses[size]} glass-card rounded-2xl shadow-2xl overflow-hidden ${className}`}
            initial={{ 
              opacity: 0, 
              scale: 0.95,
              y: 20 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              y: 20 
            }}
            transition={{ 
              duration: 0.3, 
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                {title && (
                  <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-surface-elevated transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-text-muted hover:text-text-primary transition-colors" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: ConfirmModalProps) {
  const variantStyles = {
    default: 'from-primary to-accent',
    danger: 'from-error to-red-600',
    warning: 'from-warning to-orange-600'
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
          <p className="text-text-secondary">{message}</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-2 glass rounded-xl border border-border-subtle hover:shadow-glass-hover transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cancelText}
          </motion.button>
          <motion.button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-2 bg-gradient-to-r ${variantStyles[variant]} text-white rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}