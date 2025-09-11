'use client'

import React, { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Find Services', href: '/services' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

// Memoized navigation link component for performance
const NavLink = memo(({ item, pathname, className }: { 
  item: typeof navItems[0], 
  pathname: string,
  className?: string 
}) => {
  const isActive = pathname === item.href
  
  return (
    <Link
      href={item.href}
      className={cn(
        "btn-base btn-ghost hover-glow relative",
        isActive 
          ? "text-primary" 
          : "text-secondary hover:text-primary",
        className
      )}
    >
      {item.name}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  )
})
NavLink.displayName = 'NavLink'

// Memoized mobile menu item for performance
const MobileNavItem = memo(({ item, pathname, index, onClose }: {
  item: typeof navItems[0],
  pathname: string,
  index: number,
  onClose: () => void
}) => {
  const isActive = pathname === item.href
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.1 }}
    >
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "btn-base btn-ghost text-base hover-lift-subtle",
          isActive
            ? "bg-primary/10 text-primary border border-primary/20"
            : "text-secondary hover:text-primary hover:bg-surface-elevated"
        )}
      >
        {item.name}
      </Link>
    </motion.div>
  )
})
MobileNavItem.displayName = 'MobileNavItem'

export const Header = memo(function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  // Memoized scroll handler for better performance
  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 50)
  }, [])
  
  useMotionValueEvent(scrollY, "change", handleScroll)

  // Memoized mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Memoized animation variants for performance
  const headerVariants = useMemo(() => ({
    top: {
      height: "auto",
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
      backdropFilter: "blur(8px)",
      marginTop: "0px",
      marginLeft: "0px",
      marginRight: "0px",
      borderRadius: "0px",
      width: "100%"
    },
    scrolled: {
      height: "auto", 
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backdropFilter: "blur(20px)",
      marginTop: "12px",
      marginLeft: "16px",
      marginRight: "16px",
      borderRadius: "24px",
      width: "auto"
    }
  }), [])

  const logoVariants = useMemo(() => ({
    top: { scale: 1 },
    scrolled: { scale: 0.9 }
  }), [])

  // Enhanced mobile menu variants
  const mobileMenuVariants = useMemo(() => ({
    hidden: { 
      x: "100%", 
      opacity: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 30 
      }
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }), [])

  return (
    <>
      <motion.header
        className={cn(
          "fixed z-50 transition-all duration-300",
          isScrolled 
            ? "glass-strong border border-glass shadow-glow-subtle bg-background/95" 
            : "glass border-b border-glass/30 bg-background/60 top-0 left-0 right-0"
        )}
        style={{
          backdropFilter: isScrolled ? "blur(20px)" : "blur(12px)",
        }}
        variants={headerVariants}
        animate={isScrolled ? "scrolled" : "top"}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              animate={isScrolled ? "scrolled" : "top"}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Link href="/">
                <Logo size={isScrolled ? "sm" : "md"} />
              </Link>
            </motion.div>

            {/* Spacer for center alignment */}
            <div className="flex-1"></div>

            {/* Desktop CTA Buttons Only */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Ghost Sign In Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/signin"
                  className={cn(
                    "btn-base btn-ghost hover-glow",
                    isScrolled ? "btn-sm" : "btn-md"
                  )}
                >
                  Sign In
                </Link>
              </motion.div>
              
              {/* Primary CTA Button */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -1 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/auth/signup"
                  className={cn(
                    "btn-base btn-primary hover-glow",
                    "relative overflow-hidden",
                    isScrolled ? "btn-sm" : "btn-lg"
                  )}
                  role="button"
                >
                  <span className="relative z-10">Try For Free</span>
                  {/* Subtle hover glow effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-surface-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Enhanced Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Enhanced Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] glass-strong border-l border-glass shadow-glow-lg"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="p-6 pt-24">
                {/* Navigation Links */}
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <MobileNavItem
                      key={item.name}
                      item={item}
                      pathname={pathname}
                      index={index}
                      onClose={closeMobileMenu}
                    />
                  ))}
                </nav>

                {/* Theme Toggle for Mobile */}
                <motion.div
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <ThemeToggle />
                </motion.div>

                {/* Enhanced Auth Buttons */}
                <motion.div
                  className="mt-8 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {/* Ghost Sign In Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/auth/signin"
                      onClick={closeMobileMenu}
                      className="btn-base btn-ghost btn-lg w-full text-center hover-lift-subtle"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  
                  {/* Primary CTA Button */}
                  <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/auth/signup"
                      onClick={closeMobileMenu}
                      className="btn-base btn-primary btn-lg w-full text-center hover-glow relative overflow-hidden"
                      role="button"
                    >
                      <span className="relative z-10">Try For Free</span>
                      <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="mt-8 pt-8 border-t border-border-subtle space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 text-sm text-muted hover:text-secondary transition-colors cursor-default">
                    <Phone className="w-4 h-4 text-secondary" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted hover:text-secondary transition-colors cursor-default">
                    <Mail className="w-4 h-4 text-secondary" />
                    <span>hello@fixly.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted hover:text-secondary transition-colors cursor-default">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>Mumbai, India</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})