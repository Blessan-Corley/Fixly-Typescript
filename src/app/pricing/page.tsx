'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, Crown, Sparkles } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  limitations: string[];
  popular: boolean;
  color: string;
  buttonText: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '₹0',
    period: '/forever',
    description: 'Perfect for trying out Fixly (and realizing you need more)',
    icon: Star,
    features: [
      '3 job posts per month',
      'Basic customer support',
      'Access to local fixers',
      'Standard response time',
      'Mobile app access'
    ],
    limitations: [
      'Limited to 3 posts',
      'No priority support',
      'Basic matching algorithm'
    ],
    popular: false,
    color: 'from-gray-500 to-gray-600',
    buttonText: 'Get Started (It\'s Free!)'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '₹299',
    period: '/month',
    description: 'For those who break things professionally 😄',
    icon: Zap,
    features: [
      '15 job posts per month',
      'Priority customer support',
      'Advanced fixer matching',
      'Faster response times',
      'Job scheduling tools',
      'Review & rating system',
      'In-app messaging'
    ],
    limitations: [
      'Limited to 15 posts',
      'Standard analytics'
    ],
    popular: true,
    color: 'from-blue-500 to-purple-600',
    buttonText: 'Go Pro!'
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: '₹999',
    period: '/month',
    description: 'When your business breaks more than your patience',
    icon: Crown,
    features: [
      'Unlimited job posts',
      '24/7 priority support',
      'Dedicated account manager',
      'Custom fixer network',
      'Advanced analytics',
      'API access',
      'White-label options',
      'Bulk job management',
      'Team collaboration tools'
    ],
    limitations: [],
    popular: false,
    color: 'from-purple-500 to-pink-600',
    buttonText: 'Scale Your Business'
  }
];

const faqs: FAQ[] = [
  {
    question: "Can I change my plan anytime?",
    answer: "Absolutely! You can upgrade, downgrade, or cancel anytime. We're not the type to hold grudges (or your data hostage)."
  },
  {
    question: "What happens if I exceed my job post limit?",
    answer: "We'll gently remind you (like a caring friend) and offer you the option to upgrade. No job posts will be blocked, but you might get some friendly nudges."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes! We offer a 30-day money-back guarantee. If Fixly doesn't fix your problems, we'll fix your bank account by refunding you."
  },
  {
    question: "Is there a contract or commitment?",
    answer: "Nope! We believe in earning your love, not trapping you in contracts. You're free to leave anytime (though we'll miss you terribly)."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Unfortunately, we don't accept IOUs or promises to pay later."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-6 py-3 rounded-full text-blue-700 dark:text-blue-300 font-medium mb-8"
          >
            <Sparkles className="w-5 h-5" />
            Simple, Transparent Pricing
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6"
          >
            Plans That Don't Break
            <br />
            <span className="text-gray-700 dark:text-gray-300">Your Budget</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Choose the perfect plan for your fixing needs. From occasional repairs to running a business empire of fixes!
          </motion.p>

          {/* Annual/Monthly Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <span className={`text-lg ${!isAnnual ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-blue-600 dark:bg-blue-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium"
              >
                Save 20%!
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-200 dark:border-blue-700 shadow-2xl scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600'
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular! 🎉
                    </span>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {isAnnual && plan.id !== 'free' 
                        ? `₹${Math.round(parseInt(plan.price.replace('₹', '')) * 0.8)}`
                        : plan.price
                      }
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">
                      {isAnnual && plan.id !== 'free' ? '/month (billed annually)' : plan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + featureIndex * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Limitations:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <motion.li
                            key={limitIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + limitIndex * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <X className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Because we know you have questions (and we have answers!)
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFAQ === index ? 'auto' : 0,
                      opacity: expandedFAQ === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Stop Breaking Things Alone?
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              Join thousands of people who've discovered that fixing things is easier when you don't have to do it yourself!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-100 text-blue-600 dark:text-blue-700 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Free Trial Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}