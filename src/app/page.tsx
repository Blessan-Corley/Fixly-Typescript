'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight,
  Home,
  Wrench,
  Car,
  Laptop,
  Shield,
  MapPin,
  Clock,
  CreditCard,
  Star,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/page-layout'

// Responsive Service Category Card
const ServiceCard = ({ icon: Icon, title, count, delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  count: string
  delay?: number
}) => (
  <motion.div
    className="glass-card p-4 sm:p-6 rounded-xl text-center group cursor-pointer hover:shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
  >
    <motion.div 
      className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform"
      whileHover={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </motion.div>
    <h3 className="font-semibold text-text-primary mb-1 text-sm sm:text-base">{title}</h3>
    <p className="text-xs sm:text-sm text-text-muted">{count}</p>
  </motion.div>
)

// Feature Card
const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ComponentType<any>
  title: string
  description: string
}) => (
  <motion.div
    className="glass-card p-6 rounded-xl"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  </motion.div>
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <PageLayout>
        {/* Hero Section */}
        <section className="py-20 px-6 text-center">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Get Your <span className="gradient-text">Home Fixed</span>
                <br />
                by Local <span className="gradient-text">Experts</span>
              </h1>
              
              <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                India's leading hyperlocal marketplace connecting customers with verified local professionals. 
                From home repairs to specialized services, find the right fixer in your area.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/auth/signup">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-glow-primary transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center">
                    Find a Fixer
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
              
              <Link href="/auth/signup?role=fixer">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-surface text-text-primary font-semibold border border-border hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Become a Fixer
                </motion.button>
              </Link>
            </motion.div>

            {/* Service Categories */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <ServiceCard icon={Home} title="Home Repair" count="800+ Verified Fixers" delay={0.1} />
              <ServiceCard icon={Wrench} title="Plumbing" count="600+ Verified Fixers" delay={0.2} />
              <ServiceCard icon={Car} title="Automotive" count="400+ Verified Fixers" delay={0.3} />
              <ServiceCard icon={Laptop} title="Electronics" count="500+ Verified Fixers" delay={0.4} />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-6 glass-card mx-4 rounded-2xl my-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                How Fixly Works
              </h2>
              <p className="text-xl text-text-secondary">
                Simple, secure, and reliable way to connect with service professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Post Your Job", desc: "Describe your project with photos and details. Set your budget and timeline." },
                { step: 2, title: "Receive Quotes", desc: "Get competitive quotes from verified professionals in your area within hours." },
                { step: 3, title: "Get It Fixed", desc: "Choose the best fixer and get professional service delivered to your door." }
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white text-2xl font-bold mb-4">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
                  <p className="text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Why Choose Fixly?
              </h2>
              <p className="text-xl text-text-secondary">
                Reliable, secure, and convenient home services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Shield}
                title="Verified Professionals"
                description="All fixers are background-checked and verified for your safety."
              />
              <FeatureCard
                icon={MapPin}
                title="Local Experts"
                description="Find trusted professionals in your neighborhood."
              />
              <FeatureCard
                icon={Clock}
                title="Quick Response"
                description="Get matched with available fixers quickly."
              />
              <FeatureCard
                icon={CreditCard}
                title="Secure Payment"
                description="Safe payment processing with multiple options."
              />
              <FeatureCard
                icon={Star}
                title="Quality Guarantee"
                description="All services come with our quality guarantee."
              />
              <FeatureCard
                icon={Zap}
                title="Easy Booking"
                description="Simple booking process with instant confirmation."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-primary to-accent text-white mx-4 rounded-2xl my-20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join over 15,000 satisfied customers and 800+ verified professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Today
                </motion.button>
              </Link>
              <Link href="/services">
                <motion.button
                  className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Services
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  )
}