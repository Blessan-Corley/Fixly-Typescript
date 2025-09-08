'use client'

import { motion } from 'framer-motion'
import { Search, HelpCircle, MessageCircle, Phone, Mail, Book } from 'lucide-react'
import PageLayout from '@/components/layout/page-layout'

export default function HelpCenterPage() {
  return (
    <PageLayout title="Help Center" description="Got questions? We've got answers! Find everything you need to know about using Fixly like a pro.">
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Search */}
          <motion.div className="glass-card p-6 rounded-xl mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Search className="w-6 h-6 text-primary" />
              <input className="w-full max-w-md px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none" placeholder="Search for help topics..." />
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: HelpCircle, title: "Getting Started", desc: "New to Fixly? Start here!" },
              { icon: MessageCircle, title: "Account & Billing", desc: "Manage your account and payments" },
              { icon: Phone, title: "Safety & Trust", desc: "How we keep everyone safe" }
            ].map((item, i) => (
              <motion.div key={i} className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all cursor-pointer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Popular Questions */}
          <motion.div className="glass-card p-8 rounded-xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I post a job?", a: "Click 'Find a Fixer', describe your job, and get quotes from verified professionals!" },
                { q: "How are fixers verified?", a: "Every fixer goes through background checks, skill verification, and customer review screening." },
                { q: "What if I'm not satisfied?", a: "We have a satisfaction guarantee and dispute resolution process to make things right." }
              ].map((faq, i) => (
                <div key={i} className="pb-4 border-b border-border-subtle last:border-b-0">
                  <h4 className="font-semibold text-text-primary mb-2">{faq.q}</h4>
                  <p className="text-text-secondary">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}