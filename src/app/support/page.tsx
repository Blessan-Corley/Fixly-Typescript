'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Phone, Mail, Clock, Search, 
  ChevronRight, User, Settings, CreditCard, Shield,
  FileText, AlertCircle, CheckCircle, ExternalLink
} from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  summary: string;
  readTime: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ContactMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  availability: string;
  response: string;
  action: string;
  primary: boolean;
}

const supportCategories: SupportCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'New to Fixly? Start here for the basics',
    icon: User,
    articles: [
      {
        id: '1',
        title: 'How to create your first job posting',
        summary: 'Step-by-step guide to posting your first repair job',
        readTime: '3 min read'
      },
      {
        id: '2', 
        title: 'Understanding fixer profiles and ratings',
        summary: 'Learn how to choose the right professional for your job',
        readTime: '2 min read'
      },
      {
        id: '3',
        title: 'Setting up your account and profile',
        summary: 'Complete your profile for better matches',
        readTime: '4 min read'
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Billing', 
    description: 'Everything about payments, refunds, and billing',
    icon: CreditCard,
    articles: [
      {
        id: '4',
        title: 'How payments work on Fixly',
        summary: 'Understanding our secure payment process',
        readTime: '5 min read'
      },
      {
        id: '5',
        title: 'Requesting refunds and disputes',
        summary: 'When things don\'t go as planned, here\'s what to do',
        readTime: '3 min read'
      },
      {
        id: '6',
        title: 'Payment methods and security',
        summary: 'Supported payment options and security measures',
        readTime: '2 min read'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Settings',
    description: 'Managing your account, privacy, and preferences',
    icon: Settings,
    articles: [
      {
        id: '7',
        title: 'Updating your profile information',
        summary: 'Keep your account details current',
        readTime: '2 min read'
      },
      {
        id: '8',
        title: 'Privacy settings and data control',
        summary: 'Manage what information you share',
        readTime: '4 min read'
      },
      {
        id: '9',
        title: 'Notification preferences',
        summary: 'Control how and when we contact you',
        readTime: '3 min read'
      }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Trust',
    description: 'Safety guidelines and trust & safety policies',
    icon: Shield,
    articles: [
      {
        id: '10',
        title: 'Our safety verification process',
        summary: 'How we ensure all fixers are qualified and trustworthy',
        readTime: '4 min read'
      },
      {
        id: '11',
        title: 'Reporting issues and concerns',
        summary: 'Steps to take if something goes wrong',
        readTime: '3 min read'
      },
      {
        id: '12',
        title: 'Insurance coverage and protection',
        summary: 'Understanding what\'s covered during service',
        readTime: '5 min read'
      }
    ]
  }
];

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How quickly can I get a fixer?',
    answer: 'Most fixers respond within 15-30 minutes. For urgent jobs, we have emergency fixers available 24/7 in major cities.',
    category: 'general'
  },
  {
    id: '2', 
    question: 'What if I\'m not satisfied with the work?',
    answer: 'We offer a satisfaction guarantee. If you\'re not happy, we\'ll work with you and the fixer to make it right, or provide a refund.',
    category: 'general'
  },
  {
    id: '3',
    question: 'Are all fixers background-checked?',
    answer: 'Yes, every fixer goes through identity verification, background checks, and skill assessment before joining our platform.',
    category: 'safety'
  },
  {
    id: '4',
    question: 'How do I cancel a booking?',
    answer: 'You can cancel up to 2 hours before the scheduled time without charges. For cancellations within 2 hours, a small fee may apply.',
    category: 'booking'
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets like Paytm and PhonePe.',
    category: 'payment'
  },
  {
    id: '6',
    question: 'Is my data safe with Fixly?',
    answer: 'Absolutely. We use bank-level encryption and never sell your personal data. Read our privacy policy for complete details.',
    category: 'privacy'
  }
];

const contactMethods: ContactMethod[] = [
  {
    id: 'chat',
    name: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    availability: '24/7',
    response: 'Instant',
    action: 'Start Chat',
    primary: true
  },
  {
    id: 'phone',
    name: 'Phone Support',
    description: 'Speak directly with a support representative',
    icon: Phone,
    availability: '8 AM - 10 PM',
    response: 'Immediate',
    action: 'Call Now',
    primary: true
  },
  {
    id: 'email',
    name: 'Email Support',
    description: 'Send us detailed questions or feedback',
    icon: Mail,
    availability: 'Always open',
    response: '< 4 hours',
    action: 'Send Email',
    primary: false
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = supportCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20 pb-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                How Can We Help You?
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                Find answers, get support, and learn how to make the most of Fixly
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-500"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Contact */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Need Immediate Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-white/80 backdrop-blur-sm border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                    method.primary ? 'border-blue-200' : 'border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${
                    method.primary ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <method.icon className={`w-6 h-6 ${
                      method.primary ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{method.name}</h3>
                  <p className="text-slate-600 mb-4">{method.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{method.availability}</span>
                    </div>
                    <span>{method.response}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 font-medium rounded-xl transition-colors ${
                      method.primary
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {method.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Help Categories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Browse Help Topics</h2>
            <div className="space-y-4">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h3>
                        <p className="text-slate-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{category.articles.length} articles</span>
                      <motion.div
                        animate={{ rotate: selectedCategory === category.id ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-6 h-6 text-slate-400" />
                      </motion.div>
                    </div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: selectedCategory === category.id ? 'auto' : 0,
                      opacity: selectedCategory === category.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-slate-200">
                      <div className="pt-6 space-y-4">
                        {category.articles.map((article, articleIndex) => (
                          <motion.div
                            key={article.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: articleIndex * 0.05 }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {article.title}
                              </h4>
                              <p className="text-sm text-slate-600 mb-2">{article.summary}</p>
                              <span className="text-xs text-slate-500">{article.readTime}</span>
                            </div>
                            <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-slate-600">Quick answers to common questions</p>
            </motion.div>

            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFAQ === faq.id ? 'auto' : 0,
                      opacity: expandedFAQ === faq.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 border-t border-slate-200">
                      <p className="text-slate-600 pt-4">{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12 text-white"
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Can't find what you're looking for? Our support team is here to help you get back on track.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Submit Feedback
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}