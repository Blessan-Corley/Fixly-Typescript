'use client'

import { motion } from 'framer-motion'
import { Briefcase, Heart, Users, Coffee, Zap, MapPin } from 'lucide-react'
import PageLayout from '@/components/layout/page-layout'

export default function CareersPage() {
  return (
    <PageLayout title="Careers" description="Join the Fixly family! We're building the future of home services and we need amazing people like you.">
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div className="glass-card p-8 rounded-2xl mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-bold text-primary">We're Hiring Amazing People</h2>
              <Coffee className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-lg text-secondary mb-6">
              At Fixly, we believe work should be fulfilling, fun, and make a real difference. 
              We're on a mission to connect people and fix problems – literally and figuratively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { icon: Users, title: "Remote-First", desc: "Work from anywhere in India" },
                { icon: Briefcase, title: "Growth", desc: "Learn, grow, and advance" },
                { icon: Zap, title: "Impact", desc: "Build something meaningful" }
              ].map((perk, i) => (
                <motion.div key={i} className="p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <perk.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold text-primary">{perk.title}</h3>
                  <p className="text-sm text-muted">{perk.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Open Positions */}
          <motion.div className="glass-card p-8 rounded-xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-primary mb-6">Current Openings</h2>
            <div className="space-y-4">
              {[
                { title: "Marketing", location: "Coimbatore/Remote", type: "Full-time" },
                { title: "Business lead", location: "Coimbatore/Remote", type: "Full-time" },
                { title: "Customer Success Manager", location: "Coimbatore/Remote", type: "Full-time" }
              ].map((job, i) => (
                <div key={i} className="flex justify-between items-center p-4 glass rounded-lg hover-lift-subtle">
                  <div className="text-left">
                    <h3 className="font-semibold text-primary">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <button className="btn-base btn-primary hover-glow">Apply</button>
                </div>
              ))}
            </div>
            <p className="text-secondary text-center mt-6">Don't see your role? Send us your resume anyway at careers@fixly.com</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}