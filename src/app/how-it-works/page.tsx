'use client'

import { motion } from 'framer-motion'
import { 
  Search, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  Star,
  MessageSquare,
  Shield,
  CheckCircle,
  Clock,
  ArrowRight,
  Smartphone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/page-layout'

const StepCard = ({ step, icon: Icon, title, description, details, delay = 0 }: {
  step: number
  icon: React.ComponentType<any>
  title: string
  description: string
  details: string[]
  delay?: number
}) => (
  <motion.div
    className="glass-card p-8 rounded-xl relative overflow-hidden group"
    initial={{ opacity: 0, x: step % 2 === 0 ? 50 : -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -4 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ borderRadius: '12px' }}
    />
    
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <motion.div 
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center text-2xl font-bold mr-4"
          whileHover={{ 
            scale: 1.1,
            rotate: 360,
            transition: { duration: 0.5 }
          }}
        >
          {step}
        </motion.div>
        <motion.div 
          className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
      </div>
      
      <h3 className="text-2xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <motion.li 
            key={index}
            className="flex items-start text-sm text-text-secondary"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 * index }}
          >
            <CheckCircle className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
            {detail}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
)

const FeatureHighlight = ({ icon: Icon, title, description, delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  description: string
  delay?: number
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div 
      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent text-white mb-4"
      whileHover={{ 
        scale: 1.2,
        rotate: 360,
        transition: { duration: 0.5 }
      }}
    >
      <Icon className="w-10 h-10" />
    </motion.div>
    <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </motion.div>
)

const ProcessFlow = () => (
  <div className="relative">
    <motion.div 
      className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.2 }}
      style={{ originY: 0 }}
    />
    
    <div className="space-y-16">
      <StepCard
        step={1}
        icon={Search}
        title="Describe Your Need"
        description="Tell us what you need fixed or installed. Provide details about your project, preferred timing, and location."
        details={[
          "Choose from 50+ service categories",
          "Upload photos for better estimates", 
          "Set your preferred schedule",
          "Add specific requirements or preferences"
        ]}
        delay={0.1}
      />
      
      <StepCard
        step={2}
        icon={UserCheck}
        title="Get Matched with Pros"
        description="Our algorithm connects you with up to 5 qualified professionals in your area who specialize in your type of project."
        details={[
          "All pros are background-checked",
          "View ratings and reviews",
          "See portfolio of previous work",
          "Compare quotes and availability"
        ]}
        delay={0.2}
      />
      
      <StepCard
        step={3}
        icon={MessageSquare}
        title="Compare & Choose"
        description="Review profiles, read reviews, and chat with professionals to find the perfect match for your project."
        details={[
          "Direct messaging with pros",
          "Ask questions about the project",
          "Negotiate pricing and timeline",
          "View detailed service proposals"
        ]}
        delay={0.3}
      />
      
      <StepCard
        step={4}
        icon={Calendar}
        title="Schedule Service"
        description="Book your appointment at a time that works for you. Get confirmation and reminders leading up to the service."
        details={[
          "Flexible scheduling options",
          "Automatic calendar integration",
          "SMS and email reminders",
          "Easy rescheduling if needed"
        ]}
        delay={0.4}
      />
      
      <StepCard
        step={5}
        icon={CreditCard}
        title="Secure Payment"
        description="Pay safely through our platform with multiple payment options. Money is only released when you're satisfied."
        details={[
          "Multiple payment methods accepted",
          "Secure payment processing",
          "Payment held until job completion",
          "Dispute resolution support"
        ]}
        delay={0.5}
      />
      
      <StepCard
        step={6}
        icon={Star}
        title="Rate & Review"
        description="Share your experience to help other customers and contribute to our community of trusted professionals."
        details={[
          "Rate your service experience",
          "Leave detailed feedback",
          "Upload photos of completed work",
          "Help build community trust"
        ]}
        delay={0.6}
      />
    </div>
  </div>
)

export default function HowItWorksPage() {
  return (
    <PageLayout
      title="How Fixly Works"
      description="Getting quality home services has never been easier. Follow our simple 6-step process to connect with trusted professionals in your area."
    >
      {/* Hero Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">2 mins</div>
              <p className="text-text-secondary">Average time to post a job</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">24 hrs</div>
              <p className="text-text-secondary">Average response time</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">98%</div>
              <p className="text-text-secondary">Customer satisfaction rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Process Flow */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Simple Steps, Quality Results
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our streamlined process ensures you get connected with the right professional quickly and safely
            </p>
          </motion.div>

          <ProcessFlow />
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 glass-card mx-4 rounded-2xl my-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-text-secondary">
              Features that make your experience safe, simple, and successful
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureHighlight
              icon={Shield}
              title="Verified Pros"
              description="All professionals are background-checked and verified for your safety"
              delay={0.1}
            />
            <FeatureHighlight
              icon={Smartphone}
              title="Mobile Ready"
              description="Manage your projects on-the-go with our mobile-optimized platform"
              delay={0.2}
            />
            <FeatureHighlight
              icon={MapPin}
              title="Local Focus"
              description="Connect with trusted professionals right in your neighborhood"
              delay={0.3}
            />
            <FeatureHighlight
              icon={Clock}
              title="24/7 Support"
              description="Get help whenever you need it with our round-the-clock customer support"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Are You a Professional?
              </h2>
              <p className="text-xl text-text-secondary mb-6 leading-relaxed">
                Join thousands of skilled professionals who use Fixly to grow their business, 
                connect with quality customers, and build their reputation.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Get matched with customers in your area",
                  "Set your own rates and schedule",
                  "Build your professional profile",
                  "Secure payment processing",
                  "Grow your customer base"
                ].map((benefit, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center text-text-secondary"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
              <Link href="/auth/signup?role=fixer">
                <motion.button
                  className="btn-glass px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-glow-primary transition-all group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    Join as a Professional
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              className="glass-card p-8 rounded-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-text-primary mb-6">Professional Benefits</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 mt-1">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Build Your Reputation</h4>
                    <p className="text-text-secondary text-sm">Showcase your skills and build trust through customer reviews and ratings.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-4 mt-1">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Secure Payments</h4>
                    <p className="text-text-secondary text-sm">Get paid quickly and safely through our secure payment system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 mt-1">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Flexible Schedule</h4>
                    <p className="text-text-secondary text-sm">Work on your own terms with complete control over your availability.</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust Fixly for their home service needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button
                  className="btn-glass px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find a Professional
                </motion.button>
              </Link>
              <Link href="/services">
                <motion.button
                  className="btn-glass px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Services
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}