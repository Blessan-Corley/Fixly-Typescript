'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RadialLoading, RadialSpinner, RadialPageLoading } from '@/components/ui/loading'

export default function TestLoadingPage() {
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showPageLoading, setShowPageLoading] = useState(false)

  if (showPageLoading) {
    return (
      <RadialPageLoading 
        message="Loading your dashboard..." 
        onComplete={() => setShowPageLoading(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            🔥 Radial Loading Components
          </h1>
          <p className="text-text-secondary mb-8">
            Beautiful radial progress loaders with blur effects, just like the Motion.dev example but with your website's colors!
          </p>

          <div className="space-y-8">
            {/* Inline Spinners */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Inline Radial Spinners</h2>
              
              <div className="flex flex-wrap items-center gap-8 p-6 glass rounded-xl">
                <div className="text-center space-y-2">
                  <RadialSpinner size={60} duration={2} />
                  <p className="text-sm text-text-secondary">Small (60px)</p>
                </div>
                
                <div className="text-center space-y-2">
                  <RadialSpinner size={80} duration={2.5} />
                  <p className="text-sm text-text-secondary">Medium (80px)</p>
                </div>
                
                <div className="text-center space-y-2">
                  <RadialSpinner size={100} duration={3} />
                  <p className="text-sm text-text-secondary">Large (100px)</p>
                </div>

                {/* With custom colors */}
                <div className="text-center space-y-2">
                  <RadialSpinner 
                    size={80} 
                    duration={2} 
                    color="rgb(168, 85, 247)" // Purple accent
                  />
                  <p className="text-sm text-text-secondary">Purple Accent</p>
                </div>

                <div className="text-center space-y-2">
                  <RadialSpinner 
                    size={80} 
                    duration={2.5} 
                    color="rgb(6, 182, 212)" // Cyan (original)
                  />
                  <p className="text-sm text-text-secondary">Cyan (Original)</p>
                </div>
              </div>
            </div>

            {/* Interactive Demos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Interactive Demos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="h-16 text-lg px-6 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300"
                >
                  🌟 Show Fullscreen Radial Loading
                </button>
                
                <button
                  onClick={() => setShowPageLoading(true)}
                  className="h-16 text-lg px-6 glass border border-border rounded-xl font-semibold hover:shadow-glass-hover transition-all duration-300"
                >
                  📄 Show Page-Level Loading
                </button>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Perfect Use Cases</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl">
                  <h3 className="font-semibold text-text-primary mb-2">🚀 Page Transitions</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Use RadialPageLoading for smooth transitions between pages
                  </p>
                  <div className="flex justify-center">
                    <RadialSpinner size={50} duration={2} />
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <h3 className="font-semibold text-text-primary mb-2">⚡ API Calls</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Show RadialSpinner during data fetching operations
                  </p>
                  <div className="flex justify-center">
                    <RadialSpinner size={50} duration={1.8} />
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <h3 className="font-semibold text-text-primary mb-2">🎯 Form Submissions</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    Perfect for signup/signin form processing states
                  </p>
                  <div className="flex justify-center">
                    <RadialSpinner size={50} duration={2.2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Comparison */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Color Options</h2>
              <div className="glass p-6 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <RadialSpinner size={60} color="rgb(99, 102, 241)" duration={2} />
                    <p className="text-xs text-text-secondary">Primary Purple<br/>(Current)</p>
                  </div>
                  <div className="space-y-2">
                    <RadialSpinner size={60} color="rgb(6, 182, 212)" duration={2.2} />
                    <p className="text-xs text-text-secondary">Cyan<br/>(Original)</p>
                  </div>
                  <div className="space-y-2">
                    <RadialSpinner size={60} color="rgb(168, 85, 247)" duration={2.4} />
                    <p className="text-xs text-text-secondary">Purple Accent<br/>(Alternative)</p>
                  </div>
                  <div className="space-y-2">
                    <RadialSpinner size={60} color="rgb(16, 185, 129)" duration={2.6} />
                    <p className="text-xs text-text-secondary">Emerald<br/>(Success)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Radial Loading Overlay */}
      {showFullscreen && (
        <RadialLoading
          size={140}
          duration={3}
          onComplete={() => setShowFullscreen(false)}
        />
      )}
    </div>
  )
}