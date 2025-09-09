'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Cookie, Database, Lock, Users, AlertTriangle, Mail, Calendar, ArrowLeft, Loader2 } from 'lucide-react'
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

function PrivacyPolicyContent() {
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
      title="Privacy Policy"
      description="We take your privacy seriously (like, really seriously). Here's how we protect your data and why you can trust us with your information."
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
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Your Privacy Matters</h2>
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-text-secondary mb-4">
              At Fixly, we believe privacy isn't just a policy – it's a promise. This document explains how we collect, 
              use, and protect your personal information. We've written it in plain English because legal jargon is about 
              as useful as a chocolate teapot.
            </p>
            <p className="text-sm text-text-muted">
              Last updated: January 1, 2025 • Effective date: January 1, 2025
            </p>
          </motion.div>

          <Section icon={Database} title="Information We Collect" delay={0.1}>
            <p><strong>Personal Information:</strong> When you create an account, we collect basic info like your name, email, phone number, and location. Think of it as a digital handshake – we need to know who we're talking to!</p>
            
            <p><strong>Service Information:</strong> Details about jobs you post or complete, ratings, reviews, and payment information. This helps us make sure everyone has a great experience.</p>
            
            <p><strong>Technical Information:</strong> We collect device info, IP addresses, and how you use our platform. Don't worry – we're not spying on you, we're just trying to make things work better.</p>
            
            <p><strong>Communication Data:</strong> Messages between customers and fixers for quality assurance and dispute resolution. We only read them if there's a problem that needs solving.</p>
          </Section>

          <Section icon={Eye} title="How We Use Your Information" delay={0.2}>
            <div className="space-y-3">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connect you with the right fixers or customers</li>
                <li>Process payments securely (because nobody works for free)</li>
                <li>Send important updates and notifications</li>
                <li>Improve our platform based on how people actually use it</li>
                <li>Prevent fraud and keep everyone safe</li>
                <li>Provide customer support when things go sideways</li>
                <li>Comply with legal requirements (boring but necessary)</li>
              </ul>
            </div>
          </Section>

          <Section icon={Users} title="Information Sharing" delay={0.3}>
            <p>We share your information only when necessary:</p>
            
            <p><strong>With Other Users:</strong> Your profile info is visible to people you're doing business with. Fixers can see customer details for jobs they're working on, and vice versa.</p>
            
            <p><strong>With Service Providers:</strong> We work with payment processors, email services, and other tools to keep Fixly running smoothly. They only get the info they need to do their job.</p>
            
            <p><strong>For Legal Reasons:</strong> If required by law, court orders, or to protect safety. We're not lawyers, but we know when we have to comply.</p>
            
            <p><strong>Business Transfers:</strong> If Fixly gets acquired (fingers crossed!), your data would transfer to the new owners under the same privacy protections.</p>
          </Section>

          <Section icon={Cookie} title="Cookies and Tracking" delay={0.4}>
            <p>We use cookies (the digital kind – sadly, no chocolate chips involved) to:</p>
            <div className="ml-4 space-y-2">
              <p>• Remember your login and preferences</p>
              <p>• Analyze how people use our site to make improvements</p>
              <p>• Show relevant content and features</p>
              <p>• Prevent fraud and security issues</p>
            </div>
            <p>You can control cookies through your browser settings, but some features might not work properly without them.</p>
          </Section>

          <Section icon={Lock} title="Data Security" delay={0.5}>
            <p>We protect your data like it's our own family photos:</p>
            
            <p><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest. We use industry-standard security measures.</p>
            
            <p><strong>Access Controls:</strong> Only authorized employees can access personal data, and they're trained on privacy practices.</p>
            
            <p><strong>Regular Audits:</strong> We regularly review our security practices and update them as needed.</p>
            
            <p><strong>Incident Response:</strong> If something goes wrong, we'll notify you and relevant authorities as required by law.</p>
          </Section>

          <Section icon={AlertTriangle} title="Your Rights" delay={0.6}>
            <p>You have control over your personal information:</p>
            <div className="space-y-3">
              <p><strong>Access:</strong> You can request a copy of all the personal data we have about you.</p>
              <p><strong>Correction:</strong> Found something wrong? Let us know and we'll fix it.</p>
              <p><strong>Deletion:</strong> Want to delete your account? We'll remove your personal data (though we might keep some for legal reasons).</p>
              <p><strong>Portability:</strong> You can download your data in a standard format.</p>
              <p><strong>Objection:</strong> Don't like how we're using your data? You can object to certain types of processing.</p>
            </div>
            <p className="text-sm italic">To exercise these rights, just contact us at privacy@fixly.com. We'll respond within 30 days (usually much faster).</p>
          </Section>

          <Section icon={Calendar} title="Data Retention" delay={0.7}>
            <p>We don't keep your data forever:</p>
            
            <p><strong>Active Accounts:</strong> We keep your data as long as your account is active and for a reasonable period after to handle any issues.</p>
            
            <p><strong>Deleted Accounts:</strong> When you delete your account, we remove personal data within 90 days (some data might be retained for legal compliance).</p>
            
            <p><strong>Legal Requirements:</strong> Some data (like financial records) must be kept longer for tax and legal reasons.</p>
          </Section>

          <Section icon={Mail} title="Contact Us" delay={0.8}>
            <p>Questions about this privacy policy? We're here to help:</p>
            <div className="mt-4 space-y-2">
              <p><strong>Email:</strong> privacy@fixly.com</p>
              <p><strong>Address:</strong> Privacy Team, Fixly Technologies, 123 Innovation Street, Mumbai 400050, India</p>
              <p><strong>Response Time:</strong> We'll get back to you within 5 business days (usually much sooner)</p>
            </div>
          </Section>

          {/* Changes Notice */}
          <motion.div
            className="glass-card p-6 rounded-xl border-l-4 border-l-accent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h3 className="font-bold text-text-primary mb-2">Changes to This Policy</h3>
            <p className="text-text-secondary">
              We may update this privacy policy from time to time. When we do, we'll post the new version here and 
              notify you via email or through our platform. The "last updated" date at the top will always reflect 
              the most recent changes. Keep checking back – we promise to keep it readable and relevant.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-text-secondary">Loading Privacy Policy...</p>
          </div>
        </div>
      </PageLayout>
    }>
      <PrivacyPolicyContent />
    </Suspense>
  )
}