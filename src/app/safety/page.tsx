'use client'

import { motion } from 'framer-motion'
import { Shield, UserCheck, Lock, AlertTriangle, Phone, CheckCircle } from 'lucide-react'
import PageLayout from '@/components/layout/page-layout'

export default function SafetyPage() {
  return (
    <PageLayout title="Safety & Trust" description="Your safety is our priority. Here's how we keep everyone protected on the Fixly platform.">
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="glass-card p-8 rounded-2xl mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Safety First, Always</h2>
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-text-secondary">
              We've built multiple layers of protection to ensure every interaction on Fixly is safe, secure, and trustworthy.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                icon: UserCheck,
                title: "Verified Professionals",
                desc: "Every fixer undergoes identity verification, background checks, and skill assessment before joining our platform.",
                features: ["Government ID verification", "Criminal background checks", "Reference verification", "Skill and insurance verification"]
              },
              {
                icon: Lock,
                title: "Secure Payments",
                desc: "All payments are processed securely with industry-standard encryption and fraud protection.",
                features: ["Payment held in escrow", "Encrypted transactions", "Fraud monitoring", "Dispute resolution system"]
              },
              {
                icon: AlertTriangle,
                title: "Safety Guidelines",
                desc: "We provide clear safety guidelines and best practices for both customers and fixers.",
                features: ["Pre-service communication", "Emergency contact protocols", "Safety checklists", "Incident reporting system"]
              }
            ].map((section, i) => (
              <motion.div key={i} className="glass-card p-6 rounded-xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-2">{section.title}</h3>
                    <p className="text-text-secondary mb-4">{section.desc}</p>
                    <ul className="space-y-2">
                      {section.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="glass-card p-6 rounded-xl mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-l-primary" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-text-primary">Need Help?</h3>
            </div>
            <p className="text-text-secondary mb-4">
              If you ever feel unsafe or need immediate assistance, contact us right away. We're here 24/7 to help resolve any issues.
            </p>
            <div className="flex gap-4 text-sm">
              <span><strong>Emergency:</strong> 1800-FIXLY-911</span>
              <span><strong>Support:</strong> safety@fixly.com</span>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}