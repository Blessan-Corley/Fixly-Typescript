'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl', 
  xl: 'text-3xl'
}

export function Logo({ 
  className = "", 
  showText = true, 
  size = 'md',
  animated = true 
}: LogoProps) {
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const textVariants = {
    initial: { x: -10, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  }

  const LogoIcon = () => (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-2xl",
        "bg-gradient-to-br from-primary to-accent shadow-glow-primary",
        sizeClasses[size]
      )}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-xl" />
      
      {/* F Letter */}
      <div className={cn(
        "relative font-black text-white font-mono",
        size === 'sm' && "text-sm",
        size === 'md' && "text-lg",
        size === 'lg' && "text-xl",
        size === 'xl' && "text-2xl"
      )}>
        F
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
    </motion.div>
  )

  if (!showText) {
    return (
      <div className={cn("group cursor-pointer", className)}>
        <LogoIcon />
      </div>
    )
  }

  return (
    <motion.div
      className={cn("flex items-center gap-3 group cursor-pointer", className)}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
    >
      <LogoIcon />
      
      <motion.div
        variants={animated ? textVariants : undefined}
        className={cn(
          "font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
          textSizeClasses[size]
        )}
      >
        Fixly
      </motion.div>
    </motion.div>
  )
}

export function LogoMark({ className = "", size = 'md' }: { className?: string, size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <Logo className={className} size={size} showText={false} />
}