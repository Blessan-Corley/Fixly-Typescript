'use client'

import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import PageLayout from '@/components/layout/page-layout'

export default function BlogPage() {
  const mockPosts = [
    { title: "10 Home Maintenance Tips That Actually Work", author: "Team Fixly", date: "Jan 15, 2025", excerpt: "Learn the secrets pros don't want you to know about keeping your home in perfect condition." },
    { title: "The Psychology of Finding the Perfect Fixer", author: "Blessan Corley", date: "Jan 10, 2025", excerpt: "It's not just about skills – it's about finding someone who gets you. Here's how we match personalities too." },
    { title: "From Broken to Beautiful: Customer Success Stories", author: "Vinoth Kumar", date: "Jan 5, 2025", excerpt: "Real stories from real customers about transformations that went beyond just 'fixing' things." },
    { title: "The Ultimate Guide to Home Repairs in 2025", author: "Dinesh Madhavan", date: "Dec 20, 2024", excerpt: "Everything you need to know about tackling common home repairs this year." }
  ]

  return (
    <PageLayout title="Blog" description="Stories, tips, and insights from the world of home services. Because fixing things is both an art and a science.">
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Coming Soon: The Fixly Blog</h2>
            <p className="text-text-secondary">We're crafting amazing content about home services, DIY tips, and the stories behind the fixes. Stay tuned!</p>
          </motion.div>
          
          <div className="space-y-6">
            {mockPosts.map((post, i) => (
              <motion.div key={i} className="glass-card p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <h3 className="text-xl font-bold text-text-primary mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                </div>
                <p className="text-text-secondary mb-4">{post.excerpt}</p>
                <div className="flex items-center text-primary font-medium">
                  <span>Read more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}