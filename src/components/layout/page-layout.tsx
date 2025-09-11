'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CookieConsent } from '@/components/ui/cookie-consent'
import { ScrollProgress } from '@/components/ui/scroll-progress'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

const DynamicHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 100)
    })
  }, [scrollY])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-strong py-2 shadow-glow-primary' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.h1
              className={`font-bold gradient-text transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Fixly
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <motion.div whileHover={{ y: -2 }} className="relative group">
              <Link href="/services" className="text-text-secondary hover:text-primary transition-colors">
                Services
              </Link>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="relative group">
              <Link href="/how-it-works" className="text-text-secondary hover:text-primary transition-colors">
                How it Works
              </Link>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="relative group">
              <Link href="/about" className="text-text-secondary hover:text-primary transition-colors">
                About
              </Link>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <ThemeToggle />
          </div>

          {/* Auth Buttons */}
          <motion.div 
            className={`hidden md:flex items-center gap-3 transition-all duration-300 ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/auth/signin">
              <motion.button
                className="px-4 py-2 text-text-secondary hover:text-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/auth/signup">
              <motion.button
                className="btn-glass px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow-primary transition-all"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-4 pb-4 space-y-4 glass rounded-lg p-4">
            <motion.div whileHover={{ x: 4 }}>
              <Link href="/services" className="block text-text-secondary hover:text-primary transition-colors">Services</Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }}>
              <Link href="/how-it-works" className="block text-text-secondary hover:text-primary transition-colors">How it Works</Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }}>
              <Link href="/about" className="block text-text-secondary hover:text-primary transition-colors">About</Link>
            </motion.div>
            <div className="flex items-center justify-between pt-2 border-t border-border-glass">
              <div className="flex gap-3">
                <Link href="/auth/signin">
                  <motion.button 
                    className="px-4 py-2 text-text-secondary hover:text-primary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/signup">
                  <motion.button 
                    className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

const Footer = () => (
  <footer className="py-16 px-6 glass-strong mt-20">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold gradient-text mb-4">
            Fixly
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Your trusted local services marketplace connecting you with verified professionals.
          </p>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-lg font-semibold mb-4 text-text-primary">Services</h4>
          <ul className="space-y-2 text-text-secondary">
            {["Home Repair", "Plumbing", "Electrical", "Automotive", "Electronics"].map((service, index) => (
              <motion.li key={service} whileHover={{ x: 4, color: 'hsl(var(--primary))' }}>
                <Link href={`/services/${service.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">
                  {service}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-semibold mb-4 text-text-primary">Company</h4>
          <ul className="space-y-2 text-text-secondary">
            {["About Us", "How It Works", "Careers", "Press", "Blog"].map((item, index) => (
              <motion.li key={item} whileHover={{ x: 4, color: 'hsl(var(--primary))' }}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-lg font-semibold mb-4 text-text-primary">Support</h4>
          <ul className="space-y-2 text-text-secondary">
            {["Help Center", "Contact Us", "Safety", "Terms of Service", "Privacy Policy"].map((item, index) => (
              <motion.li key={item} whileHover={{ x: 4, color: 'hsl(var(--primary))' }}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div 
        className="border-t border-border-glass mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-text-muted mb-4 md:mb-0">
          © 2025 Fixly. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </motion.div>
    </div>
  </footer>
)

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Scroll Progress Bar */}
      <ScrollProgress height={3} />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-warning/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <DynamicHeader />
      
      <main className="pt-24 relative z-10">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6 py-16 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">{title}</h1>
            {description && (
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">{description}</p>
            )}
          </motion.div>
        )}
        {children}
      </main>
      
      <Footer />
      
      {/* Cookie Consent Popup */}
      <CookieConsent />
    </div>
  )
}