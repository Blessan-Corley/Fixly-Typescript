// Comprehensive services and locations data for Fixly
// This file consolidates all skills/services and cities data to avoid duplicates

export interface Skill {
  id: string
  name: string
  category: string
  description: string
  averageRate?: {
    min: number
    max: number
  }
  popular?: boolean
  icon?: string
}

export interface City {
  id: string
  name: string
  state: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
  popular?: boolean
  timezone?: string
}

export const SKILL_CATEGORIES = [
  'Home Maintenance',
  'Electrical & Plumbing', 
  'Construction & Repair',
  'Cleaning & Organization',
  'Tech & Digital',
  'Automotive',
  'Health & Wellness',
  'Education & Tutoring',
  'Creative & Design',
  'Other Services'
] as const

export const SKILLS: Skill[] = [
  // Home Maintenance
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    category: 'Electrical & Plumbing',
    description: 'Fix leaks, install fixtures, repair pipes',
    averageRate: { min: 75, max: 150 },
    popular: true
  },
  { 
    id: 'electrical', 
    name: 'Electrical Work', 
    category: 'Electrical & Plumbing',
    description: 'Wiring, outlets, lighting installation',
    averageRate: { min: 80, max: 180 },
    popular: true
  },
  { 
    id: 'hvac', 
    name: 'HVAC Repair', 
    category: 'Home Maintenance',
    description: 'Heating, ventilation, air conditioning',
    averageRate: { min: 90, max: 200 }
  },
  { 
    id: 'carpentry', 
    name: 'Carpentry', 
    category: 'Construction & Repair',
    description: 'Custom woodwork, furniture repair, installations',
    averageRate: { min: 60, max: 120 },
    popular: true
  },
  { 
    id: 'painting', 
    name: 'Painting', 
    category: 'Home Maintenance',
    description: 'Interior and exterior painting services',
    averageRate: { min: 40, max: 80 },
    popular: true
  },
  { 
    id: 'handyman', 
    name: 'Handyman Services', 
    category: 'Home Maintenance',
    description: 'General repairs and maintenance',
    averageRate: { min: 50, max: 100 },
    popular: true
  },

  // Cleaning & Organization
  { 
    id: 'house-cleaning', 
    name: 'House Cleaning', 
    category: 'Cleaning & Organization',
    description: 'Deep cleaning, regular maintenance cleaning',
    averageRate: { min: 30, max: 60 },
    popular: true
  },
  { 
    id: 'organization', 
    name: 'Home Organization', 
    category: 'Cleaning & Organization',
    description: 'Declutter and organize spaces',
    averageRate: { min: 40, max: 80 }
  },

  // Construction & Repair  
  { 
    id: 'roofing', 
    name: 'Roofing', 
    category: 'Construction & Repair',
    description: 'Roof repair, installation, maintenance',
    averageRate: { min: 70, max: 150 }
  },
  { 
    id: 'flooring', 
    name: 'Flooring Installation', 
    category: 'Construction & Repair',
    description: 'Hardwood, tile, carpet installation',
    averageRate: { min: 50, max: 120 }
  },
  { 
    id: 'tiling', 
    name: 'Tiling', 
    category: 'Construction & Repair',
    description: 'Bathroom, kitchen, floor tiling',
    averageRate: { min: 45, max: 90 }
  },
  { 
    id: 'masonry', 
    name: 'Masonry', 
    category: 'Construction & Repair',
    description: 'Brick, stone, concrete work',
    averageRate: { min: 60, max: 130 }
  },

  // Tech & Digital
  { 
    id: 'computer-repair', 
    name: 'Computer Repair', 
    category: 'Tech & Digital',
    description: 'Hardware/software troubleshooting',
    averageRate: { min: 60, max: 120 }
  },
  { 
    id: 'tv-mounting', 
    name: 'TV Mounting', 
    category: 'Tech & Digital',
    description: 'Wall mount TVs and setup',
    averageRate: { min: 80, max: 150 }
  },
  { 
    id: 'smart-home', 
    name: 'Smart Home Setup', 
    category: 'Tech & Digital',
    description: 'IoT devices, automation setup',
    averageRate: { min: 70, max: 140 }
  },

  // Other Services
  { 
    id: 'gardening', 
    name: 'Gardening', 
    category: 'Other Services',
    description: 'Landscaping, plant care, garden maintenance',
    averageRate: { min: 35, max: 70 }
  },
  { 
    id: 'pet-sitting', 
    name: 'Pet Sitting', 
    category: 'Other Services',
    description: 'Pet care, dog walking, pet sitting',
    averageRate: { min: 25, max: 50 }
  },
  { 
    id: 'moving', 
    name: 'Moving Services', 
    category: 'Other Services',
    description: 'Packing, loading, moving assistance',
    averageRate: { min: 40, max: 80 }
  },
  { 
    id: 'appliance-repair', 
    name: 'Appliance Repair', 
    category: 'Home Maintenance',
    description: 'Washing machine, dryer, dishwasher repair',
    averageRate: { min: 80, max: 160 }
  },
  { 
    id: 'locksmith', 
    name: 'Locksmith', 
    category: 'Other Services',
    description: 'Lock installation, key duplication, emergency lockout',
    averageRate: { min: 100, max: 200 }
  },
  { 
    id: 'pest-control', 
    name: 'Pest Control', 
    category: 'Home Maintenance',
    description: 'Insect and rodent removal',
    averageRate: { min: 120, max: 250 }
  },
  { 
    id: 'solar-installation', 
    name: 'Solar Installation', 
    category: 'Electrical & Plumbing',
    description: 'Solar panel installation and maintenance',
    averageRate: { min: 150, max: 300 }
  },
  { 
    id: 'interior-design', 
    name: 'Interior Design', 
    category: 'Creative & Design',
    description: 'Space design, decoration, consultation',
    averageRate: { min: 75, max: 200 }
  },
  { 
    id: 'tutoring', 
    name: 'Tutoring', 
    category: 'Education & Tutoring',
    description: 'Academic tutoring, test prep',
    averageRate: { min: 30, max: 100 }
  },
  { 
    id: 'personal-training', 
    name: 'Personal Training', 
    category: 'Health & Wellness',
    description: 'Fitness coaching, workout plans',
    averageRate: { min: 40, max: 120 }
  },
  { 
    id: 'auto-repair', 
    name: 'Auto Repair', 
    category: 'Automotive',
    description: 'Car maintenance, minor repairs',
    averageRate: { min: 60, max: 150 }
  }
]

