import { City, State, CitySearchResult, LocationSearchParams } from '@/types'

// Complete Indian states with codes
export const states: State[] = [
  { name: 'Andhra Pradesh', code: 'AP' },
  { name: 'Arunachal Pradesh', code: 'AR' },
  { name: 'Assam', code: 'AS' },
  { name: 'Bihar', code: 'BR' },
  { name: 'Chhattisgarh', code: 'CG' },
  { name: 'Goa', code: 'GA' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Haryana', code: 'HR' },
  { name: 'Himachal Pradesh', code: 'HP' },
  { name: 'Jharkhand', code: 'JH' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Kerala', code: 'KL' },
  { name: 'Madhya Pradesh', code: 'MP' },
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Manipur', code: 'MN' },
  { name: 'Meghalaya', code: 'ML' },
  { name: 'Mizoram', code: 'MZ' },
  { name: 'Nagaland', code: 'NL' },
  { name: 'Odisha', code: 'OR' },
  { name: 'Punjab', code: 'PB' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Sikkim', code: 'SK' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Telangana', code: 'TG' },
  { name: 'Tripura', code: 'TR' },
  { name: 'Uttar Pradesh', code: 'UP' },
  { name: 'Uttarakhand', code: 'UK' },
  { name: 'West Bengal', code: 'WB' },
  { name: 'Delhi', code: 'DL' },
  { name: 'Chandigarh', code: 'CH' },
  { name: 'Puducherry', code: 'PY' },
  { name: 'Jammu and Kashmir', code: 'JK' },
  { name: 'Ladakh', code: 'LA' },
  { name: 'Lakshadweep', code: 'LD' },
  { name: 'Andaman and Nicobar Islands', code: 'AN' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DN' }
]

// Comprehensive cities data with GPS coordinates and metadata
export const cities: City[] = [
  // Metro Cities
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, isMetro: true, population: 12442373 },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, isMetro: true, population: 11034555 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, isMetro: true, population: 8443675 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, isMetro: true, population: 6809970 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, isMetro: true, population: 5570585 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, isMetro: true, population: 4646732 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, isMetro: true, population: 4496694 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, isMetro: true, population: 4467797 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, isMetro: true, population: 3124458 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, isMetro: true, population: 3046163 },

  // Major Cities - Maharashtra
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, isMetro: true, population: 2497777 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, isMetro: false, population: 1486973 },
  { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, isMetro: false, population: 1175116 },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, isMetro: false, population: 951118 },
  { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, isMetro: false, population: 561841 },
  { name: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815, isMetro: false, population: 502697 },
  { name: 'Malegaon', state: 'Maharashtra', lat: 20.5579, lng: 74.5287, isMetro: false, population: 471312 },
  { name: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626, isMetro: false, population: 460228 },
  { name: 'Akola', state: 'Maharashtra', lat: 20.7002, lng: 77.0082, isMetro: false, population: 425817 },
  { name: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604, isMetro: false, population: 382754 },

  // Major Cities - Karnataka
  { name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394, isMetro: false, population: 920550 },
  { name: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240, isMetro: false, population: 943857 },
  { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.8560, isMetro: false, population: 623841 },
  { name: 'Belgaum', state: 'Karnataka', lat: 15.8497, lng: 74.4977, isMetro: false, population: 610350 },
  { name: 'Gulbarga', state: 'Karnataka', lat: 17.3297, lng: 76.8343, isMetro: false, population: 543147 },
  { name: 'Davanagere', state: 'Karnataka', lat: 14.4644, lng: 75.9216, isMetro: false, population: 435128 },
  { name: 'Bellary', state: 'Karnataka', lat: 15.1394, lng: 76.9214, isMetro: false, population: 409644 },
  { name: 'Bijapur', state: 'Karnataka', lat: 16.8302, lng: 75.7100, isMetro: false, population: 327427 },
  { name: 'Shimoga', state: 'Karnataka', lat: 13.9299, lng: 75.5681, isMetro: false, population: 322650 },
  { name: 'Tumkur', state: 'Karnataka', lat: 13.3379, lng: 77.1022, isMetro: false, population: 305821 },

  // Major Cities - Tamil Nadu
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, isMetro: true, population: 1061447 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, isMetro: true, population: 1561129 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, isMetro: true, population: 847387 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, isMetro: false, population: 831038 },
  { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, isMetro: false, population: 474838 },
  { name: 'Tirupur', state: 'Tamil Nadu', lat: 11.1085, lng: 77.3411, isMetro: false, population: 444352 },
  { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, isMetro: false, population: 423425 },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172, isMetro: false, population: 498129 },
  { name: 'Thoothukkudi', state: 'Tamil Nadu', lat: 8.7642, lng: 78.1348, isMetro: false, population: 237374 },
  { name: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lng: 77.9803, isMetro: false, population: 207327 },

  // Major Cities - Gujarat
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, isMetro: false, population: 1666703 },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, isMetro: false, population: 1286995 },
  { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, isMetro: false, population: 605882 },
  { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577, isMetro: false, population: 600943 },
  { name: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579, isMetro: false, population: 319462 },
  { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, isMetro: false, population: 292797 },
  { name: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289, isMetro: false, population: 240886 },
  { name: 'Navsari', state: 'Gujarat', lat: 20.9463, lng: 72.9270, isMetro: false, population: 171109 },

  // Major Cities - Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, isMetro: true, population: 2817105 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, isMetro: true, population: 2767031 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, isMetro: true, population: 1729000 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, isMetro: true, population: 1585704 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, isMetro: false, population: 1201815 },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, isMetro: false, population: 1305429 },
  { name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, isMetro: false, population: 1117094 },
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, isMetro: false, population: 903668 },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880, isMetro: false, population: 874408 },
  { name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733, isMetro: false, population: 889810 },

  // Major Cities - Rajasthan  
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, isMetro: false, population: 1033918 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, isMetro: false, population: 1001694 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, isMetro: false, population: 644406 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, isMetro: false, population: 475150 },
  { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, isMetro: false, population: 551101 },
  { name: 'Bhilwara', state: 'Rajasthan', lat: 25.3407, lng: 74.6269, isMetro: false, population: 360009 },
  { name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346, isMetro: false, population: 341422 },

  // Major Cities - West Bengal
  { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, isMetro: false, population: 1077075 },
  { name: 'Durgapur', state: 'West Bengal', lat: 23.4894, lng: 87.3200, isMetro: false, population: 566037 },
  { name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524, isMetro: false, population: 564491 },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, isMetro: false, population: 513264 },

  // Major Cities - Kerala
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, isMetro: true, population: 957730 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, isMetro: true, population: 677381 },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, isMetro: false, population: 609224 },
  { name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141, isMetro: false, population: 397419 },
  { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, isMetro: false, population: 315596 },

  // Major Cities - Andhra Pradesh & Telangana
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, isMetro: false, population: 1730320 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, isMetro: false, population: 1048240 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, isMetro: false, population: 670073 },
  { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, isMetro: false, population: 505258 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, isMetro: false, population: 484327 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, isMetro: false, population: 811844 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941, isMetro: false, population: 311152 },

  // Major Cities - Punjab & Haryana
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9000, lng: 75.8573, isMetro: false, population: 1618879 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, isMetro: false, population: 1183705 },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, isMetro: false, population: 873725 },
  { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, isMetro: false, population: 446246 },
  { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, isMetro: true, population: 876969 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, isMetro: true, population: 1404653 },
  { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635, isMetro: false, population: 294151 },

  // Major Cities - Madhya Pradesh
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, isMetro: true, population: 1883381 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, isMetro: true, population: 2170295 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, isMetro: false, population: 1267564 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, isMetro: false, population: 1101981 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, isMetro: false, population: 515215 },

  // Major Cities - Bihar & Jharkhand
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, isMetro: true, population: 1684222 },
  { name: 'Gaya', state: 'Bihar', lat: 24.7955, lng: 84.9994, isMetro: false, population: 470839 },
  { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842, isMetro: false, population: 410210 },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, isMetro: false, population: 1073440 },
  { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, isMetro: false, population: 1195298 },

  // Major Cities - Odisha & Assam
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, isMetro: true, population: 885363 },
  { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828, isMetro: false, population: 663015 },
  { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, isMetro: false, population: 483418 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, isMetro: false, population: 963429 },

  // Union Territories
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, isMetro: false, population: 1055450 },
  { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, isMetro: false, population: 244377 }
]

