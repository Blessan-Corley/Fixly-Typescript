'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Handshake, Shield, AlertTriangle, Scale, CheckCircle, Mail } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string[];
  important?: boolean;
}

const termsSections: TermsSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: [
      'By accessing or using Fixly, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any part of these terms, you may not use our service.',
      'These terms apply to all visitors, users, and others who access or use the service.'
    ]
  },
  {
    id: 'eligibility',
    title: 'Who Can Use Fixly',
    icon: Users,
    content: [
      'You must be at least 18 years old to use our platform.',
      'You must be legally capable of entering into binding contracts.',
      'You must provide accurate and complete information when creating an account.',
      'You are responsible for maintaining the security of your account credentials.'
    ]
  },
  {
    id: 'platform',
    title: 'How Our Platform Works', 
    icon: Handshake,
    content: [
      'Fixly is a marketplace that connects customers with service professionals.',
      'We do not directly provide repair or maintenance services.',
      'All services are performed by independent contractors (fixers).',
      'We facilitate communication, payments, and dispute resolution between parties.'
    ]
  },
  {
    id: 'responsibilities',
    title: 'User Responsibilities',
    icon: Shield,
    content: [
      'Provide accurate information in your profile and job postings.',
      'Treat all users with respect and professionalism.',
      'Follow all applicable laws and regulations.',
      'Respect intellectual property rights of others.',
      'Use the platform only for legitimate business purposes.'
    ]
  },
  {
    id: 'prohibited',
    title: 'Prohibited Activities',
    icon: AlertTriangle,
    content: [
      'Posting false, misleading, or fraudulent information.',
      'Harassing, threatening, or discriminating against other users.',
      'Attempting to circumvent our fee structure.',
      'Using the platform for illegal activities.',
      'Spamming or posting irrelevant content.',
      'Attempting to damage or compromise our systems.'
    ],
    important: true
  },
  {
    id: 'payments',
    title: 'Payment Terms',
    icon: Scale,
    content: [
      'Service fees are clearly displayed before booking confirmation.',
      'Payments are processed securely through our payment partners.',
      'Funds are held in escrow until job completion.',
      'Refunds are subject to our refund policy and dispute resolution process.',
      'Users are responsible for applicable taxes on their transactions.'
    ]
  }
];

export default function TermsOfServicePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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
            <FileText className="w-5 h-5" />
            Terms of Service
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Terms of Service
            <br />
            <span className="text-blue-600">Clear & Simple</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            These terms govern your use of Fixly. We've written them in plain English to make sure 
            you understand your rights and responsibilities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-slate-500"
          >
            Last updated: {lastUpdated} • Effective immediately
          </motion.div>
        </motion.div>

        {/* Quick Overview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-3xl p-8 shadow-elevated hover-lift-subtle"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-slate-100 p-4 rounded-2xl mb-4 inline-flex">
                  <Handshake className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Fair & Transparent</h3>
                <p className="text-sm text-slate-600">Clear rules that protect both customers and fixers</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-2xl mb-4 inline-flex">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Your Rights Protected</h3>
                <p className="text-sm text-slate-600">Comprehensive protections for all platform users</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-2xl mb-4 inline-flex">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Easy to Understand</h3>
                <p className="text-sm text-slate-600">No confusing legal jargon, just clear terms</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Terms Sections */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-4">
            {termsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl border overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  section.important ? 'border-red-200' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-8 py-6 text-left flex items-center gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className={`p-3 rounded-2xl ${
                    section.important 
                      ? 'bg-red-100' 
                      : 'bg-gradient-to-r from-slate-100 to-blue-100'
                  }`}>
                    <section.icon className={`w-6 h-6 ${
                      section.important ? 'text-red-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{section.title}</h3>
                    {section.important && (
                      <p className="text-red-600 text-sm">Important - Please review carefully</p>
                    )}
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
                  <div className="px-8 pb-6 border-t border-slate-200">
                    <div className="pt-6 space-y-4">
                      {section.content.map((paragraph, paragraphIndex) => (
                        <motion.p
                          key={paragraphIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: paragraphIndex * 0.05 }}
                          className="text-slate-700 leading-relaxed"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-slate-100 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200"
            >
              <div className="text-center mb-6">
                <Scale className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Legal Information</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Governing Law:</strong> These terms are governed by the laws of India. 
                  Any disputes will be resolved in the courts of Coimbatore, Tamil Nadu.
                </p>
                <p>
                  <strong>Changes to Terms:</strong> We may update these terms from time to time. 
                  We'll notify you of significant changes via email or platform notification.
                </p>
                <p>
                  <strong>Severability:</strong> If any part of these terms is found to be unenforceable, 
                  the remainder will continue to apply.
                </p>
                <p>
                  <strong>Contact:</strong> Questions about these terms? Email us at{' '}
                  <a href="mailto:legal@fixly.in" className="text-blue-600 font-medium hover:underline">
                    legal@fixly.in
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-500 to-blue-600 rounded-3xl p-12 text-white"
            >
              <Mail className="w-12 h-12 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                We're here to help clarify anything that's unclear. Our legal team responds to all inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="mailto:legal@fixly.in"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-slate-600 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Legal Team
                </motion.a>
                <motion.a
                  href="/support"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white hover:text-slate-600 transition-all duration-300"
                >
                  General Support
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}