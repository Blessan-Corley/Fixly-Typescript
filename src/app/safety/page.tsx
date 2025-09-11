'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Eye, HardHat, Zap, Flame, Droplets, Wind, Heart, Phone, MapPin } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface SafetyFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SafetyTip {
  id: string;
  category: string;
  title: string;
  description: string;
  dos: string[];
  donts: string[];
  emergency?: string;
}

const safetyFeatures: SafetyFeature[] = [
  {
    id: 'verification',
    title: 'Verified Fixers Only',
    description: 'Every fixer goes through background checks (we\'re thorough, but not creepy)',
    icon: Shield,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'insurance',
    title: 'Insurance Coverage',
    description: 'All jobs are covered by insurance (because accidents happen)',
    icon: Heart,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'emergency',
    title: '24/7 Emergency Support',
    description: 'Help is just a call away, even at 3 AM (our support team loves coffee)',
    icon: Phone,
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'tracking',
    title: 'Real-time Tracking',
    description: 'Know exactly where your fixer is (no more waiting around all day)',
    icon: MapPin,
    color: 'from-purple-500 to-pink-600'
  }
];

const safetyTips: SafetyTip[] = [
  {
    id: 'electrical',
    category: 'Electrical Work',
    title: 'Electrical Safety (Don\'t Become a Human Light Bulb)',
    description: 'Electricity doesn\'t forgive mistakes. Follow these rules to avoid becoming a cautionary tale.',
    dos: [
      'Always turn off power at the breaker before starting work',
      'Use a voltage tester to confirm power is off',
      'Wear insulated gloves and safety glasses',
      'Keep a fire extinguisher nearby (the proper kind for electrical fires)',
      'Work with dry hands and on dry surfaces only'
    ],
    donts: [
      'Never work on live circuits (seriously, just don\'t)',
      'Don\'t use damaged tools or equipment',
      'Never touch exposed wires with bare hands',
      'Don\'t work alone on major electrical projects',
      'Never ignore burning smells or sparks'
    ],
    emergency: 'If someone gets shocked: Don\'t touch them directly! Turn off power first, then call emergency services.'
  },
  {
    id: 'plumbing',
    category: 'Plumbing Work',
    title: 'Plumbing Safety (Keep the Water Where It Belongs)',
    description: 'Water damage is expensive. Gas leaks are dangerous. Let\'s avoid both!',
    dos: [
      'Know where the main water shutoff valve is located',
      'Use proper pipe cutting tools and techniques',
      'Check for gas lines before digging or drilling',
      'Ventilate the area when using solvents or adhesives',
      'Test all connections for leaks before finishing'
    ],
    donts: [
      'Never ignore the smell of gas (it\'s not just "probably nothing")',
      'Don\'t overtighten fittings (hand tight plus 1-2 turns)',
      'Never use the wrong type of pipe for the application',
      'Don\'t work on gas lines without proper certification',
      'Never leave water damage to "dry on its own"'
    ],
    emergency: 'Gas leak suspected? Evacuate immediately, don\'t use electrical switches, call gas company from outside.'
  },
  {
    id: 'construction',
    category: 'Construction & Repair',
    title: 'General Construction Safety (Hard Hats Aren\'t Fashion Statements)',
    description: 'Construction sites are basically obstacle courses designed by chaos. Stay safe!',
    dos: [
      'Always wear appropriate PPE (helmet, safety glasses, gloves)',
      'Inspect tools and equipment before each use',
      'Keep work area clean and well-lit',
      'Use proper lifting techniques (bend your knees, not your back)',
      'Follow manufacturer instructions for all tools and materials'
    ],
    donts: [
      'Never remove safety guards from power tools',
      'Don\'t work at heights without proper fall protection',
      'Never rush through safety procedures to save time',
      'Don\'t ignore warning signs or your gut feelings',
      'Never work under the influence of anything (including caffeine overdose)'
    ],
    emergency: 'Serious injury on site? Secure the scene, don\'t move the injured person unless in immediate danger, call 108.'
  },
  {
    id: 'chemical',
    category: 'Chemical Safety',
    title: 'Chemical & Material Safety (Your Lungs Will Thank You)',
    description: 'Just because you can\'t see fumes doesn\'t mean they\'re not there. Breathe responsibly!',
    dos: [
      'Read all safety data sheets (yes, the boring paperwork matters)',
      'Use proper ventilation or respirators when required',
      'Store chemicals in proper containers with labels',
      'Have appropriate spill cleanup materials on hand',
      'Wear chemical-resistant gloves when handling solvents'
    ],
    donts: [
      'Never mix chemicals unless specifically instructed',
      'Don\'t eat or drink in areas where chemicals are used',
      'Never store chemicals in food containers',
      'Don\'t ignore ventilation requirements',
      'Never dispose of chemicals down drains or in regular trash'
    ],
    emergency: 'Chemical exposure? Flush with water for 15+ minutes, remove contaminated clothing, call poison control: 1066.'
  }
];

