'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Droplets, Wrench, Car, Laptop, Paintbrush, 
  Home, Smartphone, Camera, Fan, Hammer, Scissors,
  ChevronRight, Star, Clock, Shield, Users
} from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  serviceCount: number;
  averagePrice: string;
  averageRating: number;
  services: SubService[];
  featured: boolean;
}

interface SubService {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  duration: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'electrical',
    name: 'Electrical Services',
    description: 'Professional electrical repairs and installations',
    icon: Zap,
    serviceCount: 156,
    averagePrice: '₹350-750',
    averageRating: 4.8,
    featured: true,
    services: [
      {
        id: 'wiring',
        name: 'Wiring & Rewiring',
        description: 'Complete electrical wiring solutions',
        priceRange: '₹500-1200',
        duration: '2-6 hours'
      },
      {
        id: 'switches',
        name: 'Switch & Socket Repair',
        description: 'Fix faulty switches and electrical outlets',
        priceRange: '₹200-500',
        duration: '30min-1hr'
      },
      {
        id: 'lighting',
        name: 'Lighting Installation',
        description: 'Install ceiling fans, lights, and fixtures',
        priceRange: '₹300-800',
        duration: '1-3 hours'
      }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    description: 'Expert plumbing repairs and maintenance',
    icon: Droplets,
    serviceCount: 134,
    averagePrice: '₹300-650',
    averageRating: 4.7,
    featured: true,
    services: [
      {
        id: 'pipes',
        name: 'Pipe Repair & Installation',
        description: 'Fix leaks and install new pipelines',
        priceRange: '₹400-1000',
        duration: '1-4 hours'
      },
      {
        id: 'drainage',
        name: 'Drainage Cleaning',
        description: 'Clear blocked drains and sewers',
        priceRange: '₹250-600',
        duration: '30min-2hrs'
      },
      {
        id: 'faucets',
        name: 'Faucet & Tap Repair',
        description: 'Fix dripping and faulty taps',
        priceRange: '₹200-450',
        duration: '30min-1hr'
      }
    ]
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    description: 'Repair and service household appliances',
    icon: Home,
    serviceCount: 189,
    averagePrice: '₹400-900',
    averageRating: 4.6,
    featured: true,
    services: [
      {
        id: 'washing',
        name: 'Washing Machine Service',
        description: 'Complete washing machine repair',
        priceRange: '₹500-1200',
        duration: '1-3 hours'
      },
      {
        id: 'refrigerator',
        name: 'Refrigerator Repair',
        description: 'Fix cooling and other fridge issues',
        priceRange: '₹600-1500',
        duration: '2-4 hours'
      },
      {
        id: 'ac',
        name: 'AC Service & Repair',
        description: 'Air conditioning maintenance and repair',
        priceRange: '₹800-2000',
        duration: '2-5 hours'
      }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive Services',
    description: 'Vehicle maintenance and repair services',
    icon: Car,
    serviceCount: 98,
    averagePrice: '₹500-1500',
    averageRating: 4.5,
    featured: false,
    services: [
      {
        id: 'bike',
        name: 'Bike Repair & Service',
        description: 'Two-wheeler maintenance and repair',
        priceRange: '₹300-800',
        duration: '1-3 hours'
      },
      {
        id: 'car',
        name: 'Car Service',
        description: 'Four-wheeler servicing and repair',
        priceRange: '₹800-2500',
        duration: '3-6 hours'
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics Repair',
    description: 'Fix smartphones, laptops, and gadgets',
    icon: Laptop,
    serviceCount: 112,
    averagePrice: '₹200-800',
    averageRating: 4.4,
    featured: false,
    services: [
      {
        id: 'phone',
        name: 'Mobile Phone Repair',
        description: 'Screen, battery, and component replacement',
        priceRange: '₹200-1000',
        duration: '1-2 hours'
      },
      {
        id: 'laptop',
        name: 'Laptop Repair',
        description: 'Hardware and software troubleshooting',
        priceRange: '₹500-1500',
        duration: '2-6 hours'
      }
    ]
  },
  {
    id: 'painting',
    name: 'Painting & Decoration',
    description: 'Interior and exterior painting services',
    icon: Paintbrush,
    serviceCount: 87,
    averagePrice: '₹25-45/sq ft',
    averageRating: 4.7,
    featured: false,
    services: [
      {
        id: 'interior',
        name: 'Interior Painting',
        description: 'Room and wall painting services',
        priceRange: '₹20-40/sq ft',
        duration: '1-3 days'
      },
      {
        id: 'exterior',
        name: 'Exterior Painting',
        description: 'Building exterior painting',
        priceRange: '₹30-50/sq ft',
        duration: '2-5 days'
      }
    ]
  }
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const featuredCategories = serviceCategories.filter(cat => cat.featured);
  const allCategories = serviceCategories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-[hsl(var(--background))] theme-transition">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section"
        >
          <div className="container max-w-6xl">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-heading text-primary mb-lg">
                Professional Services
                <br />
                <span className="text-[hsl(var(--primary-600))]">You Can Trust</span>
              </h1>
              <p className="text-xl text-secondary text-body max-w-2xl mx-auto mb-2xl">
                From electrical work to automotive repair, find skilled professionals for every need
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md mx-auto relative"
              >
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-lg glass-strong focus:border-[hsl(var(--primary-500))] focus:shadow-glow-primary transition-base"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Service Stats */}
        <div className="container max-w-6xl mb-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-glass card-xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
              <div className="text-center hover-lift-subtle transition-base">
                <div className="text-3xl font-bold text-heading text-primary mb-sm">500+</div>
                <div className="text-secondary text-body">Skilled Fixers</div>
              </div>
              <div className="text-center hover-lift-subtle transition-base">
                <div className="text-3xl font-bold text-heading text-primary mb-sm">50+</div>
                <div className="text-secondary text-body">Service Types</div>
              </div>
              <div className="text-center hover-lift-subtle transition-base">
                <div className="flex items-center justify-center gap-xs mb-sm">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <div className="text-3xl font-bold text-heading text-primary">4.7</div>
                </div>
                <div className="text-secondary text-body">Average Rating</div>
              </div>
              <div className="text-center hover-lift-subtle transition-base">
                <div className="text-3xl font-bold text-heading text-primary mb-sm">24/7</div>
                <div className="text-secondary text-body">Support</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Services */}
        <div className="container max-w-6xl mb-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-heading text-primary mb-2xl">Popular Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="card-glass card-lg hover-lift hover-scale transition-base cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center justify-between mb-md">
                    <div className="w-12 h-12 bg-[hsl(var(--primary-100))] rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-xs">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-heading text-primary">{category.averageRating}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-heading text-primary mb-sm">{category.name}</h3>
                  <p className="text-secondary text-body mb-md">{category.description}</p>

                  <div className="flex items-center justify-between text-sm text-muted mb-md">
                    <div className="flex items-center gap-xs">
                      <Users className="w-4 h-4" />
                      <span>{category.serviceCount} fixers</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <Clock className="w-4 h-4" />
                      <span>Starting {category.averagePrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">View Services</span>
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* All Services */}
        <div className="container max-w-6xl pb-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-heading text-primary mb-2xl">All Services</h2>
            <div className="space-y-lg">
              {allCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="card-glass overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className="w-full p-lg text-left flex items-center justify-between hover:bg-surface-elevated/50 transition-fast"
                  >
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-[hsl(var(--primary-100))] rounded-xl flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-heading text-primary mb-xs">{category.name}</h3>
                        <p className="text-secondary text-body">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="text-right">
                        <div className="flex items-center gap-xs mb-xs">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-heading text-primary">{category.averageRating}</span>
                        </div>
                        <div className="text-sm text-muted text-body">{category.serviceCount} fixers</div>
                      </div>
                      <motion.div
                        animate={{ rotate: selectedCategory === category.id ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-6 h-6 text-muted" />
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
                    <div className="px-lg pb-lg border-t border-default">
                      <div className="pt-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                        {category.services.map((service, serviceIndex) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: serviceIndex * 0.05 }}
                            className="card-sm bg-surface-elevated rounded-xl hover:bg-surface cursor-pointer hover-lift-subtle transition-base"
                          >
                            <h4 className="font-semibold text-heading text-primary mb-sm">{service.name}</h4>
                            <p className="text-sm text-secondary text-body mb-sm">{service.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-primary font-medium">{service.priceRange}</span>
                              <span className="text-muted text-body">{service.duration}</span>
                            </div>
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

        {/* CTA Section */}
        <div className="bg-primary text-[hsl(var(--primary-foreground))] section">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold text-heading mb-md">Need a Custom Solution?</h2>
              <p className="text-xl text-[hsl(var(--primary-foreground))]/80 text-body mb-2xl max-w-2xl mx-auto">
                Don't see what you're looking for? Our fixers handle custom requests too.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-base btn-secondary btn-lg hover-lift transition-base"
                >
                  Post Custom Job
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-base btn-ghost btn-lg border-[hsl(var(--primary-foreground))]/30 text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))]/10 hover-lift transition-base"
                >
                  Contact Support
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}