'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Find Services', href: '/services' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

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

  const headerVariants = {
    top: {
      height: "auto",
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    },
    scrolled: {
      height: "auto", 
      paddingTop: "1rem",
      paddingBottom: "1rem",
    }
  }

  const logoVariants = {
    top: { scale: 1 },
    scrolled: { scale: 0.9 }
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "glass-strong border-b border-border-glass shadow-glass-hover" 
            : "glass border-b border-border-glass/50"
        )}
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                    "hover:text-primary focus:outline-none focus:text-primary",
                    pathname === item.href 
                      ? "text-primary" 
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA & Theme Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign In
              </Link>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium shadow-glow-primary hover:shadow-glow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-surface-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden"
        initial={{ opacity: 0, visibility: "hidden" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? "visible" : "hidden"
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <motion.div
          className="absolute top-0 right-0 h-full w-80 max-w-[80vw] glass-strong border-l border-border-glass"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="p-6 pt-24">
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : 20
                  }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      pathname === item.href
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <motion.div
              className="mt-8 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                y: isMobileMenuOpen ? 0 : 20
              }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/auth/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 rounded-xl border border-border text-center font-medium hover:bg-surface-elevated transition-colors"
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-center font-medium shadow-glow-primary"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="mt-8 pt-8 border-t border-border-subtle space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                y: isMobileMenuOpen ? 0 : 20
              }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <Mail className="w-4 h-4" />
                <span>hello@fixly.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}