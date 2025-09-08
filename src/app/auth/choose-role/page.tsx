'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserCheck, 
  Wrench, 
  ArrowRight, 
  Home, 
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<'hirer' | 'fixer' | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/signup?role=${selectedRole}`)
    }
  }

  const roles = [
    {
      type: 'hirer' as const,
      title: 'Hire Services',
      slogan: 'Get Your Job Done',
      description: 'Find skilled professionals for all your home and service needs',
      icon: UserCheck,
      gradient: 'from-primary to-primary-600',
      glowColor: 'shadow-glow-primary',
      features: [
        'Browse verified professionals',
        'Compare quotes and reviews', 
        'Secure payment protection',
        'Quality guarantee'
      ]
    },
    {
      type: 'fixer' as const,
      title: 'Offer Services', 
      slogan: 'Start Earning Today',
      description: 'Showcase your skills and connect with customers who need your expertise',
      icon: Wrench,
      gradient: 'from-accent to-accent-600',
      glowColor: 'shadow-glow-accent',
      features: [
        'Set your own rates',
        'Build your reputation',
        'Flexible working hours',
        'Grow your business'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warning/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Choose Your Path
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Whether you're looking to hire skilled professionals or offer your services, 
              we've got you covered with the perfect platform for your needs.
            </p>
          </motion.div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {roles.map((role, index) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.type
            
            return (
              <motion.div
                key={role.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative cursor-pointer group`}
                onClick={() => setSelectedRole(role.type)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`glass-card p-8 rounded-3xl border-2 transition-all duration-300 ${
                  isSelected 
                    ? `border-${role.type === 'hirer' ? 'primary' : 'accent'} ${role.glowColor}` 
                    : 'border-border-glass hover:border-border'
                }`}>
                  {/* Role Icon */}
                  <div className={`inline-flex p-4 rounded-2xl mb-6 bg-gradient-to-br ${role.gradient} text-white ${role.glowColor}`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Role Info */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                      {role.title}
                    </h2>
                    <div className={`text-xl font-semibold mb-3 bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
                      {role.slogan}
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {role.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="flex items-center gap-3 text-sm text-text-secondary"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center`}>
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center text-white shadow-lg`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
              selectedRole
                ? `bg-gradient-to-r ${selectedRole === 'hirer' ? 'from-primary to-primary-600 shadow-glow-primary hover:shadow-glow-lg' : 'from-accent to-accent-600 shadow-glow-accent hover:shadow-glow-lg'}`
                : 'bg-muted text-text-muted cursor-not-allowed'
            }`}
            whileHover={selectedRole ? { scale: 1.05, y: -2 } : {}}
            whileTap={selectedRole ? { scale: 0.95 } : {}}
          >
            <div className="flex items-center gap-3">
              <span>Continue as {selectedRole === 'hirer' ? 'Hirer' : selectedRole === 'fixer' ? 'Fixer' : 'User'}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>

          <p className="text-text-muted text-sm mt-4">
            You can change your role preferences later in your profile settings
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Star, label: '4.9 Rating', value: '50K+ Reviews' },
            { icon: TrendingUp, label: 'Growing Fast', value: '10K+ Professionals' },
            { icon: Shield, label: 'Secure', value: '100% Protected' },
            { icon: Zap, label: 'Quick Match', value: 'Under 2 Minutes' }
          ].map((stat, index) => {
            const StatIcon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-surface-elevated mb-3">
                  <StatIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm font-semibold text-text-primary">{stat.label}</div>
                <div className="text-xs text-text-muted">{stat.value}</div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}