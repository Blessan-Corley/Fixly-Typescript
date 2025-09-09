import { SkillCategory, SkillSearchParams } from '@/types'

// Streamlined skill categories - focused on popular and essential services
export const skillCategories: SkillCategory[] = [
  {
    name: 'Electrical Services',
    icon: '⚡',
    isPopular: true,
    skills: [
      'Electrician',
      'AC Installation & Repair',
      'Wiring & Rewiring',
      'Fan Installation',
      'Light Fitting',
      'Switch & Socket Work',
      'Home Appliance Repair',
      'Generator Services',
      'Smart Home Setup'
    ]
  },
  {
    name: 'Plumbing Services',
    icon: '🔧',
    isPopular: true,
    skills: [
      'Plumbing Installation',
      'Pipe Repair & Replacement',
      'Tap & Faucet Repair',
      'Toilet Repair',
      'Water Tank Services',
      'Drainage & Sewage',
      'Bathroom Fitting',
      'Kitchen Plumbing',
      'Water Heater Services'
    ]
  },
  {
    name: 'Home Repair & Maintenance',
    icon: '🏠',
    isPopular: true,
    skills: [
      'Carpentry',
      'Painting & Wallpaper',
      'Tile & Flooring',
      'Door & Window Repair',
      'Furniture Assembly',
      'Wall Mounting',
      'Ceiling Work',
      'General Handyman',
      'Home Inspection'
    ]
  },
  {
    name: 'Cleaning Services',
    icon: '🧽',
    isPopular: true,
    skills: [
      'House Cleaning',
      'Deep Cleaning',
      'Office Cleaning',
      'Carpet Cleaning',
      'Window Cleaning',
      'Kitchen Cleaning',
      'Bathroom Cleaning',
      'Post-Construction Cleaning',
      'Move-in/Move-out Cleaning'
    ]
  },
  {
    name: 'Tech & Electronics',
    icon: '💻',
    isPopular: false,
    skills: [
      'Computer Repair',
      'TV Installation',
      'WiFi Setup',
      'CCTV Installation',
      'Mobile Phone Repair',
      'Data Recovery',
      'Software Installation',
      'Network Setup'
    ]
  },
  {
    name: 'Automotive Services',
    icon: '🚗',
    isPopular: false,
    skills: [
      'Car Repair',
      'Bike Repair',
      'Car Washing',
      'Battery Services',
      'Tire Services',
      'Car Electronics',
      'Vehicle Inspection',
      'Roadside Assistance'
    ]
  },
  {
    name: 'Beauty & Wellness',
    icon: '💄',
    isPopular: false,
    skills: [
      'Hair Styling',
      'Massage Therapy',
      'Facial Services',
      'Nail Services',
      'Makeup Artist',
      'Personal Trainer',
      'Yoga Instructor',
      'Nutrition Counseling'
    ]
  },
  {
    name: 'Education & Tutoring',
    icon: '📚',
    isPopular: false,
    skills: [
      'Academic Tutoring',
      'Language Teaching',
      'Music Lessons',
      'Art Classes',
      'Computer Training',
      'Exam Preparation',
      'Skill Development',
      'Professional Coaching'
    ]
  },
  {
    name: 'Event & Photography',
    icon: '📸',
    isPopular: false,
    skills: [
      'Wedding Photography',
      'Event Photography',
      'Videography',
      'Event Planning',
      'DJ Services',
      'Catering Services',
      'Decoration Services',
      'Sound System Setup'
    ]
  },
  {
    name: 'Garden & Outdoor',
    icon: '🌱',
    isPopular: false,
    skills: [
      'Gardening Services',
      'Landscaping',
      'Lawn Care',
      'Plant Care',
      'Tree Services',
      'Pest Control',
      'Outdoor Cleaning',
      'Pool Maintenance'
    ]
  }
]

// Search functionality
export function searchSkills(params: SkillSearchParams): string[] {
  const { query, category, limit = 20 } = params
  
  if (!query?.trim()) return []
  
  const searchTerm = query.toLowerCase().trim()
  let filteredCategories = skillCategories
  
  // Filter by category if provided
  if (category && category !== 'all') {
    filteredCategories = skillCategories.filter(cat => 
      cat.name.toLowerCase().includes(category.toLowerCase())
    )
  }
  
  // Search through skills
  const results: string[] = []
  
  filteredCategories.forEach(category => {
    category.skills.forEach(skill => {
      if (skill.toLowerCase().includes(searchTerm) && results.length < limit) {
        results.push(skill)
      }
    })
  })
  
  return results
}

export function getSkillsByCategory(categoryName: string): string[] {
  const category = skillCategories.find(cat => cat.name === categoryName)
  return category ? category.skills : []
}

export function getAllSkills(): string[] {
  return skillCategories.flatMap(cat => cat.skills)
}

export function getPopularSkills(limit: number = 20): string[] {
  const popularSkills: string[] = []
  
  skillCategories.filter(cat => cat.isPopular).forEach(category => {
    popularSkills.push(...category.skills.slice(0, 3))
  })
  
  return popularSkills.slice(0, limit)
}

export function getCategoryForSkill(skill: string): string | null {
  const category = skillCategories.find(cat => cat.skills.includes(skill))
  return category?.name || null
}

export function getSkillCategoriesForDisplay() {
  return skillCategories.map(category => ({
    name: category.name,
    icon: category.icon,
    isPopular: category.isPopular,
    topSkills: category.skills.slice(0, 5), // Show top 5 skills for each category
    totalSkills: category.skills.length
  }))
}

// Aliases for backward compatibility
export const SKILL_CATEGORIES = skillCategories.map(cat => cat.name)
export const SKILLS = skillCategories.flatMap(cat => 
  cat.skills.map(skill => ({
    id: skill.toLowerCase().replace(/\s+/g, '-'),
    name: skill,
    category: cat.name,
    description: `Professional ${skill.toLowerCase()} services`,
    popular: cat.isPopular
  }))
)

// Alias function already exists above - removed duplicate