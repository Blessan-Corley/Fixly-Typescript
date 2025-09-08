'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Calendar, Check, AlertTriangle } from 'lucide-react'

interface BirthdayPickerProps {
  onDateSelect: (date: Date) => void
  className?: string
  minAge?: number
  maxAge?: number
  initialDate?: Date
  role?: 'hirer' | 'fixer'
}

interface ScrollViewProps {
  items: number[]
  selectedValue: number
  onValueChange: (value: number) => void
  suffix?: string
  className?: string
}

const ScrollView = ({ items, selectedValue, onValueChange, suffix = '', className = '' }: ScrollViewProps) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemHeight = 60
  const visibleItems = 5
  const containerHeight = itemHeight * visibleItems

  const scrollToValue = useCallback((value: number) => {
    const container = scrollRef.current
    if (!container) return
    
    const index = items.indexOf(value)
    if (index === -1) return
    
    const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
    container.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    })
  }, [items, itemHeight, containerHeight])

  useEffect(() => {
    scrollToValue(selectedValue)
  }, [selectedValue, scrollToValue])

  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    
    setIsScrolling(true)
    
    const scrollTop = container.scrollTop
    const centerY = scrollTop + containerHeight / 2
    const index = Math.round(centerY / itemHeight)
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1))
    
    if (items[clampedIndex] !== selectedValue) {
      onValueChange(items[clampedIndex])
    }
  }, [items, selectedValue, onValueChange, containerHeight, itemHeight])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    
    const debounceTimer = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
    
    return () => clearTimeout(debounceTimer)
  }, [handleScroll])

  return (
    <div className={`relative ${className}`}>
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-surface via-surface/80 to-transparent z-10 pointer-events-none" />
      
      {/* Selected item indicator */}
      <div 
        className="absolute left-0 right-0 z-20 bg-primary/5 border-y-2 border-primary/20 pointer-events-none"
        style={{
          top: `${(containerHeight / 2) - (itemHeight / 2)}px`,
          height: `${itemHeight}px`
        }}
      />
      
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="overflow-y-scroll scrollbar-hide"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: containerHeight / 2 }} /> {/* Top spacer */}
        
        {items.map((item, index) => {
          const isSelected = item === selectedValue
          const distanceFromCenter = Math.abs(index - items.indexOf(selectedValue))
          const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.2)
          const scale = isSelected ? 1.1 : Math.max(0.8, 1 - distanceFromCenter * 0.1)
          
          return (
            <motion.div
              key={item}
              className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'text-primary font-bold' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              style={{ 
                height: itemHeight,
                opacity,
                transform: `scale(${scale})`
              }}
              onClick={() => {
                onValueChange(item)
                scrollToValue(item)
              }}
              whileHover={{ scale: scale * 1.05 }}
              whileTap={{ scale: scale * 0.95 }}
            >
              <span className="text-xl font-medium">
                {item.toString().padStart(2, '0')}{suffix}
              </span>
            </motion.div>
          )
        })}
        
        <div style={{ height: containerHeight / 2 }} /> {/* Bottom spacer */}
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface via-surface/80 to-transparent z-10 pointer-events-none" />
      
      {/* Scroll indicators */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
        <ChevronUp className={`w-5 h-5 transition-opacity duration-300 ${
          isScrolling ? 'opacity-100 text-primary' : 'opacity-40 text-text-muted'
        }`} />
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30">
        <ChevronDown className={`w-5 h-5 transition-opacity duration-300 ${
          isScrolling ? 'opacity-100 text-primary' : 'opacity-40 text-text-muted'
        }`} />
      </div>
    </div>
  )
}

