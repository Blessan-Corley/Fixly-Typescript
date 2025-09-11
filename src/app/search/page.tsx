'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Clock, Wrench, Home, Car, Laptop, Paintbrush, Zap, Droplets } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

interface Fixer {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  services: string[];
  location: string;
  hourlyRate: number;
  responseTime: string;
  profileImage: string;
  verified: boolean;
  available: boolean;
}

const services: Service[] = [
  { id: 'electrical', name: 'Electrical', icon: Zap, count: 156 },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, count: 134 },
  { id: 'appliances', name: 'Home Appliances', icon: Home, count: 189 },
  { id: 'automotive', name: 'Automotive', icon: Car, count: 98 },
  { id: 'electronics', name: 'Electronics', icon: Laptop, count: 112 },
  { id: 'painting', name: 'Painting', icon: Paintbrush, count: 87 }
];

const sampleFixers: Fixer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    rating: 4.9,
    reviews: 127,
    services: ['Electrical', 'Home Appliances'],
    location: 'Coimbatore North',
    hourlyRate: 450,
    responseTime: '< 15 min',
    profileImage: '/api/placeholder/80/80',
    verified: true,
    available: true
  },
  {
    id: '2',
    name: 'Priya Sharma',
    rating: 4.8,
    reviews: 89,
    services: ['Plumbing', 'Home Appliances'],
    location: 'RS Puram',
    hourlyRate: 380,
    responseTime: '< 30 min',
    profileImage: '/api/placeholder/80/80',
    verified: true,
    available: true
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    rating: 4.7,
    reviews: 156,
    services: ['Automotive', 'Electronics'],
    location: 'Gandhipuram',
    hourlyRate: 520,
    responseTime: '< 20 min',
    profileImage: '/api/placeholder/80/80',
    verified: true,
    available: false
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [maxRate, setMaxRate] = useState(1000);
  const [location, setLocation] = useState('');

  const filteredFixers = sampleFixers.filter(fixer => {
    const matchesSearch = fixer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fixer.services.some(service => 
                           service.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesService = !selectedService || 
                          fixer.services.some(service => 
                            service.toLowerCase().includes(selectedService.toLowerCase())
                          );
    const matchesRate = fixer.hourlyRate <= maxRate;
    const matchesLocation = !location || 
                           fixer.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesService && matchesRate && matchesLocation;
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20 pb-12"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Find Your Perfect Fixer
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Browse skilled professionals in your area or search for specific services
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="relative">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for services or fixer names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-6 py-4 rounded-2xl border transition-all duration-300 ${
                      showFilters 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Filters Panel */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: showFilters ? 1 : 0,
                    height: showFilters ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                        <select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none"
                        >
                          <option value="rating">Rating</option>
                          <option value="price">Price</option>
                          <option value="reviews">Reviews</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Rate (₹/hour)</label>
                        <input
                          type="range"
                          min="200"
                          max="1000"
                          value={maxRate}
                          onChange={(e) => setMaxRate(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-sm text-slate-600 mt-1">₹{maxRate}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="Enter area"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setMaxRate(1000);
                            setLocation('');
                            setSortBy('rating');
                          }}
                          className="w-full p-3 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Service Categories */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedService(
                    selectedService === service.name ? null : service.name
                  )}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    selectedService === service.name
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white/80 text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <service.icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm font-medium mb-1">{service.name}</div>
                  <div className="text-xs opacity-70">{service.count} fixers</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {filteredFixers.length} Fixers Found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFixers.map((fixer, index) => (
                <motion.div
                  key={fixer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={fixer.profileImage}
                        alt={fixer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{fixer.name}</h3>
                          {fixer.verified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{fixer.rating}</span>
                          <span>({fixer.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fixer.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {fixer.available ? 'Available' : 'Busy'}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{fixer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Responds {fixer.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Wrench className="w-4 h-4" />
                      <span>{fixer.services.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">₹{fixer.hourlyRate}</div>
                      <div className="text-sm text-slate-500">per hour</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredFixers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No fixers found</h3>
                <p className="text-slate-600 mb-8">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedService(null);
                    setMaxRate(1000);
                    setLocation('');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}