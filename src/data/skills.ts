// Skills data for Fixly platform
export interface Skill {
  id: string
  name: string
  category: string
  description?: string
  averageRate?: {
    min: number
    max: number
  }
  demandLevel: 'low' | 'medium' | 'high' | 'very-high'
  icon?: string
}

export interface SkillCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

// Skill Categories
export const skillCategories: SkillCategory[] = [
  {
    id: 'home-repair',
    name: 'Home Repair & Maintenance',
    description: 'General home repairs and maintenance services',
    icon: '🏠',
    color: 'blue'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Water systems, pipes, and fixtures',
    icon: '🔧',
    color: 'cyan'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Wiring, lighting, and electrical systems',
    icon: '⚡',
    color: 'yellow'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Vehicle maintenance and repairs',
    icon: '🚗',
    color: 'red'
  },
  {
    id: 'electronics',
    name: 'Electronics & Appliances',
    description: 'Electronic devices and home appliances',
    icon: '📱',
    color: 'purple'
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Woodwork',
    description: 'Furniture and wooden structures',
    icon: '🪚',
    color: 'orange'
  },
  {
    id: 'painting',
    name: 'Painting & Decoration',
    description: 'Interior and exterior painting',
    icon: '🎨',
    color: 'green'
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    description: 'Professional cleaning and maintenance',
    icon: '🧹',
    color: 'teal'
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscaping',
    description: 'Garden maintenance and landscaping',
    icon: '🌱',
    color: 'emerald'
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning',
    icon: '❄️',
    color: 'indigo'
  }
]

