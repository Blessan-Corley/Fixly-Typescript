'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Twitter, 
  Instagram, 
  Linkedin, 
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  ExternalLink
} from 'lucide-react'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

const footerLinks = {
  platform: [
    { name: 'Find Services', href: '/services' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Search Jobs', href: '/search' },
  ],
  support: [
    { name: 'Help & Support', href: '/support' },
    { name: 'Safety Guidelines', href: '/safety' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Resources', href: '/resources' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Cookie Policy', href: '/cookies' },
  ]
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/fixlyapp', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/fixlyapp', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/fixly', icon: Linkedin },
  { name: 'Facebook', href: 'https://facebook.com/fixlyapp', icon: Facebook },
]

const contactInfo = [
  { icon: Phone, label: '+91 9976768211', href: 'tel:+919976768211' },
  { icon: Mail, label: 'blessancorley@gmail.com', href: 'mailto:blessancorley@gmail.com' },
  { icon: MapPin, label: 'Coimbatore, Tamil Nadu, India', href: 'https://maps.google.com' },
]

function NewsletterSignup() {
  return (
    <div className="card-glass">
      <h3 className="heading-md text-primary mb-2">
        Stay Updated
      </h3>
      <p className="text-secondary text-sm mb-4">
        Get the latest updates on new services and special offers.
      </p>
      
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="input flex-1"
        />
        <motion.button
          className="btn-base btn-primary hover-glow"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

function FooterSection({ title, links }: { title: string, links: { name: string, href: string }[] }) {
  return (
    <div>
      <h3 className="heading-sm text-primary mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-secondary hover:text-primary transition-all duration-200 flex items-center gap-1 group hover-glow"
            >
              {link.name}
              {link.href.startsWith('http') && (
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-subtle">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-spacing-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <Logo size="lg" />
                <p className="text-secondary mt-4 leading-relaxed">
                  Connect with skilled professionals for all your home and service needs. 
                  Built with cutting-edge technology for the ultimate user experience.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon
                  return (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-all duration-200 group hover-glow"
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{contact.label}</span>
                    </motion.a>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg glass-strong flex items-center justify-center text-muted hover:text-primary hover-lift-subtle"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FooterSection title="Platform" links={footerLinks.platform} />
              <FooterSection title="Support" links={footerLinks.support} />
              <FooterSection title="Legal" links={footerLinks.company} />
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-2">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-spacing-md border-t border-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-muted">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-error fill-current" />
              </motion.div>
              <span>in India</span>
            </div>

            <div className="text-sm text-muted">
              © {new Date().getFullYear()} Fixly. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-muted hover:text-primary transition-all duration-200 hover-glow"
              >
                Privacy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-muted hover:text-primary transition-all duration-200 hover-glow"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-muted hover:text-primary transition-all duration-200 hover-glow"
              >
                Cookies
              </Link>
              <div className="border-l border-border-subtle pl-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}