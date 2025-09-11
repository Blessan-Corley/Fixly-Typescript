'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Headphones,
  Users,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'
import PageLayout from '@/components/layout/page-layout'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  category: string
}

interface ContactMethod {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  value: string
  action: string | null
  primary: boolean
}

interface SupportCategory {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      // Send form data to backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        toast.success(data.message || 'Message sent successfully! We\'ll get back to you soon.')
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'general'
        })
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.')
      }
      
    } catch (error) {
      console.error('Contact form submission error:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactMethods: ContactMethod[] = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      value: 'blessancorley@gmail.com',
      action: 'mailto:blessancorley@gmail.com',
      primary: true
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      value: '+91 9976768211',
      action: 'tel:+919976768211',
      primary: true
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Support',
      description: 'Chat with us on WhatsApp for quick help',
      value: '+91 9976768211',
      action: 'https://wa.me/919976768211?text=Hi! I need help with Fixly.',
      primary: true
    },
    {
      icon: MapPin,
      title: 'Location',
      description: 'We\'re based in Tamil Nadu, India',
      value: 'Coimbatore, Tamil Nadu',
      action: null,
      primary: false
    },
    {
      icon: Clock,
      title: 'Support Hours',
      description: 'Our team is available to help you',
      value: 'Mon-Sat: 9 AM - 8 PM IST',
      action: null,
      primary: false
    }
  ]

  const supportCategories: SupportCategory[] = [
    {
      icon: Users,
      title: 'General Inquiry',
      description: 'Questions about our platform and services'
    },
    {
      icon: HelpCircle,
      title: 'Technical Support',
      description: 'Issues with the website or mobile app'
    },
    {
      icon: AlertCircle,
      title: 'Report an Issue',
      description: 'Report problems with users or services'
    },
    {
      icon: Headphones,
      title: 'Account Help',
      description: 'Issues with your account or billing'
    }
  ]

  const faqItems: FAQ[] = [
    {
      question: 'How do I create an account?',
      answer: 'Click "Get Started" on our homepage and choose whether you\'re a hirer or fixer. Follow the simple signup process to create your account.'
    },
    {
      question: 'How does pricing work?',
      answer: 'Fixers set their own rates. Hirers can see quotes before hiring. We offer a Pro subscription for ₹99/month for unlimited applications.'
    },
    {
      question: 'Are fixers verified?',
      answer: 'Yes, all fixers go through our verification process including background checks and skill assessment for your safety and peace of mind.'
    },
    { 
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We have a dispute resolution process. Contact our support team and we\'ll help mediate between you and the service provider.'
    }
  ]

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with our support team for any questions or assistance you need."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Have questions, feedback, or need help? We're here to assist you. 
            Our friendly support team is ready to help you get the most out of Fixly.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card text-center p-6 hover-lift-subtle ${
                method.primary ? 'border-primary/30' : ''
              }`}
            >
              <method.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {method.title}
              </h3>
              <p className="text-text-muted text-sm mb-4">
                {method.description}
              </p>
              {method.action ? (
                <a
                  href={method.action}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {method.value}
                </a>
              ) : (
                <span className="text-text-primary font-medium">
                  {method.value}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Send us a Message
            </h2>
            <p className="text-text-secondary mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-text-secondary mb-6">
                  Thank you for contacting us. We'll respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Account</option>
                      <option value="report">Report an Issue</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-vertical"
                    placeholder="Please describe your question or issue in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Support Information */}
          <div className="space-y-8">
            {/* Support Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                How Can We Help?
              </h2>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start p-4 rounded-lg hover:bg-surface-elevated transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <category.icon className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        {category.title}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {category.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Response Promise */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card border-primary/30 p-6"
            >
              <div className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Quick Response Guarantee
                </h3>
                <p className="text-text-secondary">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-border-subtle pb-4 last:border-b-0">
                    <h3 className="font-semibold text-text-primary mb-2">
                      {item.question}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card mt-12 p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Other Ways to Reach Us
          </h2>
          <p className="text-text-secondary mb-6">
            Choose the method that works best for you. We're committed to providing 
            excellent customer service and support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:blessancorley@gmail.com"
              className="btn btn-primary flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </a>
            <a 
              href="tel:+919976768211"
              className="btn btn-secondary flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </a>
            <a 
              href="https://wa.me/919976768211?text=Hi! I need help with Fixly."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent flex items-center justify-center"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              WhatsApp Chat
            </a>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}