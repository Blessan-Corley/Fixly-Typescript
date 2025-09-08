// Indian cities data for Fixly
export interface City {
  id: string
  name: string
  state: string
  stateCode: string
  latitude: number
  longitude: number
  population?: number
  isMetro?: boolean
}

export const cities: City[] = [
  // Metro Cities
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', stateCode: 'MH', latitude: 19.0760, longitude: 72.8777, population: 12442373, isMetro: true },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', stateCode: 'DL', latitude: 28.7041, longitude: 77.1025, population: 11034555, isMetro: true },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', stateCode: 'KA', latitude: 12.9716, longitude: 77.5946, population: 8443675, isMetro: true },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', stateCode: 'TG', latitude: 17.3850, longitude: 78.4867, population: 6809970, isMetro: true },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', stateCode: 'GJ', latitude: 23.0225, longitude: 72.5714, population: 5570585, isMetro: true },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', stateCode: 'TN', latitude: 13.0827, longitude: 80.2707, population: 4681087, isMetro: true },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', stateCode: 'WB', latitude: 22.5726, longitude: 88.3639, population: 4496694, isMetro: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', stateCode: 'MH', latitude: 18.5204, longitude: 73.8567, population: 3124458, isMetro: true },

  // Major Cities
  { id: 'surat', name: 'Surat', state: 'Gujarat', stateCode: 'GJ', latitude: 21.1702, longitude: 72.8311, population: 4467797 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', stateCode: 'RJ', latitude: 26.9124, longitude: 75.7873, population: 3046163 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 26.8467, longitude: 80.9462, population: 2815601 },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 26.4499, longitude: 80.3319, population: 2767031 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', stateCode: 'MH', latitude: 21.1458, longitude: 79.0882, population: 2405665 },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', stateCode: 'MP', latitude: 22.7196, longitude: 75.8577, population: 1964086 },
  { id: 'thane', name: 'Thane', state: 'Maharashtra', stateCode: 'MH', latitude: 19.2183, longitude: 72.9781, population: 1841488 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', stateCode: 'MP', latitude: 23.2599, longitude: 77.4126, population: 1798218 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', stateCode: 'AP', latitude: 17.6868, longitude: 83.2185, population: 1730320 },
  { id: 'pimpri-chinchwad', name: 'Pimpri-Chinchwad', state: 'Maharashtra', stateCode: 'MH', latitude: 18.6298, longitude: 73.7997, population: 1729359 },
  { id: 'patna', name: 'Patna', state: 'Bihar', stateCode: 'BR', latitude: 25.5941, longitude: 85.1376, population: 1684222 },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', stateCode: 'GJ', latitude: 22.3072, longitude: 73.1812, population: 1666703 },
  { id: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 28.6692, longitude: 77.4538, population: 1648643 },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', stateCode: 'PB', latitude: 30.9010, longitude: 75.8573, population: 1618879 },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 27.1767, longitude: 78.0081, population: 1585704 },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', stateCode: 'MH', latitude: 19.9975, longitude: 73.7898, population: 1486973 },
  { id: 'faridabad', name: 'Faridabad', state: 'Haryana', stateCode: 'HR', latitude: 28.4089, longitude: 77.3178, population: 1414050 },
  { id: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 28.9845, longitude: 77.7064, population: 1305429 },
  { id: 'rajkot', name: 'Rajkot', state: 'Gujarat', stateCode: 'GJ', latitude: 22.3039, longitude: 70.8022, population: 1286995 },
  { id: 'kalyan-dombivli', name: 'Kalyan-Dombivli', state: 'Maharashtra', stateCode: 'MH', latitude: 19.2403, longitude: 73.1305, population: 1246381 },
  { id: 'vasai-virar', name: 'Vasai-Virar', state: 'Maharashtra', stateCode: 'MH', latitude: 19.4912, longitude: 72.8052, population: 1221233 },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 25.3176, longitude: 82.9739, population: 1201815 },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu and Kashmir', stateCode: 'JK', latitude: 34.0837, longitude: 74.7973, population: 1180570 },
  { id: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra', stateCode: 'MH', latitude: 19.8762, longitude: 75.3433, population: 1175116 },
  { id: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', stateCode: 'JH', latitude: 23.7957, longitude: 86.4304, population: 1162472 },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', stateCode: 'PB', latitude: 31.6340, longitude: 74.8723, population: 1132761 },
  { id: 'navi-mumbai', name: 'Navi Mumbai', state: 'Maharashtra', stateCode: 'MH', latitude: 19.0330, longitude: 73.0297, population: 1119477 },
  { id: 'allahabad', name: 'Allahabad', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 25.4358, longitude: 81.8463, population: 1117094 },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', stateCode: 'JH', latitude: 23.3441, longitude: 85.3096, population: 1073440 },
  { id: 'howrah', name: 'Howrah', state: 'West Bengal', stateCode: 'WB', latitude: 22.5958, longitude: 88.2636, population: 1072161 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', stateCode: 'TN', latitude: 11.0168, longitude: 76.9558, population: 1061447 },
  { id: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', stateCode: 'MP', latitude: 23.1815, longitude: 79.9864, population: 1055525 },
  { id: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', stateCode: 'MP', latitude: 26.2183, longitude: 78.1828, population: 1054420 },

  // State Capitals and Important Cities
  { id: 'kochi', name: 'Kochi', state: 'Kerala', stateCode: 'KL', latitude: 9.9312, longitude: 76.2673 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', stateCode: 'KL', latitude: 8.5241, longitude: 76.9366 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', stateCode: 'OR', latitude: 20.2961, longitude: 85.8245 },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', stateCode: 'CH', latitude: 30.7333, longitude: 76.7794 },
  { id: 'mysore', name: 'Mysore', state: 'Karnataka', stateCode: 'KA', latitude: 12.2958, longitude: 76.6394 },
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu', stateCode: 'TN', latitude: 11.6643, longitude: 78.1460 },
  { id: 'madura', name: 'Madurai', state: 'Tamil Nadu', stateCode: 'TN', latitude: 9.9252, longitude: 78.1198 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', stateCode: 'AS', latitude: 26.1445, longitude: 91.7362 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', stateCode: 'RJ', latitude: 26.2389, longitude: 73.0243 },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', stateCode: 'CG', latitude: 21.2514, longitude: 81.6296 },
  { id: 'kota', name: 'Kota', state: 'Rajasthan', stateCode: 'RJ', latitude: 25.2138, longitude: 75.8648 },
  { id: 'guntur', name: 'Guntur', state: 'Andhra Pradesh', stateCode: 'AP', latitude: 16.3067, longitude: 80.4365 },
  { id: 'hubli-dharwad', name: 'Hubli-Dharwad', state: 'Karnataka', stateCode: 'KA', latitude: 15.3647, longitude: 75.1240 },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka', stateCode: 'KA', latitude: 12.9141, longitude: 74.8560 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', state: 'Tamil Nadu', stateCode: 'TN', latitude: 10.7905, longitude: 78.7047 },
  { id: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 28.3670, longitude: 79.4304 },
  { id: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 27.8974, longitude: 78.0880 },
  { id: 'tiruppur', name: 'Tiruppur', state: 'Tamil Nadu', stateCode: 'TN', latitude: 11.1085, longitude: 77.3411 },
  { id: 'gurgaon', name: 'Gurgaon', state: 'Haryana', stateCode: 'HR', latitude: 28.4595, longitude: 77.0266 },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh', stateCode: 'UP', latitude: 28.5355, longitude: 77.3910 },
  { id: 'bikaner', name: 'Bikaner', state: 'Rajasthan', stateCode: 'RJ', latitude: 28.0229, longitude: 73.3119 },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', stateCode: 'UT', latitude: 30.3165, longitude: 78.0322 },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', stateCode: 'HP', latitude: 31.1048, longitude: 77.1734 }
]

// Get cities by state
export const getCitiesByState = (stateCode: string): City[] => {
  return cities.filter(city => city.stateCode === stateCode)
}

// Get metro cities
export const getMetroCities = (): City[] => {
  return cities.filter(city => city.isMetro)
}

// Search cities by name
export const searchCities = (query: string): City[] => {
  const lowercaseQuery = query.toLowerCase()
  return cities.filter(city => 
    city.name.toLowerCase().includes(lowercaseQuery) ||
    city.state.toLowerCase().includes(lowercaseQuery)
  )
}

// Get city by ID
export const getCityById = (id: string): City | undefined => {
  return cities.find(city => city.id === id)
}

// Get popular cities (top 20 by population)
export const getPopularCities = (): City[] => {
  return cities
    .filter(city => city.population)
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 20)
}
// Indian states data
export const indianStates = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'DL', name: 'Delhi' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'WB', name: 'West Bengal' }
]
