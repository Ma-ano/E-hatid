export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

let lastGeocodeTime = 0;

const geocodeCache = new Map<string, { result: GeocodeResult; timestamp: number }>();
const GECODE_TTL = 24 * 60 * 60 * 1000;

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!address.trim()) throw new Error('Address is required');

  const cacheKey = address.trim().toLowerCase();
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < GECODE_TTL) {
    return cached.result;
  }

  const now = Date.now();
  const elapsed = now - lastGeocodeTime;
  if (elapsed < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
  }
  lastGeocodeTime = Date.now();

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'RiderApp/1.0' },
  });
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error('Address not found. Please select a more specific address.');
  }

  const result: GeocodeResult = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };

  geocodeCache.set(cacheKey, { result, timestamp: Date.now() });

  return result;
}

export const clearGeocodeCache = () => geocodeCache.clear();
