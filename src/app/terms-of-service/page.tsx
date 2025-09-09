'use client'

import { motion } from 'framer-motion'
import { ScrollText, Handshake, AlertTriangle, Shield, Gavel, Users, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import PageLayout from '@/components/layout/page-layout'

const Section = ({ icon: Icon, title, children, delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  children: React.ReactNode
  delay?: number
}) => (
  <motion.div
    className="glass-card p-6 rounded-xl mb-8"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
    </div>
    <div className="text-text-secondary space-y-4">{children}</div>
  </motion.div>
)

function TermsOfServiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [returnUrl, setReturnUrl] = useState('')

  useEffect(() => {
    const urlParam = searchParams.get('returnUrl')
    if (urlParam) {
      setReturnUrl(decodeURIComponent(urlParam))
    }
  }, [searchParams])

  const handleGoBack = () => {
    if (returnUrl) {
      router.push(returnUrl)
    } else {
      router.back()
    }
  }
  return (
    <PageLayout
      title="Terms of Service"
      description="The fine print that's actually readable! These terms govern how Fixly works – think of them as the rules of the game, but friendlier."
    >
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          {returnUrl && (
            <motion.button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-primary hover:text-primary-600 font-medium mb-6 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Signup
            </motion.button>
          )}
          {/* Introduction */}
          <motion.div
            className="glass-card p-8 rounded-2xl mb-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <ScrollText className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Simple, Fair Terms</h2>
              <Handshake className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-text-secondary mb-4">
              Welcome to Fixly! These terms outline how our platform works and what we expect from each other. 
              We've tried to keep the legalese to a minimum because life's too short for complicated contracts.
            </p>
            <p className="text-sm text-text-muted">
              Last updated: Semptember 1, 2025 • By using Fixly, you agree to these terms
            </p>
          </motion.div>

          <Section icon={Users} title="Who Can Use Fixly" delay={0.1}>
            <p>To use our platform, you must be:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>At least 18 years old (sorry, no teenage entrepreneurs... yet!)</li>
              <li>Legally able to enter into contracts</li>
              <li>Not prohibited from using our services by applicable law</li>
              <li>A real human being (no bots, please)</li>
            </ul>
            <p>If you're representing a business, you confirm you have the authority to bind that business to these terms.</p>
          </Section>

          <Section icon={Handshake} title="How Fixly Works" delay={0.2}>
            <p><strong>For Customers:</strong> Post jobs, get quotes from verified fixers, choose who you want to work with, and pay through our secure platform.</p>
            
            <p><strong>For Fixers:</strong> Create a profile, browse available jobs, submit quotes, complete work, and get paid.</p>
            
            <p><strong>Our Role:</strong> We're the matchmaker, not the actual service provider. Think of us as the friendly middleman who makes sure everyone plays nice.</p>
            
            <p>We facilitate connections but don't directly provide the services. The actual work is between you and the fixer.</p>
          </Section>

          <Section icon={Shield} title="Account Responsibilities" delay={0.3}>
            <p>You're responsible for:</p>
            <div className="space-y-2">
              <p>• Providing accurate information (no fake names or addresses, please)</p>
              <p>• Keeping your login credentials secure</p>
              <p>• All activity that happens under your account</p>
              <p>• Notifying us immediately of any unauthorized use</p>
              <p>• Following our community guidelines and being respectful</p>
            </div>
            <p className="text-sm italic">Basically: be honest, be secure, and be nice to everyone.</p>
          </Section>

          <Section icon={Gavel} title="Payment Terms" delay={0.4}>
            <p><strong>Service Fees:</strong> We charge a small fee for facilitating transactions. Fees are clearly displayed before you commit to anything.</p>
            
            <p><strong>Payment Protection:</strong> Payments are held securely until work is completed to everyone's satisfaction.</p>
            
            <p><strong>Refunds:</strong> Refunds are handled on a case-by-case basis. We'll work with both parties to find a fair resolution.</p>
            
            <p><strong>Taxes:</strong> You're responsible for any applicable taxes on your earnings or purchases. We're not tax advisors!</p>
          </Section>

          <Section icon={AlertTriangle} title="What's Not Allowed" delay={0.5}>
            <p>Please don't:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use fake information or impersonate others</li>
              <li>Post jobs for illegal activities or services</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Try to circumvent our platform or payment system</li>
              <li>Spam or post irrelevant content</li>
              <li>Violate any laws or regulations</li>
              <li>Upload malicious content or viruses</li>
            </ul>
            <p>Basically: don't be that person. We reserve the right to suspend or terminate accounts that violate these rules.</p>
          </Section>

          <Section icon={ScrollText} title="Dispute Resolution" delay={0.6}>
            <p>If something goes wrong:</p>
            
            <p><strong>Step 1:</strong> Try to work it out directly with the other party. Most issues can be resolved with good communication.</p>
            
            <p><strong>Step 2:</strong> If that doesn't work, contact our support team. We'll investigate and help mediate.</p>
            
            <p><strong>Step 3:</strong> For serious disputes, we may recommend professional mediation or arbitration.</p>
            
            <p>We want everyone to have a positive experience, so we'll do our best to help resolve conflicts fairly.</p>
          </Section>

          {/* Limitation of Liability */}
          <motion.div
            className="glass-card p-6 rounded-xl border-l-4 border-l-accent mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="font-bold text-text-primary mb-3">Important Legal Stuff</h3>
            <div className="text-text-secondary space-y-3">
              <p><strong>Disclaimer:</strong> We provide the platform "as is" without warranties. We can't guarantee that every job will go perfectly or that every user will be amazing.</p>
              
              <p><strong>Liability Limits:</strong> Our liability is limited to the amount you've paid us for services. We're not responsible for indirect damages, lost profits, or other consequential losses.</p>
              
              <p><strong>Third Party Services:</strong> We work with payment processors and other service providers. We're not responsible for their actions or failures.</p>
            </div>
          </motion.div>

          {/* Final Section */}
          <motion.div
            className="glass-card p-8 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold text-text-primary mb-4">Questions?</h3>
            <p className="text-text-secondary mb-6">
              These terms might seem long, but they're designed to protect everyone and keep Fixly running smoothly. 
              If you have questions about any of this, don't hesitate to reach out – we're always happy to clarify.
            </p>
            <p className="text-sm text-text-muted">
              Contact us at <strong>legal@fixly.com</strong> • Mumbai, India • We typically respond within 24 hours
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}

export default function TermsOfServicePage() {
  return (
    <Suspense fallback={
      <PageLayout
        title="Terms of Service"
        description="The fine print that's actually readable! These terms govern how Fixly works – think of them as the rules of the game, but friendlier."
      >
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-8 rounded-2xl text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-text-secondary">Loading...</p>
            </div>
          </div>
        </section>
      </PageLayout>
    }>
      <TermsOfServiceContent />
    </Suspense>
  )
}