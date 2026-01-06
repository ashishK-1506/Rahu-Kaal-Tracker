import { Coordinates, DailyData, RahuTime, CitySearchResult } from '../types';

// Rahu Kaal segments (0-7) for each day of the week (Sunday=0 ... Saturday=6)
// Sunday: 8th segment (Index 7)
// Monday: 2nd segment (Index 1)
// Tuesday: 7th segment (Index 6)
// Wednesday: 5th segment (Index 4)
// Thursday: 6th segment (Index 5)
// Friday: 4th segment (Index 3)
// Saturday: 3rd segment (Index 2)
const RAHU_SEGMENTS = [7, 1, 6, 4, 5, 3, 2];

// Simple in-memory cache fallback if localStorage fails
const memoryCache: Record<string, { sunrise: string; sunset: string }> = {};

// Fetch sunrise/sunset data from the public API with Caching
async function fetchSolarData(lat: number, lng: number, date: Date): Promise<{ sunrise: string; sunset: string }> {
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // Use 3 decimal places for cache key (~110m precision) to improve cache hit rate for geolocation
  const cacheKey = `solar_${lat.toFixed(3)}_${lng.toFixed(3)}_${dateStr}`;

  try {
    // 1. Try LocalStorage
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // 2. Try Memory Cache (fallback)
    if (memoryCache[cacheKey]) return memoryCache[cacheKey];
  }

  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error('Failed to fetch solar data');
    }

    const result = {
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
    };

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {
      memoryCache[cacheKey] = result;
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Search cities by name
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// Reverse geocoding to get city name
export async function getCityName(lat: number, lng: number): Promise<string> {
  // Cache city name requests too, as they are static for a location
  const cacheKey = `city_${lat.toFixed(3)}_${lng.toFixed(3)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    let cityName = 'Custom Location';

    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.county;
      const state = data.address.state; // || data.address.country;
      
      if (city && state) cityName = `${city}, ${state}`;
      else if (city) cityName = city;
      else cityName = data.display_name.split(',')[0]; 
    }

    try { localStorage.setItem(cacheKey, cityName); } catch (e) {}
    
    return cityName;
  } catch (error) {
    console.warn('City fetch error:', error);
    return 'Custom Location';
  }
}

// Calculate Rahu Kaal for a specific day
export async function getRahuKaal(coords: Coordinates, date: Date = new Date()): Promise<DailyData> {
  const { sunrise: sunriseUtc, sunset: sunsetUtc } = await fetchSolarData(coords.lat, coords.lng, date);

  const sunrise = new Date(sunriseUtc);
  const sunset = new Date(sunsetUtc);

  // Total daylight duration in milliseconds
  const dayDuration = sunset.getTime() - sunrise.getTime();
  
  // Duration of one segment (1/8th of the day)
  const segmentDuration = dayDuration / 8;

  const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
  const segmentIndex = RAHU_SEGMENTS[dayOfWeek];

  const rahuStartMs = sunrise.getTime() + (segmentIndex * segmentDuration);
  const rahuEndMs = rahuStartMs + segmentDuration;

  return {
    date,
    sunrise,
    sunset,
    rahu: {
      start: new Date(rahuStartMs),
      end: new Date(rahuEndMs),
      date,
    },
  };
}

// Get forecast for the next 7 days (including today)
export async function getWeeklyForecast(coords: Coordinates): Promise<DailyData[]> {
  const today = new Date();
  const promises: Promise<DailyData>[] = [];

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    promises.push(getRahuKaal(coords, nextDate));
  }

  return Promise.all(promises);
}