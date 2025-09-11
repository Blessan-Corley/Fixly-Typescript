'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  CheckCircle,
  Star,
  Zap,
  Heart,
  Shield,
  Wrench,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/page-layout'

const ValueCard = ({ icon: Icon, title, description, delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  description: string
  delay?: number
}) => (
  <motion.div
    className="card-glass card-lg text-center group relative overflow-hidden hover-lift transition-base"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ 
      y: -4,
      transition: { duration: 0.2 }
    }}
  >
    <motion.div
      className="absolute inset-0 bg-surface-elevated/50 opacity-0 group-hover:opacity-100 transition-fast"
      style={{ borderRadius: 'var(--radius)' }}
    />
    
    <motion.div 
      className="relative inline-flex p-md rounded-full bg-surface-elevated text-secondary mb-md group-hover:scale-110 transition-base"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
    <h3 className="text-xl font-semibold text-heading text-primary mb-sm relative z-10">{title}</h3>
    <p className="text-secondary text-body leading-relaxed relative z-10">{description}</p>
  </motion.div>
)

const StatCard = ({ number, label, description }: {
  number: string
  label: string
  description: string
}) => (
  <motion.div
    className="text-center hover-lift-subtle transition-base"
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, type: "spring" }}
  >
    <div className="text-4xl font-bold text-heading text-primary mb-sm">{number}</div>
    <div className="text-xl font-semibold text-secondary mb-xs">{label}</div>
    <div className="text-sm text-muted text-body">{description}</div>
  </motion.div>
)

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in strengthening local communities by connecting neighbors with skilled professionals who care about quality work."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every professional is thoroughly verified and background-checked. Your safety and peace of mind are our top priorities."
    },
    {
      icon: Star,
      title: "Quality Excellence",
      description: "We maintain high standards through our rating system, quality guarantees, and continuous improvement based on feedback."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage cutting-edge technology to make finding and booking services as simple and efficient as possible."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Quality services should be available to everyone, everywhere. We're building bridges between communities across India."
    },
    {
      icon: Award,
      title: "Empowerment",
      description: "We empower local professionals to grow their businesses while providing customers with reliable, affordable services."
    }
  ]

  const milestones = [
    { year: "2024", title: "Fixly Founded", description: "Started with a vision to revolutionize local services" },
    { year: "2024", title: "First 100 Fixers", description: "Onboarded our initial community of service professionals" },
    { year: "2024", title: "1000+ Jobs Completed", description: "Reached our first major milestone in successful job completions" },
    { year: "2025", title: "Multi-City Launch", description: "Expanded to 10+ cities across India" }
  ]

  return (
    <PageLayout 
      title="About Fixly" 
      description="Learn about our mission to connect communities through quality local services and meet the team behind the platform."
    >
      <div className="min-h-screen bg-[hsl(var(--background))] theme-transition">
        {/* Hero Section */}
        <section className="section-lg">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 glass-strong rounded-full mb-2xl">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h1 className="text-4xl font-bold text-heading text-primary mb-lg">
                Building Stronger Communities Through Quality Service
              </h1>
              <p className="text-xl text-secondary text-body leading-relaxed max-w-3xl mx-auto">
                Fixly was born from a simple belief: everyone deserves access to reliable, quality services in their community. 
                We're connecting skilled professionals with customers who need their expertise, building trust one job at a time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section glass-subtle">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
              <StatCard number="10,000+" label="Active Fixers" description="Verified professionals" />
              <StatCard number="50,000+" label="Jobs Completed" description="Successful projects" />
              <StatCard number="500+" label="Cities" description="Across India" />
              <StatCard number="4.8★" label="Average Rating" description="Customer satisfaction" />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-lg">
          <div className="container max-w-6xl">
            <div className="grid md:grid-cols-2 gap-3xl items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 glass-strong rounded-full mb-md">
                    <Target className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl font-bold text-heading text-primary mb-md">Our Mission</h2>
                  <p className="text-lg text-secondary text-body leading-relaxed">
                    To democratize access to quality local services by creating a trusted platform where skilled professionals 
                    can connect with customers, fostering economic growth in communities across India.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 glass-strong rounded-full mb-md">
                    <Lightbulb className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl font-bold text-heading text-primary mb-md">Our Vision</h2>
                  <p className="text-lg text-secondary text-body leading-relaxed">
                    To become India's most trusted local services marketplace, where every household has access to 
                    reliable professionals and every skilled worker can build a thriving business.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-lg glass-subtle">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-3xl"
            >
              <h2 className="text-4xl font-bold text-heading text-primary mb-md">
                Our Values
              </h2>
              <p className="text-xl text-secondary text-body">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {values.map((value, index) => (
                <ValueCard
                  key={value.title}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="section-lg">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-3xl"
            >
              <h2 className="text-4xl font-bold text-heading text-primary mb-md">
                Meet Our Founders
              </h2>
              <p className="text-xl text-secondary text-body max-w-2xl mx-auto">
                The visionaries behind Fixly's mission to connect communities through quality service
              </p>
            </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl max-w-5xl mx-auto">
            {/* Founder 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl card-glass hover-lift transition-base"
            >
              <div className="relative overflow-hidden">
                {/* Placeholder for founder photo - you can replace with actual image */}
                <div className="w-full h-80 bg-gradient-to-br from-[hsl(var(--surface))] to-[hsl(var(--surface-elevated))] grayscale group-hover:grayscale-0 transition-slow flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                {/* Bio overlay that slides up on hover */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                  initial={{ y: "100%" }}
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-heading">John Smith</h4>
                      <p className="text-white/70 text-sm text-body">Co-Founder & CEO</p>
                    </div>
                    <p className="text-sm text-white/80 text-body leading-relaxed">
                      Former tech executive with 15+ years in marketplace platforms. 
                      Passionate about connecting communities and empowering local businesses.
                    </p>
                    <div className="flex gap-sm pt-sm">
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="mailto:john@fixly.com" className="text-slate-300 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Name and title visible by default */}
              <div className="p-lg group-hover:pb-sm transition-base">
                <h3 className="text-xl font-semibold text-heading text-primary mb-xs">John Smith</h3>
                <p className="text-secondary text-body">Co-Founder & CEO</p>
              </div>
            </motion.div>

            {/* Founder 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl card-glass hover-lift transition-base"
            >
              <div className="relative overflow-hidden">
                <div className="w-full h-80 bg-gradient-to-br from-[hsl(var(--surface-elevated))] to-[hsl(var(--secondary-100))] grayscale group-hover:grayscale-0 transition-slow flex items-center justify-center">
                  <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center">
                    <Wrench className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                  initial={{ y: "100%" }}
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                      <p className="text-slate-300 text-sm">Co-Founder & CTO</p>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      Full-stack engineer and product strategist. Expert in building scalable platforms 
                      that solve real-world problems with elegant technology solutions.
                    </p>
                    <div className="flex gap-sm pt-sm">
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="mailto:sarah@fixly.com" className="text-slate-300 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="p-6 group-hover:pb-2 transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Sarah Johnson</h3>
                <p className="text-slate-600 dark:text-slate-400">Co-Founder & CTO</p>
              </div>
            </motion.div>

            {/* Founder 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 md:col-span-2 lg:col-span-1"
            >
              <div className="relative overflow-hidden">
                <div className="w-full h-80 bg-gradient-to-br from-[hsl(var(--secondary-200))] to-[hsl(var(--primary-200))] grayscale group-hover:grayscale-0 transition-slow flex items-center justify-center">
                  <div className="w-32 h-32 bg-[hsl(var(--success))] rounded-full flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent text-white p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                  initial={{ y: "100%" }}
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold">Mike Chen</h4>
                      <p className="text-slate-300 text-sm">Co-Founder & COO</p>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      Operations expert with deep experience in service marketplaces. 
                      Focused on ensuring quality, safety, and exceptional customer experiences.
                    </p>
                    <div className="flex gap-sm pt-sm">
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href="#" className="text-white/70 hover:text-white transition-fast">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="mailto:mike@fixly.com" className="text-slate-300 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="p-6 group-hover:pb-2 transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Mike Chen</h3>
                <p className="text-slate-600 dark:text-slate-400">Co-Founder & COO</p>
              </div>
            </motion.div>
          </div>

          {/* Founders message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-3xl text-center max-w-4xl mx-auto"
          >
            <div className="card-glass card-xl">
              <div className="mb-lg">
                <svg className="w-8 h-8 text-muted mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <blockquote className="text-lg text-secondary text-body italic leading-relaxed mb-lg">
                "We founded Fixly with a simple belief: everyone deserves access to reliable, quality services in their community. 
                Our platform doesn't just connect customers with service providers – it builds trust, ensures quality, 
                and strengthens local economies one job at a time."
              </blockquote>
              <footer className="text-muted text-body font-medium">
                — The Fixly Founding Team
              </footer>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Journey/Timeline */}
        <section className="section-lg glass-subtle">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-3xl"
            >
              <h2 className="text-4xl font-bold text-heading text-primary mb-md">
                Our Journey
              </h2>
              <p className="text-xl text-secondary text-body">
                Key milestones in building the Fixly community
              </p>
            </motion.div>

          <div className="space-y-xl">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-lg"
              >
                <div className="w-16 h-16 bg-primary text-[hsl(var(--primary-foreground))] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1 card-glass card-lg">
                  <h3 className="text-xl font-semibold text-heading text-primary mb-sm">{milestone.title}</h3>
                  <p className="text-secondary text-body">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-lg">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-glass card-xl hover-lift transition-base"
            >
              <h2 className="text-4xl font-bold text-heading text-primary mb-md">
                Join the Fixly Community
              </h2>
              <p className="text-xl text-secondary text-body mb-2xl">
                Whether you're looking for quality services or want to grow your business as a professional, 
                we're here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center">
                <Link href="/auth/signup?role=hirer">
                  <motion.button
                    className="btn-base btn-primary btn-lg hover-lift transition-base"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Find Services
                  </motion.button>
                </Link>
                <Link href="/auth/signup?role=fixer">
                  <motion.button
                    className="btn-base btn-ghost btn-lg hover-lift transition-base"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Become a Fixer
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}