export const POPULAR_SKILLS = SKILLS.filter(skill => skill.popular)

// Major Indian cities with coordinates
export const CITIES: City[] = [
  // Tier 1 Cities
  { 
    id: 'mumbai', 
    name: 'Mumbai', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'delhi', 
    name: 'New Delhi', 
    state: 'Delhi', 
    country: 'India',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'bangalore', 
    name: 'Bangalore', 
    state: 'Karnataka', 
    country: 'India',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'hyderabad', 
    name: 'Hyderabad', 
    state: 'Telangana', 
    country: 'India',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'chennai', 
    name: 'Chennai', 
    state: 'Tamil Nadu', 
    country: 'India',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'kolkata', 
    name: 'Kolkata', 
    state: 'West Bengal', 
    country: 'India',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'pune', 
    name: 'Pune', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    popular: true,
    timezone: 'Asia/Kolkata'
  },

  // Tier 2 Cities
  { 
    id: 'ahmedabad', 
    name: 'Ahmedabad', 
    state: 'Gujarat', 
    country: 'India',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'jaipur', 
    name: 'Jaipur', 
    state: 'Rajasthan', 
    country: 'India',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'surat', 
    name: 'Surat', 
    state: 'Gujarat', 
    country: 'India',
    coordinates: { lat: 21.1702, lng: 72.8311 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'lucknow', 
    name: 'Lucknow', 
    state: 'Uttar Pradesh', 
    country: 'India',
    coordinates: { lat: 26.8467, lng: 80.9462 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'kanpur', 
    name: 'Kanpur', 
    state: 'Uttar Pradesh', 
    country: 'India',
    coordinates: { lat: 26.4499, lng: 80.3319 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'nagpur', 
    name: 'Nagpur', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'indore', 
    name: 'Indore', 
    state: 'Madhya Pradesh', 
    country: 'India',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'thane', 
    name: 'Thane', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 19.2183, lng: 72.9781 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'bhopal', 
    name: 'Bhopal', 
    state: 'Madhya Pradesh', 
    country: 'India',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'visakhapatnam', 
    name: 'Visakhapatnam', 
    state: 'Andhra Pradesh', 
    country: 'India',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'pimpri-chinchwad', 
    name: 'Pimpri-Chinchwad', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 18.6298, lng: 73.7997 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'patna', 
    name: 'Patna', 
    state: 'Bihar', 
    country: 'India',
    coordinates: { lat: 25.5941, lng: 85.1376 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'vadodara', 
    name: 'Vadodara', 
    state: 'Gujarat', 
    country: 'India',
    coordinates: { lat: 22.3072, lng: 73.1812 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'ghaziabad', 
    name: 'Ghaziabad', 
    state: 'Uttar Pradesh', 
    country: 'India',
    coordinates: { lat: 28.6692, lng: 77.4538 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'ludhiana', 
    name: 'Ludhiana', 
    state: 'Punjab', 
    country: 'India',
    coordinates: { lat: 30.9010, lng: 75.8573 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'agra', 
    name: 'Agra', 
    state: 'Uttar Pradesh', 
    country: 'India',
    coordinates: { lat: 27.1767, lng: 78.0081 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'nashik', 
    name: 'Nashik', 
    state: 'Maharashtra', 
    country: 'India',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'faridabad', 
    name: 'Faridabad', 
    state: 'Haryana', 
    country: 'India',
    coordinates: { lat: 28.4089, lng: 77.3178 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'meerut', 
    name: 'Meerut', 
    state: 'Uttar Pradesh', 
    country: 'India',
    coordinates: { lat: 28.9845, lng: 77.7064 },
    popular: false,
    timezone: 'Asia/Kolkata'
  },
  { 
    id: 'rajkot', 
    name: 'Rajkot', 
    state: 'Gujarat', 
    country: 'India',
    coordinates: { lat: 22.3039, lng: 70.8022 },
    popular: false,
    timezone: 'Asia/Kolkata'
  }
]

export const POPULAR_CITIES = CITIES.filter(city => city.popular)

// Helper functions
export const getSkillsByCategory = (category: string) => 
  SKILLS.filter(skill => skill.category === category)

export const getSkillById = (id: string) => 
  SKILLS.find(skill => skill.id === id)

export const getCityById = (id: string) => 
  CITIES.find(city => city.id === id)

export const searchSkills = (query: string) =>
  SKILLS.filter(skill => 
    skill.name.toLowerCase().includes(query.toLowerCase()) ||
    skill.description.toLowerCase().includes(query.toLowerCase()) ||
    skill.category.toLowerCase().includes(query.toLowerCase())
  )

export const searchCities = (query: string) =>
  CITIES.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.state.toLowerCase().includes(query.toLowerCase())
  )

export const getSkillsByIds = (ids: string[]) =>
  SKILLS.filter(skill => ids.includes(skill.id))

export const getCitiesByIds = (ids: string[]) =>
  CITIES.filter(city => ids.includes(city.id))