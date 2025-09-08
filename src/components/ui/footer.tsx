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

const footerLinks = {
  platform: [
    { name: 'Find Services', href: '/services' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'For Businesses', href: '/business' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Safety', href: '/safety' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Status', href: '/status' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ]
}

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/fixlyapp', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/fixlyapp', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/fixly', icon: Linkedin },
  { name: 'Facebook', href: 'https://facebook.com/fixlyapp', icon: Facebook },
]

const contactInfo = [
  { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'hello@fixly.com', href: 'mailto:hello@fixly.com' },
  { icon: MapPin, label: 'Mumbai, Maharashtra, India', href: 'https://maps.google.com' },
]

function NewsletterSignup() {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Stay Updated
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        Get the latest updates on new services and special offers.
      </p>
      
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2.5 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <motion.button
          className="px-4 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow-primary transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
      <h3 className="text-base font-semibold text-text-primary mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
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
    <footer className="bg-surface border-t border-border-subtle">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand & Newsletter */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <Logo size="lg" />
                <p className="text-text-secondary mt-4 leading-relaxed">
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
                      className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors group"
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
                      className="w-10 h-10 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary hover:shadow-glow-primary transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              <FooterSection title="Platform" links={footerLinks.platform} />
              <FooterSection title="Support" links={footerLinks.support} />
              <FooterSection title="Company" links={footerLinks.company} />
              <FooterSection title="Legal" links={footerLinks.legal} />
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-2">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-text-muted">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-error fill-current" />
              </motion.div>
              <span>in India</span>
            </div>

            <div className="text-sm text-text-muted">
              © {new Date().getFullYear()} Fixly. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}