export function BirthdayPicker({ 
  onDateSelect, 
  className = '', 
  minAge = 13, 
  maxAge = 80, 
  initialDate,
  role = 'hirer'
}: BirthdayPickerProps) {
  const today = new Date()
  const currentYear = today.getFullYear()
  
  // Calculate default date (18 years ago for fixers, 16 for hirers)
  const defaultAge = role === 'fixer' ? 18 : 16
  const defaultYear = currentYear - defaultAge
  
  const [selectedDay, setSelectedDay] = useState(initialDate?.getDate() || 1)
  const [selectedMonth, setSelectedMonth] = useState((initialDate?.getMonth() || 0) + 1)
  const [selectedYear, setSelectedYear] = useState(initialDate?.getFullYear() || defaultYear)
  
  const [ageError, setAgeError] = useState<string>('')
  const [isValidating, setIsValidating] = useState(false)

  // Generate arrays for scroll views
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: maxAge }, (_, i) => currentYear - minAge - i)
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  // Get days in selected month/year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate()
  }

  // Validate date and age
  const validateAge = useCallback((day: number, month: number, year: number) => {
    setIsValidating(true)
    setAgeError('')
    
    try {
      const birthDate = new Date(year, month - 1, day)
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
      
      if (birthDate > today) {
        setAgeError('Birth date cannot be in the future')
        return false
      }
      
      const minRequiredAge = role === 'fixer' ? 18 : 16
      if (age < minRequiredAge) {
        setAgeError(`You must be at least ${minRequiredAge} years old to ${role === 'fixer' ? 'offer services' : 'hire fixers'} on Fixly`)
        return false
      }
      
      if (age > maxAge) {
        setAgeError(`Please enter a valid birth date`)
        return false
      }
      
      return true
    } catch (error) {
      setAgeError('Please enter a valid birth date')
      return false
    } finally {
      setTimeout(() => setIsValidating(false), 300)
    }
  }, [today, role, maxAge])

  // Update date and validate
  useEffect(() => {
    const daysInCurrentMonth = getDaysInMonth(selectedMonth, selectedYear)
    
    // Adjust day if it's invalid for the selected month
    if (selectedDay > daysInCurrentMonth) {
      setSelectedDay(daysInCurrentMonth)
      return
    }
    
    const isValid = validateAge(selectedDay, selectedMonth, selectedYear)
    
    if (isValid) {
      const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay)
      onDateSelect(newDate)
    }
  }, [selectedDay, selectedMonth, selectedYear, onDateSelect, validateAge])

  // Filter days based on selected month/year
  const availableDays = days.filter(day => day <= getDaysInMonth(selectedMonth, selectedYear))

  const isValidDate = !ageError && selectedDay && selectedMonth && selectedYear

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">What's your birthday?</h2>
        <p className="text-text-secondary">
          {role === 'fixer' 
            ? 'You must be 18 or older to offer services on Fixly'
            : 'You must be 16 or older to hire fixers on Fixly'
          }
        </p>
      </div>

      {/* Date Picker */}
      <div className="relative">
        <motion.div
          className="glass-card rounded-2xl p-6 border border-border-subtle"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Day Picker */}
            <div className="text-center">
              <label className="block text-sm font-medium text-text-secondary mb-3">Day</label>
              <ScrollView
                items={availableDays}
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
                className="bg-surface/50 rounded-xl"
              />
            </div>
            
            {/* Month Picker */}
            <div className="text-center">
              <label className="block text-sm font-medium text-text-secondary mb-3">Month</label>
              <ScrollView
                items={months}
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                className="bg-surface/50 rounded-xl"
              />
            </div>
            
            {/* Year Picker */}
            <div className="text-center">
              <label className="block text-sm font-medium text-text-secondary mb-3">Year</label>
              <ScrollView
                items={years}
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                className="bg-surface/50 rounded-xl"
              />
            </div>
          </div>

          {/* Selected Date Display */}
          <div className="text-center p-4 bg-surface/30 rounded-xl mb-4">
            <p className="text-lg font-semibold text-text-primary">
              {selectedDay} {monthNames[selectedMonth - 1]} {selectedYear}
            </p>
            {isValidDate && (
              <p className="text-sm text-text-muted mt-1">
                Age: {Math.floor((today.getTime() - new Date(selectedYear, selectedMonth - 1, selectedDay).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years old
              </p>
            )}
          </div>
        </motion.div>

        {/* Validation Status */}
        <AnimatePresence>
          {ageError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                  {ageError}
                </p>
              </div>
            </motion.div>
          )}
          
          {isValidDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                  Perfect! Your age has been verified successfully.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isValidating && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-text-muted space-y-1">
        <p>• Scroll or tap to select your birth date</p>
        <p>• Your age information is kept private and secure</p>
        <p>• This verification is required only once</p>
      </div>
    </div>
  )
}

export default BirthdayPicker