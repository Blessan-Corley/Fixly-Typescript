'use client'

import { useEffect, useState, memo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  className?: string
  height?: number
  showPercentage?: boolean
}

export const ScrollProgress = memo(function ScrollProgress({ 
  className = '',
  height = 3,
  showPercentage = false 
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Spring animation for smooth progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Show progress bar only when user starts scrolling
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsVisible(latest > 0.01) // Show after 1% scroll
    })
    return unsubscribe
  }, [scrollYProgress])

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress Bar Background */}
      <div 
        className="w-full bg-border-glass/20 dark:bg-border-glass/10"
        style={{ height: `${height}px` }}
      >
        {/* Progress Bar Fill */}
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x"
          style={{ 
            scaleX,
            background: 'linear-gradient(90deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 50%, rgb(99, 102, 241) 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradient-x 3s ease infinite'
          }}
        />
      </div>

      {/* Optional Percentage Display */}
      {showPercentage && (
        <motion.div
          className="absolute top-2 right-4 text-xs font-medium text-text-secondary dark:text-text-muted px-2 py-1 rounded-full glass-card"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.div>
      )}
    </motion.div>
  )
})

// Gradient animation keyframes (add to global CSS)
export const scrollProgressStyles = `
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`

// Compact version for minimal pages
export const MinimalScrollProgress = memo(function MinimalScrollProgress({ 
  height = 2 
}: { height?: number }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: `${height}px` }}
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-primary to-accent"
        style={{ scaleX }}
      />
    </motion.div>
  )
})

// Reading progress for blog/article pages
export const ReadingProgress = memo(function ReadingProgress({ 
  targetRef,
  className = ''
}: { 
  targetRef?: React.RefObject<HTMLElement>
  className?: string 
}) {
  const [readingProgress, setReadingProgress] = useState(0)
  
  useEffect(() => {
    const updateReadingProgress = () => {
      const element = targetRef?.current
      if (!element) {
        // Fallback to document body
        const scrolled = window.scrollY
        const total = document.body.scrollHeight - window.innerHeight
        setReadingProgress(Math.min(scrolled / total, 1))
        return
      }

      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      const start = elementTop - windowHeight
      const end = elementTop + elementHeight
      const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)))
      
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', updateReadingProgress)
    updateReadingProgress()
    
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [targetRef])

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 h-1 ${className}`}
    >
      <div className="w-full h-full bg-border-glass/20 dark:bg-border-glass/10">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${readingProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        />
      </div>
    </motion.div>
  )
})