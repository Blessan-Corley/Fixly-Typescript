'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Cookie, 
  Shield, 
  Eye, 
  Lock, 
  Settings, 
  Globe,
  Users,
  BarChart3,
  CheckCircle
} from 'lucide-react'
import PageLayout from '@/components/layout/page-layout'

interface CookieType {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  examples: string[]
}

interface ThirdPartyService {
  name: string
  purpose: string
  type: string
}

export default function CookiesPage() {
  const router = useRouter()

  const cookieTypes: CookieType[] = [
    {
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Lock,
      examples: [
        'Authentication and login status',
        'Security and fraud prevention',
        'Shopping cart and order processing',
        'Form submission and data validation'
      ]
    },
    { 
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors use our website.',
      icon: BarChart3,
      examples: [
        'Page views and user interactions',
        'Traffic sources and referrals',
        'Performance and loading times',
        'Popular content and features'
      ]
    },
    { 
      title: 'Preference Cookies',
      description: 'These cookies remember your choices and personalize your experience.',
      icon: Settings,
      examples: [
        'Language and region preferences',
        'Display settings and themes',
        'Notification preferences',
        'Location sharing preferences',
        'Saved searches and favorites'
      ]
    },
    { 
      title: 'Location Cookies',
      description: 'These cookies store your location preferences and GPS coordinates when enabled.',
      icon: Globe,
      examples: [
        'GPS coordinates for nearby job matching',
        'Location sharing preferences (enabled/disabled)',
        'City and state information',
        'Travel distance preferences',
        'Last known location timestamp'
      ]
    },
    {
      title: 'Social Media Cookies',
      description: 'These cookies enable social media features and content sharing.',
      icon: Users,
      examples: [
        'Social media login integration',
        'Content sharing buttons',
        'Social media feeds and widgets',
        'Profile synchronization'
      ]
    }
  ]

  const thirdPartyServices: ThirdPartyService[] = [
    {
      name: 'Google Analytics',
      purpose: 'Website analytics and performance tracking',
      type: 'Analytics'
    },
    {
      name: 'Google Ads',
      purpose: 'Advertising and conversion tracking',
      type: 'Marketing'
    },
    {
      name: 'Facebook Pixel',
      purpose: 'Social media integration and advertising',
      type: 'Social & Marketing'
    },
    { 
      name: 'NextAuth.js',
      purpose: 'User authentication and session management',
      type: 'Essential'
    }
  ]

  return (
    <PageLayout
      title="Cookie Policy"
      description="Learn how Fixly uses cookies to improve your browsing experience and provide better services."
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cookie className="h-10 w-10 text-slate-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How Fixly Uses Cookies
          </h1>
          <p className="text-xl text-slate-600">
            Learn about how we use cookies to improve your experience on our platform
          </p>
        </motion.div>

        {/* What Are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What Are Cookies?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            As is common practice with almost all professional websites, Fixly uses cookies, which are tiny files 
            that are downloaded to your device, to improve your experience. These small text files help us remember 
            your preferences, keep you logged in, and understand how you use our service marketplace.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This page describes what information cookies gather, how we use it, and why we sometimes need to store 
            these cookies. We'll also explain how you can control these cookies, though disabling some may affect 
            certain features of Fixly's functionality.
          </p>
        </motion.div>

        {/* How We Use Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">How Fixly Uses Cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            We use cookies for various reasons to enhance your experience on Fixly. Unfortunately, in most cases, 
            there are no industry-standard options for disabling cookies without completely disabling the 
            functionality they provide to our service marketplace.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We recommend leaving all cookies enabled if you're unsure whether you need them, as they may be used 
            to provide services you use on Fixly, such as job posting, fixer matching, and secure payments.
          </p>
        </motion.div>

        {/* Cookie Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Types of Cookies We Use</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <type.icon className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {type.title}
                  </h3>
                </div>
                
                <p className="text-slate-600 mb-4">
                  {type.description}
                </p>
                
                <ul className="space-y-2">
                  {type.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-500">{example}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Third Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Third-Party Services</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Fixly uses trusted third-party services to provide certain features. These services may set their own 
            cookies to enable functionality such as analytics, authentication, and social media integration.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                </tr>
              </thead>
              <tbody>
                {thirdPartyServices.map((service, index) => (
                  <tr key={service.name} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-900">{service.name}</td>
                    <td className="py-3 px-4 text-slate-600">{service.purpose}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {service.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Managing Your Cookie Preferences</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            You can control and manage cookies in several ways. Most web browsers automatically accept cookies, 
            but you can usually modify your browser settings to decline cookies if you prefer.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            Please note that disabling cookies may affect the functionality of Fixly and many other websites. 
            Some features like user authentication, job applications, and personalized recommendations may not 
            work properly without cookies enabled.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Important Note</h4>
                <p className="text-sm text-slate-600">
                  Disabling essential cookies will prevent you from using core Fixly features such as posting jobs, 
                  applying for work, making payments, and accessing your dashboard.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">More Information</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            We hope this clarifies how Fixly uses cookies. If there's something you're unsure about, it's usually 
            safer to leave cookies enabled in case they interact with features you use on our platform.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            If you're still looking for more information or have questions about our cookie policy, 
            please don't hesitate to contact us through one of our preferred methods:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:blessancorley@gmail.com"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 btn-hover flex items-center justify-center"
            >
              Email Support
            </a>
            <button 
              onClick={() => router.push('/contact')}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 btn-hover"
            >
              Contact Form
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}