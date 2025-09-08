'use client'

import { motion } from 'framer-motion'
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Coffee,
  Heart,
  Users,
  Zap,
  Headphones
} from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/page-layout'

const ContactCard = ({ icon: Icon, title, description, info, color = "primary", delay = 0 }: {
  icon: React.ComponentType<any>
  title: string
  description: string
  info: string
  color?: string
  delay?: number
}) => (
  <motion.div
    className="glass-card p-6 rounded-xl text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -4 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ borderRadius: '12px' }}
    />
    
    <motion.div 
      className={`inline-flex p-4 rounded-full bg-${color}/10 text-${color} mb-4 group-hover:scale-110 transition-transform duration-300`}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-8 h-8" />
    </motion.div>
    
    <h3 className="text-xl font-bold text-text-primary mb-2 relative z-10">{title}</h3>
    <p className="text-text-secondary mb-4 relative z-10">{description}</p>
    <p className="font-semibold text-primary relative z-10">{info}</p>
  </motion.div>
)

export default function ContactUsPage() {
  return (
    <PageLayout
      title="Contact Us"
      description="Got questions? We've got answers (and probably some terrible jokes too). Reach out anytime – we're friendlier than your neighborhood barista!"
    >
      {/* Contact Options */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">We're Here to Help</h2>
              <Coffee className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Whether you need support, have a brilliant idea, or just want to say hi – we love hearing from you. 
              Our team responds faster than you can say "customer service" (and we're much more fun to talk to).
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <ContactCard
              icon={MessageCircle}
              title="Live Chat"
              description="Chat with our support ninjas who know everything (or at least pretend to)."
              info="Available 24/7"
              color="primary"
              delay={0.1}
            />
            <ContactCard
              icon={Mail}
              title="Email Support"
              description="Send us an email and get thoughtful responses that aren't just copy-paste magic."
              info="support@fixly.com"
              color="accent"
              delay={0.2}
            />
            <ContactCard
              icon={Phone}
              title="Phone Support"
              description="Call us for urgent matters or when you just need to hear a friendly voice."
              info="+91 1800-FIXLY-NOW"
              color="primary"
              delay={0.3}
            />
            <ContactCard
              icon={MapPin}
              title="Office Visit"
              description="Drop by our office for coffee and conversations (but call ahead – we might be fixing something)."
              info="Mumbai, India"
              color="accent"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
              <p className="text-text-secondary mb-8">
                Fill out the form below and we'll get back to you faster than a plumber fixes a leak 
                (okay, that might be setting the bar too high, but you get the idea).
              </p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your awesome name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your family's awesome name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Subject</label>
                  <select className="w-full px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Business Partnership</option>
                    <option>Feedback & Suggestions</option>
                    <option>I just want to say hi! 👋</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 glass rounded-xl border border-border-subtle focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us everything! We love long messages almost as much as we love short ones."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Quick Info */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-text-primary mb-4">Quick Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Business Hours</p>
                      <p className="text-sm text-text-secondary">24/7 Support (Because problems don't sleep)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-semibold text-text-primary">Response Time</p>
                      <p className="text-sm text-text-secondary">Within 2 hours (Usually much faster)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-text-primary">Support Team</p>
                      <p className="text-sm text-text-secondary">15+ friendly humans (no bots here!)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-text-primary mb-4">Quick Answers</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "How quickly can I get help?",
                      a: "Faster than you can make instant noodles! Usually within 2 hours."
                    },
                    {
                      q: "Do you really read every message?",
                      a: "Every single one! We're like digital pen pals who actually care."
                    },
                    {
                      q: "Can I suggest new features?",
                      a: "Please do! We love ideas almost as much as we love fixing things."
                    }
                  ].map((faq, index) => (
                    <motion.div 
                      key={index}
                      className="pb-4 border-b border-border-subtle last:border-b-0 last:pb-0"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <p className="font-semibold text-text-primary text-sm mb-1">{faq.q}</p>
                      <p className="text-text-secondary text-sm">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
                <Link href="/help-center">
                  <motion.button
                    className="mt-4 text-primary hover:text-primary-600 font-medium text-sm transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    View all FAQs →
                  </motion.button>
                </Link>
              </div>

              {/* Social */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-text-primary mb-4">Connect With Us</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Follow us for updates, tips, and the occasional meme about home repairs.
                </p>
                <div className="flex gap-3">
                  {[
                    { name: "Twitter", color: "blue" },
                    { name: "Instagram", color: "pink" },
                    { name: "LinkedIn", color: "blue" }
                  ].map((social, index) => (
                    <motion.button
                      key={social.name}
                      className={`px-4 py-2 bg-${social.color}-500/10 text-${social.color}-500 rounded-lg text-sm font-medium hover:bg-${social.color}-500/20 transition-colors`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="py-20 px-6 glass-card mx-4 rounded-2xl my-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-text-secondary">
              Located in the heart of Mumbai, our office is always buzzing with activity and good coffee.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-text-primary mb-6">Fixly Headquarters</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-text-primary">Address</p>
                    <p className="text-text-secondary">
                      123 Innovation Street<br />
                      Bandra West, Mumbai 400050<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <p className="font-semibold text-text-primary">Office Hours</p>
                    <p className="text-text-secondary">
                      Monday - Friday: 9:00 AM - 7:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed (We're recharging our fixing powers)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-text-primary">What to Expect</p>
                    <p className="text-text-secondary">
                      Great coffee, friendly faces, and maybe a demo of our latest features. 
                      Just call ahead – we might be out fixing something!
                    </p>
                  </div>
                </div>
              </div>
              
              <motion.button
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-5 h-5 group-hover:bounce transition-transform" />
                Get Directions
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-4 rounded-2xl"
            >
              <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-text-primary font-semibold mb-2">Interactive Map</p>
                  <p className="text-text-secondary text-sm">
                    Map integration would go here in a real implementation
                  </p>
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
              Still Have Questions?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't be shy! We're here to help and we promise we won't judge your DIY disasters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Live Chat
              </motion.button>
              <Link href="/help-center">
                <motion.button
                  className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Help Center
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}