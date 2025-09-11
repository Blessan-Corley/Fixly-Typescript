'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Home, ArrowLeft, Coffee, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/components/providers';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Lock Icon */}
        <motion.div
          className="mx-auto mb-8 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.6, 1] }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-200 to-red-300 opacity-50"
              animate={{ 
                x: ['0%', '100%', '0%'],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Lock className="w-16 h-16 text-red-600 relative z-10" />
            
            {/* Floating security badges */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                y: [-5, 5, -5],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="w-8 h-8 text-blue-500" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ 
                y: [5, -5, 5],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            <motion.span
              className="inline-block"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Oops!
            </motion.span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-6">
            Access Denied 🚫
          </h2>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl border border-white/20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-lg text-slate-600 leading-relaxed">
                Whoa there, partner! 🤠 Looks like you're trying to access something that's behind the VIP rope.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-slate-500">
                <Coffee className="w-5 h-5" />
                <span className="text-sm">Maybe grab a coffee while we sort this out?</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                <p className="font-medium mb-2">Here's what might have happened:</p>
                <ul className="text-left space-y-1 max-w-md mx-auto">
                  <li>• You don't have permission for this area 🔐</li>
                  <li>• Your session might have expired ⏰</li>
                  <li>• You took a wrong turn at Albuquerque 🗺️</li>
                  <li>• The hamsters powering our servers are on break 🐹</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleGoHome}
              className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              <span>Take Me Home</span>
            </motion.button>

            {user ? (
              <motion.button
                onClick={handleGoDashboard}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => router.push('/auth/signin')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock className="w-5 h-5" />
                <span>Sign In</span>
              </motion.button>
            )}

            <motion.button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Fun Footer */}
          <motion.div
            className="mt-12 text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.p
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Don't worry, even the best explorers hit a dead end sometimes! 🗺️✨
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Background animated elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-slate-300/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}