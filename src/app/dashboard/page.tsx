'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  MessageCircle,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Wrench,
  UserCheck,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function DashboardPage() {
  // Mock user data - in real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    username: 'john_doe',
    email: 'john@example.com',
    mobile: '+91 9876543210',
    role: 'fixer', // or 'hirer'
    profilePicture: null,
    location: {
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    skills: ['Plumbing', 'Electrical Work', 'Carpentry'],
    rating: 4.8,
    completedJobs: 42,
    joinedDate: 'March 2025'
  }

  const quickStats = [
    {
      label: mockUser.role === 'fixer' ? 'Jobs Completed' : 'Jobs Posted',
      value: mockUser.role === 'fixer' ? '42' : '12',
      icon: TrendingUp,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: mockUser.role === 'fixer' ? 'This Month' : 'Active Jobs',
      value: mockUser.role === 'fixer' ? '8' : '3',
      icon: Calendar,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100'
    },
    {
      label: 'Messages',
      value: '5',
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ]

  const recentActivity = [
    { text: 'Profile setup completed', time: '2 hours ago', type: 'success' },
    { text: 'Welcome to Fixly!', time: '2 hours ago', type: 'info' },
    { text: 'Email verified successfully', time: '2 hours ago', type: 'success' },
    { text: 'Account created', time: '2 hours ago', type: 'info' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong border-b border-subtle">
        <div className="container py-spacing-md">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
              <Link href="/jobs" className="btn-base btn-ghost hover-glow">
                {mockUser.role === 'fixer' ? 'Find Jobs' : 'My Jobs'}
              </Link>
              <Link href="/messages" className="btn-base btn-ghost hover-glow">
                Messages
              </Link>
              <Link href="/profile" className="btn-base btn-ghost hover-glow">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="relative p-2 rounded-xl glass-strong hover-lift-subtle">
                <Bell className="w-5 h-5 text-secondary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full" />
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center gap-3 p-2 rounded-xl glass-strong hover-lift-subtle">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {mockUser.name.charAt(0)}
                  </div>
                  <span className="font-medium text-primary hidden sm:block">
                    {mockUser.name}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-spacing-xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="card-glass">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
                {mockUser.role === 'fixer' ? (
                  <Wrench className="w-8 h-8" />
                ) : (
                  <UserCheck className="w-8 h-8" />
                )}
              </div>
              <div>
                <h1 className="heading-xl text-primary">
                  Welcome back, {mockUser.name}!
                </h1>
                <p className="text-secondary">
                  {mockUser.role === 'fixer' 
                    ? 'Ready to help customers with your skills?' 
                    : 'Find skilled professionals for your needs'
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-secondary">
                <MapPin className="w-4 h-4" />
                <span>{mockUser.location.city}, {mockUser.location.state}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <Calendar className="w-4 h-4" />
                <span>Member since {mockUser.joinedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="card-glass hover-lift-subtle">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Profile Overview
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <p className="font-medium text-slate-900">{mockUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Username</label>
                    <p className="font-medium text-slate-900">@{mockUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="font-medium text-slate-900">{mockUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="font-medium text-slate-900">{mockUser.mobile}</p>
                  </div>
                </div>

                {mockUser.role === 'fixer' && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {mockUser.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="badge badge-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <Link
                  href="/profile/edit"
                  className="btn-base btn-primary hover-glow"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="heading-lg text-primary mb-4">
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl glass-strong">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <Link
                  href="/activity"
                  className="text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockUser.role === 'fixer' ? (
                <>
                  <Link
                    href="/jobs/browse"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Wrench className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Find Jobs</span>
                  </Link>
                  <Link
                    href="/profile/skills"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Star className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Update Skills</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/jobs/post"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <UserCheck className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Post Job</span>
                  </Link>
                  <Link
                    href="/browse-fixers"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Find Fixers</span>
                  </Link>
                </>
              )}
              
              <Link
                href="/messages"
                className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-slate-900">Messages</span>
              </Link>
              
              <Link
                href="/settings"
                className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:shadow-glass-hover transition-all text-center group"
              >
                <div className="w-12 h-12 bg-gray-500/10 rounded-xl flex items-center justify-center group-hover:bg-gray-500/20 transition-colors">
                  <Settings className="w-6 h-6 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-slate-900">Settings</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-slate-700">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  🎉 Signup Completed Successfully!
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  This is a demo dashboard showing what your Fixly experience would look like. 
                  The signup flow with email verification, password setup, profile creation, 
                  skills selection, and location setup is fully functional with comprehensive 
                  validation and beautiful toast notifications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Try Signup Again
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Test Login Page
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3 py-1 glass border border-slate-200 rounded-lg text-sm font-medium hover:shadow-glass-hover transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}