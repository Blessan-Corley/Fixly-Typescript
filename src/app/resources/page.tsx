'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Download, Star, Clock, Users, Wrench, Shield, TrendingUp, Award, MessageCircle, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'video' | 'tool' | 'checklist';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  downloadCount: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'New to Fixly? Start here and avoid the rookie mistakes!',
    icon: Star,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'best-practices',
    name: 'Best Practices',
    description: 'Pro tips to make you look like you know what you\'re doing',
    icon: Award,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'safety',
    name: 'Safety First',
    description: 'Because hospital bills are more expensive than tools',
    icon: Shield,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'business-tips',
    name: 'Business Growth',
    description: 'Turn your fixing skills into a thriving business',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  }
];

const resources: Resource[] = [
  {
    id: '1',
    title: 'Fixer Onboarding Guide',
    description: 'Everything you need to know to get started on Fixly (without embarrassing yourself)',
    category: 'getting-started',
    type: 'guide',
    difficulty: 'beginner',
    duration: '15 min read',
    rating: 4.8,
    downloadCount: 2340,
    icon: BookOpen
  },
  {
    id: '2',
    title: 'Creating Your Perfect Profile',
    description: 'Make customers trust you more than their own family members',
    category: 'getting-started',
    type: 'video',
    difficulty: 'beginner',
    duration: '12 min watch',
    rating: 4.9,
    downloadCount: 1890,
    icon: Video
  },
  {
    id: '3',
    title: 'Pricing Your Services Right',
    description: 'Stop undercharging yourself (you\'re worth more than ₹50/hour!)',
    category: 'best-practices',
    type: 'guide',
    difficulty: 'intermediate',
    duration: '20 min read',
    rating: 4.7,
    downloadCount: 3120,
    icon: BookOpen
  },
  {
    id: '4',
    title: 'Essential Tool Checklist',
    description: 'Don\'t show up to a job with just a Swiss Army knife',
    category: 'best-practices',
    type: 'checklist',
    difficulty: 'beginner',
    duration: '5 min read',
    rating: 4.6,
    downloadCount: 4560,
    icon: Download
  },
  {
    id: '5',
    title: 'Safety Protocols & PPE Guide',
    description: 'Protect yourself so you can fix another day',
    category: 'safety',
    type: 'guide',
    difficulty: 'intermediate',
    duration: '18 min read',
    rating: 4.9,
    downloadCount: 2890,
    icon: Shield
  },
  {
    id: '6',
    title: 'Handling Difficult Customers',
    description: 'When Karen calls and nothing is ever good enough',
    category: 'business-tips',
    type: 'video',
    difficulty: 'advanced',
    duration: '25 min watch',
    rating: 4.8,
    downloadCount: 2100,
    icon: MessageCircle
  },
  {
    id: '7',
    title: 'Building Your Reputation',
    description: 'Get 5-star reviews without bribing customers',
    category: 'business-tips',
    type: 'guide',
    difficulty: 'intermediate',
    duration: '16 min read',
    rating: 4.7,
    downloadCount: 1750,
    icon: Award
  },
  {
    id: '8',
    title: 'Emergency Response Procedures',
    description: 'What to do when things go from bad to "call the fire department"',
    category: 'safety',
    type: 'checklist',
    difficulty: 'advanced',
    duration: '10 min read',
    rating: 5.0,
    downloadCount: 890,
    icon: Download
  }
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'tool': return Wrench;
      case 'checklist': return Download;
      default: return BookOpen;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-full text-orange-700 font-medium mb-8"
          >
            <BookOpen className="w-5 h-5" />
            Resources for Fixers
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            Level Up Your
            <br />
            <span className="text-gray-700">Fixing Game</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          >
            From rookie to pro, we've got the guides, tools, and insider secrets to help you succeed. 
            Because great fixers aren't born, they're made (with the right resources)!
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto mb-8"
          >
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
            />
          </motion.div>
        </motion.div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.button
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'border-orange-400 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-orange-200'
              }`}
            >
              <div className="text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-bold text-gray-900 mb-2">All Resources</h3>
                <p className="text-sm text-gray-600">Everything we've got!</p>
              </div>
            </motion.button>

            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-orange-400 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white/80 hover:border-orange-200'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-xl">
                      <TypeIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloadCount.toLocaleString()} downloads</span>
                    </div>
                    <motion.div
                      className="flex items-center gap-1 text-orange-600 font-medium group-hover:gap-2 transition-all"
                    >
                      <span>View</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Resources Found</h3>
              <p className="text-gray-600 mb-8">
                Couldn't find what you're looking for? Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Show All Resources
              </button>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white/50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-12"
            >
              <Users className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our Community of Pro Fixers
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Connect with other fixers, share tips, and learn from the best. Because even the pros need backup sometimes!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-orange-600 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join Community
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white hover:text-orange-600 transition-all duration-300"
                >
                  Download App
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}