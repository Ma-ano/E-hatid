/**
 * DELIVERY FEE & DISTANCE ENGINE
 *
 * Distance Source Priority (STRICT):
 *   1. OSRM (primary) — real road-based routing
 *   2. Haversine (fallback only) — straight-line when OSRM fails
 *
 * Rounding: always round UP to nearest km (Math.ceil)
 * Minimum: at least 1 km charged even if distance is 0
 * Pricing: fare = final_km * perKmRate + (gasPrice / kmPerLiter) * distance_km + bonus
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface DeliveryConfig {
  perKmRate: number;
  gasPrice: number;
  kmPerLiter: number;
  bonus: number;
}

export interface DeliveryResult {
  distance_km: number;
  final_km: number;
  fare: number;
  source: 'osrm' | 'fallback';
  config: DeliveryConfig;
}

const DEFAULT_CONFIG: DeliveryConfig = {
  perKmRate: 30,
  gasPrice: 60,
  kmPerLiter: 40,
  bonus: 0,
};

let cachedConfig: DeliveryConfig | null = null;

export const fetchDeliveryConfig = async (): Promise<DeliveryConfig> => {
  if (cachedConfig) return cachedConfig;
  try {
    const snap = await getDoc(doc(db, 'config', 'delivery'));
    if (snap.exists()) {
      cachedConfig = { ...DEFAULT_CONFIG, ...snap.data() } as DeliveryConfig;
      return cachedConfig!;
    }
  } catch (err) {
    console.error('Failed to fetch delivery config:', err);
  }
  return DEFAULT_CONFIG;
};

export const clearDeliveryConfigCache = () => {
  cachedConfig = null;
};

const OSRM_TIMEOUT = 10_000;

const osrmDistanceCache = new Map<string, { distance_km: number; timestamp: number }>();
const OSRM_CACHE_TTL = 60 * 60 * 1000;

function osrmCacheKey(lat1: number, lng1: number, lat2: number, lng2: number): string {
  return `${lat1.toFixed(6)},${lng1.toFixed(6)}-${lat2.toFixed(6)},${lng2.toFixed(6)}`;
}

const getRoadDistance = async (
  stallLat: number, stallLng: number,
  custLat: number, custLng: number
): Promise<{ distance_km: number } | null> => {
  const key = osrmCacheKey(stallLat, stallLng, custLat, custLng);
  const cached = osrmDistanceCache.get(key);
  if (cached && Date.now() - cached.timestamp < OSRM_CACHE_TTL) {
    return { distance_km: cached.distance_km };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OSRM_TIMEOUT);

    const url = `https://router.project-osrm.org/route/v1/driving/${stallLng},${stallLat};${custLng},${custLat}?overview=false`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;

    const route = data.routes[0];
    const result = { distance_km: route.distance / 1000 };

    osrmDistanceCache.set(key, { ...result, timestamp: Date.now() });

    return result;
  } catch (err) {
    console.error('OSRM route error:', err);
    return null;
  }
};

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const getDeliveryFeeInfo = async (
  stallLat?: number, stallLng?: number,
  custLat?: number, custLng?: number
): Promise<DeliveryResult> => {
  const config = await fetchDeliveryConfig();

  if (stallLat == null || stallLng == null || custLat == null || custLng == null) {
    const final_km = 1;
    const fare = final_km * config.perKmRate + config.bonus;
    return { distance_km: 0, final_km, fare, source: 'fallback', config };
  }

  const route = await getRoadDistance(stallLat, stallLng, custLat, custLng);
  let distance_km: number;
  let source: 'osrm' | 'fallback';

  if (route && route.distance_km > 0) {
    distance_km = route.distance_km;
    source = 'osrm';
  } else {
    distance_km = haversine(stallLat, stallLng, custLat, custLng);
    source = 'fallback';
  }

  const final_km = Math.max(1, Math.ceil(distance_km));
  const fuelAdjustment = (config.gasPrice / config.kmPerLiter) * distance_km;
  const fare = final_km * config.perKmRate + fuelAdjustment + config.bonus;

  return {
    distance_km: Math.round(distance_km * 100) / 100,
    final_km,
    fare: Math.round(fare * 100) / 100,
    source,
    config,
  };
};

export const clearDeliveryCache = () => {
  osrmDistanceCache.clear();
};