// Helper functions
export function searchCities(params: LocationSearchParams): CitySearchResult[] {
  const { query, state, limit = 10 } = params
  
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase().trim()
  let filteredCities = cities
  
  // Filter by state if provided
  if (state) {
    filteredCities = cities.filter(city => 
      city.state.toLowerCase().includes(state.toLowerCase())
    )
  }
  
  // Filter by search term
  const results = filteredCities
    .filter(city => 
      city.name.toLowerCase().includes(searchTerm) ||
      city.state.toLowerCase().includes(searchTerm)
    )
    // Sort by relevance: exact matches first, then starts with, then contains
    .sort((a, b) => {
      const aNameLower = a.name.toLowerCase()
      const bNameLower = b.name.toLowerCase()
      
      // Exact match
      if (aNameLower === searchTerm) return -1
      if (bNameLower === searchTerm) return 1
      
      // Starts with
      if (aNameLower.startsWith(searchTerm) && !bNameLower.startsWith(searchTerm)) return -1
      if (bNameLower.startsWith(searchTerm) && !aNameLower.startsWith(searchTerm)) return 1
      
      // Metro cities priority
      if (a.isMetro && !b.isMetro) return -1
      if (b.isMetro && !a.isMetro) return 1
      
      // Population priority
      const aPop = a.population || 0
      const bPop = b.population || 0
      return bPop - aPop
    })
    .slice(0, limit)
    .map(city => {
      const stateData = states.find(s => s.name === city.state)
      return {
        city: city.name,
        state: city.state,
        stateCode: stateData?.code || '',
        lat: city.lat,
        lng: city.lng
      }
    })
  
  return results
}

export function getCitiesByState(stateCode: string): City[] {
  const state = states.find(s => s.code === stateCode)
  if (!state) return []
  
  return cities.filter(city => city.state === state.name)
}

export function getNearestCities(lat: number, lng: number, radiusKm: number = 50): City[] {
  const earthRadius = 6371 // Earth's radius in kilometers
  
  return cities
    .map(city => {
      // Haversine formula for distance calculation
      const dLat = (city.lat - lat) * (Math.PI / 180)
      const dLng = (city.lng - lng) * (Math.PI / 180)
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * (Math.PI / 180)) * Math.cos(city.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = earthRadius * c
      
      return { ...city, distance }
    })
    .filter(city => city.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}

export function getMetroCities(): City[] {
  return cities.filter(city => city.isMetro)
}

export function getCitiesWithPopulation(minPopulation: number = 100000): City[] {
  return cities.filter(city => city.population && city.population >= minPopulation)
}

export function getStateByCode(code: string): State | undefined {
  return states.find(state => state.code === code)
}

export function getStateByName(name: string): State | undefined {
  return states.find(state => state.name.toLowerCase() === name.toLowerCase())
}

// Aliases for backward compatibility
export const indianStates = states