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
  Shield
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
    className="glass-card p-6 rounded-xl text-center group relative overflow-hidden"
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
      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ borderRadius: '12px' }}
    />
    
    <motion.div 
      className="relative inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-200"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
    <h3 className="text-xl font-semibold text-text-primary mb-3 relative z-10">{title}</h3>
    <p className="text-text-secondary leading-relaxed relative z-10">{description}</p>
  </motion.div>
)

const TeamMember = ({ name, role, image, description, delay = 0 }: {
  name: string
  role: string
  image: string
  description: string
  delay?: number
}) => (
  <motion.div
    className="glass-card p-6 rounded-xl text-center group hover:shadow-lg"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
  >
    <motion.div 
      className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to gradient circle with initials if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">${name.split(' ').map(n => n[0]).join('')}</div>`;
          }
        }}
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay + 0.1 }}
    >
      <h3 className="text-xl font-semibold text-text-primary mb-2">{name}</h3>
      <p className="text-primary font-medium mb-4 text-sm">{role}</p>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </motion.div>
  </motion.div>
)

const Achievement = ({ icon: Icon, number, label, delay = 0 }: {
  icon: React.ComponentType<any>
  number: string
  label: string
  delay?: number
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div 
      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white mb-4"
      whileHover={{ 
        scale: 1.2,
        rotate: 360,
        transition: { duration: 0.5 }
      }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
    <motion.div 
      className="text-3xl font-bold gradient-text mb-2"
      whileHover={{ scale: 1.1 }}
    >
      {number}
    </motion.div>
    <p className="text-text-secondary">{label}</p>
  </motion.div>
)

export default function AboutPage() {
  return (
    <PageLayout
      title="About Fixly"
      description="India's leading hyperlocal service marketplace connecting customers with verified professionals. Making home services simple, secure, and affordable."
    >
      {/* Our Story Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="glass-card p-8 md:p-12 rounded-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
              <p>
                Fixly was born from a simple frustration: finding reliable local service professionals shouldn&apos;t be a gamble. 
                Our founders experienced firsthand the challenges of connecting with trustworthy fixers for home repairs and professional services.
              </p>
              <p>
                In 2025, we launched India&apos;s first hyperlocal marketplace that puts verification, quality, and transparency at the center of home services. 
                Today, we&apos;re proud to connect over 15,000 customers with 800+ verified professionals who deliver exceptional results.
              </p>
              <p>
                Every fixer on our platform undergoes comprehensive identity verification, background checks, and skill assessment. 
                From small repairs to major projects, your safety and satisfaction are guaranteed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Our Values</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard
              icon={Shield}
              title="Trust & Safety"
              description="Every professional is thoroughly vetted and background-checked to ensure your peace of mind."
              delay={0.1}
            />
            <ValueCard
              icon={Star}
              title="Quality First"
              description="We maintain the highest standards of service quality with our comprehensive review system."
              delay={0.2}
            />
            <ValueCard
              icon={Zap}
              title="Speed & Efficiency"
              description="Quick response times and efficient service delivery to get your problems solved fast."
              delay={0.3}
            />
            <ValueCard
              icon={Heart}
              title="Customer Care"
              description="Your satisfaction is our priority, with dedicated support every step of the way."
              delay={0.4}
            />
            <ValueCard
              icon={Globe}
              title="Community Focus"
              description="Supporting local professionals and building stronger communities one service at a time."
              delay={0.5}
            />
            <ValueCard
              icon={Award}
              title="Excellence"
              description="Continuously raising the bar for service quality and customer experience."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-6 glass-card mx-4 rounded-2xl my-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Our Impact</h2>
            <p className="text-xl text-text-secondary">Numbers that showcase our commitment to excellence</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Achievement 
              icon={Users}
              number="15K+"
              label="Happy Customers"
              delay={0.1}
            />
            <Achievement 
              icon={CheckCircle}
              number="800+"
              label="Verified Professionals"
              delay={0.2}
            />
            <Achievement 
              icon={Award}
              number="98%"
              label="Satisfaction Rate"
              delay={0.3}
            />
            <Achievement 
              icon={Globe}
              number="25+"
              label="Cities Across India"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Meet Our Team</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              The passionate people behind Fixly&apos;s mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TeamMember
              name="Blessan Corley"
              role="Co-Founder & CEO"
              image="/founders/blessan.jpg"
              description="Tech entrepreneur and visionary leader passionate about revolutionizing India's service marketplace. Building trusted connections between customers and verified professionals."
              delay={0.1}
            />
            <TeamMember
              name="Vinoth Kumar"
              role="Co-Founder & CTO"
              image="/founders/vinoth.jpg"
              description="Full-stack technology expert with deep expertise in scalable platforms. Leading product development and engineering innovation at Fixly."
              delay={0.2}
            />
            <TeamMember
              name="Dinesh Madhavan"
              role="Co-Founder & COO"
              image="/founders/dinesh.jpg"
              description="Operations strategist focused on building quality service networks. Ensuring exceptional customer experience and professional growth across India."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed mb-8 opacity-90">
              To become India&apos;s most trusted hyperlocal service marketplace, connecting every customer with verified local professionals. 
              Making quality home services accessible, affordable, and reliable for everyone.
            </p>
            <Link href="/services">
              <motion.button
                className="btn-glass px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Services
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}