export default function SafetyPage() {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const toggleTip = (tipId: string) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-6 py-3 rounded-full text-red-700 font-medium mb-8"
          >
            <Shield className="w-5 h-5" />
            Safety First
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            Safety Guidelines
            <br />
            <span className="text-gray-700">That Actually Matter</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            Because the best fix is the one where everyone goes home in one piece. These aren't just guidelines – 
            they're the difference between a good day and a really bad day.
          </motion.p>
        </motion.div>

        {/* Safety Features */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Keep Everyone Safe</h2>
            <p className="text-lg text-gray-600">Multiple layers of protection because one isn't enough</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Essential Safety Guidelines</h2>
            <p className="text-lg text-gray-600">Click on any category to expand the full safety guide</p>
          </motion.div>

          <div className="space-y-4">
            {safetyTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => toggleTip(tip.id)}
                  className="w-full px-8 py-6 text-left flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 p-3 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                        {tip.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedTip === tip.id ? 180 : 0 }}
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
                    height: expandedTip === tip.id ? 'auto' : 0,
                    opacity: expandedTip === tip.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 border-t border-gray-100">
                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Do's */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-green-700 mb-4">
                          <CheckCircle className="w-5 h-5" />
                          DO These Things
                        </h4>
                        <ul className="space-y-3">
                          {tip.dos.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Don'ts */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-red-700 mb-4">
                          <AlertTriangle className="w-5 h-5" />
                          DON'T Do These Things
                        </h4>
                        <ul className="space-y-3">
                          {tip.donts.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Emergency Info */}
                    {tip.emergency && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
                      >
                        <h5 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Emergency Procedure
                        </h5>
                        <p className="text-red-700 text-sm">{tip.emergency}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white/50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl p-12 text-center"
            >
              <Phone className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Emergency Contacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-2">Emergency Services</h3>
                  <p className="text-2xl font-bold text-white">108</p>
                  <p className="text-red-100 text-sm">Police, Flame, Medical</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-2">Poison Control</h3>
                  <p className="text-2xl font-bold text-white">1066</p>
                  <p className="text-red-100 text-sm">Chemical Exposure</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-2">Fixly Support</h3>
                  <p className="text-2xl font-bold text-white">+91 9976768211</p>
                  <p className="text-red-100 text-sm">24/7 Emergency Help</p>
                </div>
              </div>
              <p className="text-xl text-red-100 mb-8">
                Save these numbers in your phone. Hope you never need them, but be glad they're there.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Download Safety Checklist
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg text-gray-600"
          >
            <p className="mb-4">
              Remember: No job is so urgent that it can't be done safely. 
              Take your time, follow the rules, and everyone goes home happy.
            </p>
            <p className="font-medium text-gray-800">
              Safety isn't just a priority – it's a value. 🛡️
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}