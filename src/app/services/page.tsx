'use client'

import { motion } from 'framer-motion'
import { 
  Home, 
  Wrench, 
  Zap, 
  Car, 
  Laptop, 
  Scissors, 
  Paintbrush, 
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/page-layout'

const ServiceCard = ({ icon: Icon, title, description, price, features, delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  description: string
  price: string
  features: string[]
  delay?: number
}) => (
  <motion.div
    className="glass-card p-4 sm:p-6 rounded-xl relative overflow-hidden group cursor-pointer hover:shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 80 }}
    whileHover={{ 
      y: -6, 
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ borderRadius: '12px' }}
    />
    
    <div className="relative z-10">
      <motion.div 
        className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-200"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-4">{description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold gradient-text">{price}</span>
        <div className="flex items-center text-sm text-text-muted">
          <Clock className="w-4 h-4 mr-1" />
          Quick Response
        </div>
      </div>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <motion.li 
            key={index}
            className="flex items-center text-sm text-text-secondary"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 * index }}
          >
            <CheckCircle className="w-4 h-4 text-accent mr-2" />
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <Link href={`/services/${title.toLowerCase().replace(' ', '-')}`}>
        <motion.button
          className="w-full btn-glass px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow-primary transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            Get Started
            <motion.div
              className="ml-2"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </span>
        </motion.button>
      </Link>
    </div>
    
    <motion.div
      className="absolute top-0 left-0 w-full h-full shimmer opacity-0 group-hover:opacity-100"
      style={{ borderRadius: '12px' }}
    />
  </motion.div>
)

const StatCard = ({ number, label, delay = 0 }: {
  number: string
  label: string
  delay?: number
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
  >
    <motion.div 
      className="text-3xl md:text-4xl font-bold gradient-text mb-2"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      {number}
    </motion.div>
    <p className="text-text-secondary">{label}</p>
  </motion.div>
)

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Home Repair",
      description: "Complete home maintenance and repair services from verified local professionals.",
      price: "From ₹500",
      features: ["Emergency Service Available", "Background-Verified Fixers", "Quality Guarantee", "Transparent Pricing"]
    },
    {
      icon: Wrench,
      title: "Plumbing",
      description: "Professional plumbing solutions for all your water and drainage needs across India.",
      price: "From ₹800",
      features: ["Same-Day Service", "Licensed Plumbers", "Leak Detection & Repair", "Parts & Labor Warranty"]
    },
    {
      icon: Zap,
      title: "Electrical",
      description: "Safe and reliable electrical services by certified professionals across India.",
      price: "From ₹600",
      features: ["ISI Certified Electricians", "Safety Compliance", "Emergency Repairs", "Installation & Maintenance"]
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Professional automotive repair and maintenance services at your doorstep.",
      price: "From ₹1000",
      features: ["Mobile Service Available", "Expert Diagnostics", "Genuine Parts", "All Vehicle Types"]
    },
    {
      icon: Laptop,
      title: "Electronics",
      description: "Expert repair for computers, smartphones, and all electronic devices across India.",
      price: "From ₹300",
      features: ["Free Diagnostics", "Data Recovery Service", "Screen & Hardware Repair", "Software Solutions"]
    },
    {
      icon: Paintbrush,
      title: "Painting",
      description: "Professional interior and exterior painting services with premium materials.",
      price: "From ₹25/sqft",
      features: ["Asian Paints & Berger", "Color Consultation", "Surface Preparation", "Post-Service Cleanup"]
    }
  ]

  return (
    <PageLayout
      title="Our Services"
      description="Connect with verified local professionals across India. From home repairs to specialized services, find the right fixer for every job."
    >
      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="15K+" label="Happy Customers" delay={0.1} />
            <StatCard number="800+" label="Verified Professionals" delay={0.2} />
            <StatCard number="25+" label="Cities Across India" delay={0.3} />
            <StatCard number="24/7" label="Support Available" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Choose from our most requested services, all backed by our quality guarantee
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
                delay={0.1 * index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 glass-card mx-4 rounded-2xl my-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose Fixly?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We connect you with the best professionals in your area
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Verified Professionals", 
                description: "All service providers are background-checked and verified for your safety.",
                delay: 0.1
              },
              { 
                icon: Star, 
                title: "Quality Guarantee", 
                description: "Every service comes with our satisfaction guarantee and customer support.",
                delay: 0.2
              },
              { 
                icon: Clock, 
                title: "Fast & Reliable", 
                description: "Quick response times with reliable professionals who value your time.",
                delay: 0.3
              }
            ].map(({ icon: Icon, title, description, delay }) => (
              <motion.div
                key={title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay, duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white mb-4 shadow-glow-primary"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-accent text-white mx-4 rounded-2xl my-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: [
              'radial-gradient(600px at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(600px at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(600px at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(600px at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Custom Service?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Can't find what you're looking for? We'll help you find the right professional for any job.
            </p>
            <Link href="/contact">
              <motion.button
                className="btn-glass px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}