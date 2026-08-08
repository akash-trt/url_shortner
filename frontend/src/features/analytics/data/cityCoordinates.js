/**
 * ip-api.com gives us a city name string, not coordinates — so plotting
 * clicks on a map needs somewhere to look those up. This covers the most
 * common major cities world-wide. It's necessarily incomplete: a city not
 * in this list still shows up correctly in the ranked "Top cities" list,
 * it just won't get a dot on the drill-down map.
 */
export const CITY_COORDINATES = [
  // North America
  { city: "New York", country: "United States", lon: -74.006, lat: 40.7128 },
  { city: "Los Angeles", country: "United States", lon: -118.2437, lat: 34.0522 },
  { city: "Chicago", country: "United States", lon: -87.6298, lat: 41.8781 },
  { city: "Houston", country: "United States", lon: -95.3698, lat: 29.7604 },
  { city: "San Francisco", country: "United States", lon: -122.4194, lat: 37.7749 },
  { city: "Seattle", country: "United States", lon: -122.3321, lat: 47.6062 },
  { city: "Austin", country: "United States", lon: -97.7431, lat: 30.2672 },
  { city: "Boston", country: "United States", lon: -71.0589, lat: 42.3601 },
  { city: "Miami", country: "United States", lon: -80.1918, lat: 25.7617 },
  { city: "Dallas", country: "United States", lon: -96.797, lat: 32.7767 },
  { city: "Atlanta", country: "United States", lon: -84.388, lat: 33.749 },
  { city: "Denver", country: "United States", lon: -104.9903, lat: 39.7392 },
  { city: "Phoenix", country: "United States", lon: -112.074, lat: 33.4484 },
  { city: "San Jose", country: "United States", lon: -121.8863, lat: 37.3382 },
  { city: "Mountain View", country: "United States", lon: -122.084, lat: 37.3861 },
  { city: "Washington", country: "United States", lon: -77.0369, lat: 38.9072 },
  { city: "Ashburn", country: "United States", lon: -77.4874, lat: 39.0438 },
  { city: "Toronto", country: "Canada", lon: -79.3832, lat: 43.6532 },
  { city: "Vancouver", country: "Canada", lon: -123.1207, lat: 49.2827 },
  { city: "Montreal", country: "Canada", lon: -73.5673, lat: 45.5017 },
  { city: "Mexico City", country: "Mexico", lon: -99.1332, lat: 19.4326 },

  // South America
  { city: "Sao Paulo", country: "Brazil", lon: -46.6333, lat: -23.5505 },
  { city: "Rio de Janeiro", country: "Brazil", lon: -43.1729, lat: -22.9068 },
  { city: "Buenos Aires", country: "Argentina", lon: -58.3816, lat: -34.6037 },
  { city: "Bogota", country: "Colombia", lon: -74.0721, lat: 4.711 },
  { city: "Santiago", country: "Chile", lon: -70.6693, lat: -33.4489 },
  { city: "Lima", country: "Peru", lon: -77.0428, lat: -12.0464 },

  // Europe
  { city: "London", country: "United Kingdom", lon: -0.1278, lat: 51.5074 },
  { city: "Manchester", country: "United Kingdom", lon: -2.2426, lat: 53.4808 },
  { city: "Paris", country: "France", lon: 2.3522, lat: 48.8566 },
  { city: "Berlin", country: "Germany", lon: 13.405, lat: 52.52 },
  { city: "Frankfurt", country: "Germany", lon: 8.6821, lat: 50.1109 },
  { city: "Munich", country: "Germany", lon: 11.582, lat: 48.1351 },
  { city: "Madrid", country: "Spain", lon: -3.7038, lat: 40.4168 },
  { city: "Barcelona", country: "Spain", lon: 2.1734, lat: 41.3851 },
  { city: "Rome", country: "Italy", lon: 12.4964, lat: 41.9028 },
  { city: "Milan", country: "Italy", lon: 9.19, lat: 45.4642 },
  { city: "Amsterdam", country: "Netherlands", lon: 4.9041, lat: 52.3676 },
  { city: "Dublin", country: "Ireland", lon: -6.2603, lat: 53.3498 },
  { city: "Brussels", country: "Belgium", lon: 4.3517, lat: 50.8503 },
  { city: "Zurich", country: "Switzerland", lon: 8.5417, lat: 47.3769 },
  { city: "Vienna", country: "Austria", lon: 16.3738, lat: 48.2082 },
  { city: "Stockholm", country: "Sweden", lon: 18.0686, lat: 59.3293 },
  { city: "Oslo", country: "Norway", lon: 10.7522, lat: 59.9139 },
  { city: "Copenhagen", country: "Denmark", lon: 12.5683, lat: 55.6761 },
  { city: "Helsinki", country: "Finland", lon: 24.9384, lat: 60.1699 },
  { city: "Warsaw", country: "Poland", lon: 21.0122, lat: 52.2297 },
  { city: "Prague", country: "Czech Republic", lon: 14.4378, lat: 50.0755 },
  { city: "Lisbon", country: "Portugal", lon: -9.1393, lat: 38.7223 },
  { city: "Athens", country: "Greece", lon: 23.7275, lat: 37.9838 },
  { city: "Moscow", country: "Russia", lon: 37.6173, lat: 55.7558 },
  { city: "Istanbul", country: "Turkey", lon: 28.9784, lat: 41.0082 },
  { city: "Kyiv", country: "Ukraine", lon: 30.5234, lat: 50.4501 },

  // Asia
  { city: "Mumbai", country: "India", lon: 72.8777, lat: 19.076 },
  { city: "Delhi", country: "India", lon: 77.1025, lat: 28.7041 },
  { city: "New Delhi", country: "India", lon: 77.209, lat: 28.6139 },
  { city: "Bangalore", country: "India", lon: 77.5946, lat: 12.9716 },
  { city: "Bengaluru", country: "India", lon: 77.5946, lat: 12.9716 },
  { city: "Hyderabad", country: "India", lon: 78.4867, lat: 17.385 },
  { city: "Chennai", country: "India", lon: 80.2707, lat: 13.0827 },
  { city: "Pune", country: "India", lon: 73.8567, lat: 18.5204 },
  { city: "Kolkata", country: "India", lon: 88.3639, lat: 22.5726 },
  { city: "Ahmedabad", country: "India", lon: 72.5714, lat: 23.0225 },
  { city: "Beijing", country: "China", lon: 116.4074, lat: 39.9042 },
  { city: "Shanghai", country: "China", lon: 121.4737, lat: 31.2304 },
  { city: "Shenzhen", country: "China", lon: 114.0579, lat: 22.5431 },
  { city: "Hong Kong", country: "China", lon: 114.1694, lat: 22.3193 },
  { city: "Tokyo", country: "Japan", lon: 139.6503, lat: 35.6762 },
  { city: "Osaka", country: "Japan", lon: 135.5023, lat: 34.6937 },
  { city: "Seoul", country: "South Korea", lon: 126.978, lat: 37.5665 },
  { city: "Singapore", country: "Singapore", lon: 103.8198, lat: 1.3521 },
  { city: "Jakarta", country: "Indonesia", lon: 106.8456, lat: -6.2088 },
  { city: "Bangkok", country: "Thailand", lon: 100.5018, lat: 13.7563 },
  { city: "Manila", country: "Philippines", lon: 120.9842, lat: 14.5995 },
  { city: "Kuala Lumpur", country: "Malaysia", lon: 101.6869, lat: 3.139 },
  { city: "Hanoi", country: "Vietnam", lon: 105.8342, lat: 21.0278 },
  { city: "Ho Chi Minh City", country: "Vietnam", lon: 106.6297, lat: 10.8231 },
  { city: "Karachi", country: "Pakistan", lon: 67.0011, lat: 24.8607 },
  { city: "Lahore", country: "Pakistan", lon: 74.3587, lat: 31.5497 },
  { city: "Islamabad", country: "Pakistan", lon: 73.0479, lat: 33.6844 },
  { city: "Dhaka", country: "Bangladesh", lon: 90.4125, lat: 23.8103 },
  { city: "Riyadh", country: "Saudi Arabia", lon: 46.6753, lat: 24.7136 },
  { city: "Jeddah", country: "Saudi Arabia", lon: 39.1925, lat: 21.4858 },
  { city: "Dubai", country: "United Arab Emirates", lon: 55.2708, lat: 25.2048 },
  { city: "Abu Dhabi", country: "United Arab Emirates", lon: 54.3773, lat: 24.4539 },
  { city: "Tel Aviv", country: "Israel", lon: 34.7818, lat: 32.0853 },
  { city: "Taipei", country: "Taiwan", lon: 121.5654, lat: 25.033 },

  // Africa
  { city: "Cairo", country: "Egypt", lon: 31.2357, lat: 30.0444 },
  { city: "Lagos", country: "Nigeria", lon: 3.3792, lat: 6.5244 },
  { city: "Nairobi", country: "Kenya", lon: 36.8219, lat: -1.2921 },
  { city: "Johannesburg", country: "South Africa", lon: 28.0473, lat: -26.2041 },
  { city: "Cape Town", country: "South Africa", lon: 18.4241, lat: -33.9249 },
  { city: "Casablanca", country: "Morocco", lon: -7.5898, lat: 33.5731 },
  { city: "Accra", country: "Ghana", lon: -0.187, lat: 5.6037 },

  // Oceania
  { city: "Sydney", country: "Australia", lon: 151.2093, lat: -33.8688 },
  { city: "Melbourne", country: "Australia", lon: 144.9631, lat: -37.8136 },
  { city: "Brisbane", country: "Australia", lon: 153.0251, lat: -27.4698 },
  { city: "Perth", country: "Australia", lon: 115.8605, lat: -31.9505 },
  { city: "Auckland", country: "New Zealand", lon: 174.7633, lat: -36.8485 },
];

function normalize(str = "") {
  return str.trim().toLowerCase();
}

/** Finds coordinates for a city, preferring an exact country match to disambiguate. */
export function findCityCoords(city, country) {
  if (!city) return null;
  const cityKey = normalize(city);
  const countryKey = normalize(country);

  const exact = CITY_COORDINATES.find(
    (c) => normalize(c.city) === cityKey && normalize(c.country) === countryKey
  );
  if (exact) return [exact.lon, exact.lat];

  const byCityOnly = CITY_COORDINATES.find((c) => normalize(c.city) === cityKey);
  return byCityOnly ? [byCityOnly.lon, byCityOnly.lat] : null;
}