// Skills Database
export const skills: Skill[] = [
  // Home Repair & Maintenance
  {
    id: 'general-handyman',
    name: 'General Handyman Services',
    category: 'home-repair',
    description: 'Basic home repairs and maintenance tasks',
    averageRate: { min: 300, max: 600 },
    demandLevel: 'very-high'
  },
  {
    id: 'wall-repair',
    name: 'Wall Repair & Patching',
    category: 'home-repair',
    averageRate: { min: 200, max: 500 },
    demandLevel: 'high'
  },
  {
    id: 'door-window-repair',
    name: 'Door & Window Repair',
    category: 'home-repair',
    averageRate: { min: 250, max: 700 },
    demandLevel: 'high'
  },
  {
    id: 'furniture-assembly',
    name: 'Furniture Assembly',
    category: 'home-repair',
    averageRate: { min: 200, max: 400 },
    demandLevel: 'very-high'
  },
  {
    id: 'ceiling-fan-installation',
    name: 'Ceiling Fan Installation',
    category: 'home-repair',
    averageRate: { min: 300, max: 500 },
    demandLevel: 'high'
  },

  // Plumbing
  {
    id: 'pipe-repair',
    name: 'Pipe Repair & Replacement',
    category: 'plumbing',
    averageRate: { min: 400, max: 800 },
    demandLevel: 'very-high'
  },
  {
    id: 'tap-faucet-repair',
    name: 'Tap & Faucet Repair',
    category: 'plumbing',
    averageRate: { min: 200, max: 400 },
    demandLevel: 'very-high'
  },
  {
    id: 'toilet-repair',
    name: 'Toilet Repair & Installation',
    category: 'plumbing',
    averageRate: { min: 300, max: 600 },
    demandLevel: 'high'
  },
  {
    id: 'water-heater-service',
    name: 'Water Heater Service',
    category: 'plumbing',
    averageRate: { min: 500, max: 1000 },
    demandLevel: 'high'
  },
  {
    id: 'drain-cleaning',
    name: 'Drain Cleaning & Unclogging',
    category: 'plumbing',
    averageRate: { min: 300, max: 600 },
    demandLevel: 'very-high'
  },

  // Electrical
  {
    id: 'electrical-wiring',
    name: 'Electrical Wiring',
    category: 'electrical',
    averageRate: { min: 500, max: 1200 },
    demandLevel: 'high'
  },
  {
    id: 'switch-socket-installation',
    name: 'Switch & Socket Installation',
    category: 'electrical',
    averageRate: { min: 150, max: 300 },
    demandLevel: 'very-high'
  },
  {
    id: 'lighting-installation',
    name: 'Lighting Installation',
    category: 'electrical',
    averageRate: { min: 200, max: 500 },
    demandLevel: 'high'
  },
  {
    id: 'electrical-troubleshooting',
    name: 'Electrical Troubleshooting',
    category: 'electrical',
    averageRate: { min: 300, max: 600 },
    demandLevel: 'very-high'
  },
  {
    id: 'inverter-ups-service',
    name: 'Inverter & UPS Service',
    category: 'electrical',
    averageRate: { min: 400, max: 800 },
    demandLevel: 'high'
  },

  // Automotive
  {
    id: 'car-wash-detailing',
    name: 'Car Wash & Detailing',
    category: 'automotive',
    averageRate: { min: 300, max: 800 },
    demandLevel: 'high'
  },
  {
    id: 'bike-service',
    name: 'Bike Service & Repair',
    category: 'automotive',
    averageRate: { min: 200, max: 500 },
    demandLevel: 'very-high'
  },
  {
    id: 'car-service',
    name: 'Car Service & Maintenance',
    category: 'automotive',
    averageRate: { min: 800, max: 2000 },
    demandLevel: 'high'
  },
  {
    id: 'tire-service',
    name: 'Tire Change & Repair',
    category: 'automotive',
    averageRate: { min: 200, max: 400 },
    demandLevel: 'medium'
  },

  // Electronics & Appliances
  {
    id: 'washing-machine-repair',
    name: 'Washing Machine Repair',
    category: 'electronics',
    averageRate: { min: 300, max: 800 },
    demandLevel: 'very-high'
  },
  {
    id: 'refrigerator-repair',
    name: 'Refrigerator Repair',
    category: 'electronics',
    averageRate: { min: 400, max: 1000 },
    demandLevel: 'high'
  },
  {
    id: 'ac-service',
    name: 'Air Conditioner Service',
    category: 'electronics',
    averageRate: { min: 500, max: 1200 },
    demandLevel: 'very-high'
  },
  {
    id: 'microwave-repair',
    name: 'Microwave Repair',
    category: 'electronics',
    averageRate: { min: 300, max: 600 },
    demandLevel: 'medium'
  },
  {
    id: 'tv-repair',
    name: 'TV Repair',
    category: 'electronics',
    averageRate: { min: 400, max: 800 },
    demandLevel: 'high'
  },
  {
    id: 'laptop-computer-repair',
    name: 'Laptop & Computer Repair',
    category: 'electronics',
    averageRate: { min: 500, max: 1500 },
    demandLevel: 'high'
  },
  {
    id: 'mobile-phone-repair',
    name: 'Mobile Phone Repair',
    category: 'electronics',
    averageRate: { min: 200, max: 600 },
    demandLevel: 'very-high'
  },

  // Carpentry & Woodwork
  {
    id: 'furniture-making',
    name: 'Custom Furniture Making',
    category: 'carpentry',
    averageRate: { min: 800, max: 2500 },
    demandLevel: 'medium'
  },
  {
    id: 'furniture-repair',
    name: 'Furniture Repair',
    category: 'carpentry',
    averageRate: { min: 300, max: 800 },
    demandLevel: 'high'
  },
  {
    id: 'cabinet-installation',
    name: 'Cabinet Installation',
    category: 'carpentry',
    averageRate: { min: 500, max: 1200 },
    demandLevel: 'medium'
  },
  {
    id: 'wooden-flooring',
    name: 'Wooden Flooring',
    category: 'carpentry',
    averageRate: { min: 800, max: 2000 },
    demandLevel: 'low'
  },

  // Painting & Decoration
  {
    id: 'interior-painting',
    name: 'Interior Painting',
    category: 'painting',
    averageRate: { min: 400, max: 1000 },
    demandLevel: 'high'
  },
  {
    id: 'exterior-painting',
    name: 'Exterior Painting',
    category: 'painting',
    averageRate: { min: 500, max: 1200 },
    demandLevel: 'medium'
  },
  {
    id: 'wall-texture',
    name: 'Wall Texture & Design',
    category: 'painting',
    averageRate: { min: 600, max: 1500 },
    demandLevel: 'low'
  },

  // Cleaning Services
  {
    id: 'house-cleaning',
    name: 'House Cleaning',
    category: 'cleaning',
    averageRate: { min: 300, max: 800 },
    demandLevel: 'very-high'
  },
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    category: 'cleaning',
    averageRate: { min: 500, max: 1200 },
    demandLevel: 'high'
  },
  {
    id: 'carpet-cleaning',
    name: 'Carpet Cleaning',
    category: 'cleaning',
    averageRate: { min: 200, max: 600 },
    demandLevel: 'medium'
  },

  // Gardening & Landscaping
  {
    id: 'garden-maintenance',
    name: 'Garden Maintenance',
    category: 'gardening',
    averageRate: { min: 300, max: 800 },
    demandLevel: 'medium'
  },
  {
    id: 'plant-care',
    name: 'Plant Care & Watering',
    category: 'gardening',
    averageRate: { min: 200, max: 500 },
    demandLevel: 'medium'
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Design',
    category: 'gardening',
    averageRate: { min: 1000, max: 5000 },
    demandLevel: 'low'
  },

  // HVAC
  {
    id: 'ac-installation',
    name: 'AC Installation',
    category: 'hvac',
    averageRate: { min: 800, max: 2000 },
    demandLevel: 'high'
  },
  {
    id: 'ac-maintenance',
    name: 'AC Maintenance',
    category: 'hvac',
    averageRate: { min: 400, max: 800 },
    demandLevel: 'very-high'
  }
]

// Helper Functions
export const getSkillsByCategory = (categoryId: string): Skill[] => {
  return skills.filter(skill => skill.category === categoryId)
}

export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(skill => skill.id === id)
}

export const searchSkills = (query: string): Skill[] => {
  const lowercaseQuery = query.toLowerCase()
  return skills.filter(skill => 
    skill.name.toLowerCase().includes(lowercaseQuery) ||
    skill.description?.toLowerCase().includes(lowercaseQuery)
  )
}

export const getHighDemandSkills = (): Skill[] => {
  return skills.filter(skill => 
    skill.demandLevel === 'high' || skill.demandLevel === 'very-high'
  )
}

export const getCategoryById = (id: string): SkillCategory | undefined => {
  return skillCategories.find(category => category.id === id)
}

// Get popular skills (top 15 by demand)
export const getPopularSkills = (): Skill[] => {
  const demandOrder = { 'very-high': 4, 'high': 3, 'medium': 2, 'low': 1 }
  return skills
    .sort((a, b) => demandOrder[b.demandLevel] - demandOrder[a.demandLevel])
    .slice(0, 15)
}

export const skillsData = skills
