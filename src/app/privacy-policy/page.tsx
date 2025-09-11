'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Database, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
  details?: string[];
}

const privacySections: PrivacySection[] = [
  {
    id: 'data-collection',
    title: 'What We Collect (And Why We\'re Not Creepy About It)',
    icon: Database,
    content: 'We collect information to make Fixly work better for you, not to sell your data to the highest bidder like some companies *cough* we won\'t name.',
    details: [
      'Personal Information: Name, email, phone number (the basics to know who you are)',
      'Profile Information: Location, skills, preferences (to match you with the right fixers)',
      'Job Details: What needs fixing, photos, descriptions (so fixers know what they\'re getting into)',
      'Communication Data: Messages between users (to help resolve disputes and improve service)',
      'Usage Analytics: How you use the app (to make it less confusing and more awesome)',
      'Payment Information: Processed securely through trusted payment gateways (we never see your full card details)'
    ]
  },
  {
    id: 'data-usage',
    title: 'How We Use Your Data (The Good Stuff)',
    icon: Eye,
    content: 'Your data helps us connect you with great fixers and make the platform better. We\'re not in the business of spam or creepy advertising.',
    details: [
      'Matching customers with qualified fixers in their area',
      'Processing payments and managing transactions',
      'Sending important notifications about your jobs',
      'Improving our recommendation algorithms',
      'Preventing fraud and keeping the platform safe',
      'Customer support and dispute resolution',
      'Legal compliance and safety measures'
    ]
  },
  {
    id: 'data-sharing',
    title: 'Who We Share Data With (Spoiler: Very Few People)',
    icon: Users,
    content: 'We don\'t sell your personal information. Period. We only share what\'s necessary to make the service work.',
    details: [
      'Other Users: Only relevant job details and public profile information',
      'Payment Processors: Secure payment handling (Razorpay, Stripe, etc.)',
      'SMS/Email Services: For sending notifications and updates',
      'Analytics Tools: Anonymized usage data to improve the platform',
      'Legal Authorities: Only when required by law (we\'ll fight it if it\'s unreasonable)',
      'Service Providers: Vetted partners who help us operate the platform'
    ]
  },
  {
    id: 'data-security',
    title: 'How We Protect Your Data (Fort Knox Style)',
    icon: Shield,
    content: 'We take security seriously. Your data is encrypted, protected, and guarded better than the recipe for Coca-Cola.',
    details: [
      'End-to-end encryption for sensitive communications',
      'Secure HTTPS connections for all data transmission',
      'Regular security audits and vulnerability testing',
      'Limited employee access with strict authorization',
      'Secure cloud infrastructure with backup systems',
      'Two-factor authentication for user accounts',
      'Automatic data breach detection and response'
    ]
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking (The Digital Kind)',
    icon: AlertTriangle,
    content: 'We use cookies to make the site work better, not to track you across the internet like a digital stalker.',
    details: [
      'Essential Cookies: Required for the platform to function properly',
      'Analytics Cookies: Help us understand how to improve the user experience',
      'Preference Cookies: Remember your settings and preferences',
      'No Third-Party Tracking: We don\'t allow advertisers to track you on our platform',
      'Cookie Control: You can manage cookie preferences in your browser',
      'Session Management: Keep you logged in securely'
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Rights (Because You\'re In Control)',
    icon: CheckCircle,
    content: 'Your data, your rules. You have complete control over your information and we make it easy to exercise your rights.',
    details: [
      'Access Your Data: Download everything we have about you',
      'Correct Your Data: Update or fix any incorrect information',
      'Delete Your Data: Permanently remove your account and data',
      'Portability: Take your data to another service if you want',
      'Object to Processing: Opt out of certain data uses',
      'Withdraw Consent: Change your mind about data sharing anytime',
      'File Complaints: Contact us or regulatory authorities if you have concerns'
    ]
  }
];

export default function PrivacyPolicyPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('data-collection');
  const [lastUpdated] = useState('January 10, 2025');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
            className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full text-slate-700 font-medium mb-8"
          >
            <Lock className="w-5 h-5" />
            Privacy Policy
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Your Privacy Matters
            <br />
            <span className="text-slate-600">(And We Actually Mean It)</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            We believe privacy shouldn't be complicated. This policy explains how we handle your data in plain English, 
            without the legal jargon that makes your eyes glaze over.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-slate-500"
          >
            Last updated: {lastUpdated}
          </motion.div>
        </motion.div>

        {/* Quick Summary */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-3xl p-8 shadow-elevated hover-lift-subtle"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              TL;DR - The Quick Version 📝
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-slate-100 p-4 rounded-2xl mb-4 inline-flex">
                  <Shield className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">We Protect Your Data</h3>
                <p className="text-sm text-slate-600">Bank-level security, encryption, and strict access controls</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-2xl mb-4 inline-flex">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">No Data Selling</h3>
                <p className="text-sm text-slate-600">We never sell your personal information to third parties</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-100 p-4 rounded-2xl mb-4 inline-flex">
                  <CheckCircle className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">You're In Control</h3>
                <p className="text-sm text-slate-600">Access, modify, or delete your data anytime you want</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-4">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-subtle hover:shadow-elevated card-hover"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-8 py-6 text-left flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="bg-slate-100 p-3 rounded-2xl">
                    <section.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{section.title}</h3>
                    <p className="text-slate-600">{section.content}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === section.id ? 'auto' : 0,
                    opacity: expandedSection === section.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 border-t border-slate-100">
                    <div className="pt-6">
                      {section.details && (
                        <ul className="space-y-3">
                          {section.details.map((detail, detailIndex) => (
                            <motion.li
                              key={detailIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: detailIndex * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700">{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-50/50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-3xl p-12"
            >
              <Mail className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Got Questions About Your Privacy?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                We're here to help! If anything in this policy is unclear or if you have specific questions about how we handle your data, just ask.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="mailto:privacy@fixly.in"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-700 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl btn-hover transition-all duration-300"
                >
                  Email Our Privacy Team
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white hover:text-slate-700 btn-hover transition-all duration-300"
                >
                  Contact Support
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-slate-500 space-y-2"
          >
            <p>
              This privacy policy is effective as of {lastUpdated} and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
            <p>
              We reserve the right to update or change this policy at any time, and you should check this page periodically. 
              Changes will be effective immediately upon posting (we'll also email you about significant changes).
            </p>
            <p className="font-medium text-slate-700 mt-4">
              Remember: You're not just a user, you're a person with rights. We respect that. 🤝
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}