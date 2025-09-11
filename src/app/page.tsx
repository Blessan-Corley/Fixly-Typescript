'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Search, 
  Users, 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock, 
  Shield,
  ArrowRight,
  Smartphone,
  Building,
  Zap,
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Mail,
  Home,
  Car,
  Laptop
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Safe redirect if already authenticated
  useEffect(() => {
    if (session && typeof window !== 'undefined') {
      try {
        router.push('/dashboard');
      } catch (error) {
        console.error('Redirect failed:', error);
        window.location.href = '/dashboard';
      }
    }
  }, [session, router]);

  const handleRoleSelect = (role) => {
    // Validate role to prevent abuse
    if (!role || !['hirer', 'fixer'].includes(role)) {
      console.error('Invalid role selected:', role);
      return;
    }

    setSelectedRole(role);
    
    // Safe sessionStorage usage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('selectedRole', role);
      }
    } catch (error) {
      console.warn('SessionStorage not available:', error);
    }

    // Safe navigation
    try {
      router.push(`/auth/signup?role=${role}`);
    } catch (error) {
      console.error('Navigation failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/signup?role=${role}`;
      }
    }
  };

  const handleFooterLink = (path) => {
    try {
      if (typeof window !== 'undefined') {
        router.push(path);
      }
    } catch (error) {
      console.error('Footer navigation failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  };

  const stats = [
    { label: 'Active Fixers', value: '10,000+', icon: Users },
    { label: 'Jobs Completed', value: '50,000+', icon: CheckCircle },
    { label: 'Cities Covered', value: '500+', icon: MapPin },
    { label: 'Average Rating', value: '4.8★', icon: Star }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get responses from qualified fixers within minutes'
    },
    {
      icon: Shield,
      title: 'Verified Fixers',
      description: 'All fixers are background verified for your safety'
    },
    {
      icon: MapPin,
      title: 'Local Experts',
      description: 'Connect with skilled professionals in your area'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Rated and reviewed by customers like you'
    }
  ];

  const howItWorks = [
    { 
      step: 1,
      title: 'Post Your Job',
      description: 'Describe what needs to be fixed with photos and details',
      icon: Building
    },
    {
      step: 2,
      title: 'Get Quotes',
      description: 'Receive quotes from qualified fixers in your area',
      icon: Users
    },
    {
      step: 3,
      title: 'Choose & Book',
      description: 'Select the best fixer and schedule the work',
      icon: CheckCircle
    },
    { 
      step: 4,
      title: 'Get It Done',
      description: 'Your job gets completed by a verified professional',
      icon: Zap
    }
  ];

  const services = [
    { icon: Home, title: 'Home Repair', count: '800+ Verified Fixers' },
    { icon: Wrench, title: 'Plumbing', count: '600+ Verified Fixers' },
    { icon: Car, title: 'Automotive', count: '400+ Verified Fixers' },
    { icon: Laptop, title: 'Electronics', count: '500+ Verified Fixers' }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[hsl(var(--text-primary))]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] theme-transition">
      {/* Header */}
      <header className="glass-strong border-b border-[hsl(var(--border))] sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center py-md">
            <div className="flex items-center gap-sm">
              <Wrench className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-heading text-primary">Fixly</span>
            </div>
            <div className="flex items-center gap-md">
              <ThemeToggle />
              <button 
                onClick={() => handleFooterLink('/auth/signin')}
                className="btn-base btn-ghost transition-fast"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowRoleSelection(true)}
                className="btn-base btn-primary hover-lift-subtle transition-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-heading text-primary mb-lg transition-base"
            >
              Find Local Service
              <span className="block text-secondary">Professionals</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-secondary mb-2xl max-w-3xl mx-auto text-body"
            >
              Connect with skilled fixers in your area. Post jobs and get them done 
              by verified professionals. From electrical work to plumbing, 
              we've got you covered.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-md justify-center mb-3xl"
            >
              <button 
                onClick={() => handleRoleSelect('hirer')}
                className="btn-base btn-primary btn-lg hover-lift transition-base flex items-center justify-center"
              >
                <Search className="mr-sm h-5 w-5" />
                I Need a Service
              </button>
              <button 
                onClick={() => handleRoleSelect('fixer')}
                className="btn-base btn-ghost btn-lg hover-lift transition-base flex items-center justify-center"
              >
                <Wrench className="mr-sm h-5 w-5" />
                I'm a Service Provider
              </button>
            </motion.div>

            {/* Service Categories */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="group relative card-glass card-lg text-center cursor-pointer hover-lift hover-glow transition-base card-interactive"
                >
                  {/* Gradient background overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--surface-elevated))]/50 to-[hsl(var(--surface-elevated))]/30 opacity-0 group-hover:opacity-100 transition-fast rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="inline-flex p-md rounded-2xl bg-surface-elevated text-primary mb-md group-hover:bg-[hsl(var(--primary-100))] group-hover:scale-110 transition-base">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-heading text-primary mb-sm text-base group-hover:text-[hsl(var(--primary-600))] transition-fast">{service.title}</h3>
                    <p className="text-sm text-secondary group-hover:text-primary transition-fast font-medium text-body">{service.count}</p>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--primary-500))] to-[hsl(var(--primary-600))] transform scale-x-0 group-hover:scale-x-100 transition-base rounded-b-2xl" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-[hsl(var(--text-secondary))] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[hsl(var(--text-primary))] mb-1">{stat.value}</div>
                <div className="text-[hsl(var(--text-muted))]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-lg">
        <div className="container">
          <div className="text-center mb-3xl">
            <h2 className="text-4xl font-bold text-heading text-primary mb-md">
              How Fixly Works
            </h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto text-body">
              Getting your job done is simple with our streamlined process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-xl">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative hover-lift-subtle transition-base"
              >
                <div className="bg-primary text-[hsl(var(--primary-foreground))] rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold mx-auto mb-md hover-glow transition-base">
                  {step.step}
                </div>
                <step.icon className="h-8 w-8 text-secondary mx-auto mb-md" />
                <h3 className="text-xl font-semibold text-heading text-primary mb-sm">
                  {step.title}
                </h3>
                <p className="text-secondary text-body">
                  {step.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-muted" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-lg bg-[hsl(var(--background))]">
        <div className="container">
          <div className="text-center mb-3xl">
            <h2 className="text-4xl font-bold text-heading text-primary mb-md">
              Why Choose Fixly?
            </h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto text-body">
              We connect you with the best local service professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-xl">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center card-lg card-hover hover:bg-surface-elevated transition-fast"
              >
                <feature.icon className="h-12 w-12 text-secondary mx-auto mb-md" />
                <h3 className="text-xl font-semibold text-heading text-primary mb-sm">
                  {feature.title}
                </h3>
                <p className="text-secondary text-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card-glass card-xl shadow-glow-primary"
          >
            <h2 className="text-4xl font-bold text-heading text-primary mb-md">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-secondary mb-2xl text-body">
              Join thousands of satisfied customers and service providers on Fixly
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <button 
                onClick={() => handleRoleSelect('hirer')}
                className="btn-base btn-primary btn-lg hover-lift transition-base"
              >
                Post a Job
              </button>
              <button 
                onClick={() => handleRoleSelect('fixer')}
                className="btn-base btn-ghost btn-lg hover-lift transition-base"
              >
                Become a Fixer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-[hsl(var(--primary-foreground))] section">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-xl">
            <div>
              <div className="flex items-center mb-md">
                <Wrench className="h-6 w-6 text-[hsl(var(--primary-foreground))]/70 mr-sm" />
                <span className="text-xl font-bold text-heading">Fixly</span>
              </div>
              <p className="text-[hsl(var(--primary-foreground))]/70 mb-md text-body">
                Your trusted local service marketplace
              </p>
              
              {/* Social Media Icons */}
              <div className="flex gap-md">
                <a 
                  href="#" 
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  aria-label="Twitter/X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://wa.me/919976768211?text=Hi! I'm interested in Fixly services." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a 
                  href="mailto:blessancorley@gmail.com"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-md text-heading">For Customers</h3>
              <ul className="space-y-sm text-[hsl(var(--primary-foreground))]/70 text-body">
                <li>
                  <button 
                    onClick={() => handleRoleSelect('hirer')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Post a Job
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/services')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Find Services
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/how-it-works')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/safety')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Safety
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-md text-heading">For Fixers</h3>
              <ul className="space-y-sm text-[hsl(var(--primary-foreground))]/70 text-body">
                <li>
                  <button 
                    onClick={() => handleRoleSelect('fixer')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Become a Fixer
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/pricing')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/resources')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/support')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Support
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-md text-heading">Company</h3>
              <ul className="space-y-sm text-[hsl(var(--primary-foreground))]/70 text-body">
                <li>
                  <button 
                    onClick={() => handleFooterLink('/about')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/contact')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/privacy-policy')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterLink('/terms-of-service')}
                    className="hover:text-[hsl(var(--primary-foreground))] transition-fast"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[hsl(var(--primary-foreground))]/20 mt-2xl pt-2xl">
            <div className="text-center text-[hsl(var(--primary-foreground))]/70 text-body">
              <p>&copy; 2025 Fixly. All rights reserved. | 
                <button 
                  onClick={() => handleFooterLink('/cookies')}
                  className="hover:text-[hsl(var(--primary-foreground))] transition-fast underline ml-xs"
                >
                  Cookies
                </button>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRoleSelection(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-glass card-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-heading text-primary mb-lg text-center">
                Choose Your Role
              </h2>
              
              <div className="space-y-md">
                <button
                  onClick={() => handleRoleSelect('hirer')}
                  className="w-full card-lg border-2 border-default hover:border-[hsl(var(--primary-400))] transition-fast text-left hover-lift-subtle"
                >
                  <div className="flex items-center mb-sm">
                    <Search className="h-6 w-6 text-secondary mr-md" />
                    <span className="text-xl font-semibold text-heading text-primary">I'm a Hirer</span>
                  </div>
                  <p className="text-secondary text-body">
                    I need to hire service professionals for my jobs
                  </p>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('fixer')}
                  className="w-full card-lg border-2 border-default hover:border-[hsl(var(--primary-400))] transition-fast text-left hover-lift-subtle"
                >
                  <div className="flex items-center mb-sm">
                    <Wrench className="h-6 w-6 text-secondary mr-md" />
                    <span className="text-xl font-semibold text-heading text-primary">I'm a Fixer</span>
                  </div>
                  <p className="text-secondary text-body">
                    I provide services and want to find work opportunities
                  </p>
                </button>
              </div>
              
              <div className="mt-lg text-center">
                <button
                  onClick={() => setShowRoleSelection(false)}
                  className="text-muted hover:text-primary transition-fast"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}