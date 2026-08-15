// Location coordinates utility mapping Indian places to real coordinates
export const KNOWN_COORDINATES = {
  "bhavnagar": { lat: 21.7645, lng: 72.1519, label: "Bhavnagar, Gujarat" },
  "bhavnagar railway station": { lat: 21.7702, lng: 72.1444, label: "Bhavnagar Railway Station" },
  "ahmedabad airport": { lat: 23.0772, lng: 72.6347, label: "Ahmedabad Airport (AMD)" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, label: "Ahmedabad, Gujarat" },
  "vadodara central railway station": { lat: 22.3106, lng: 73.1670, label: "Vadodara Central Station" },
  "vadodara": { lat: 22.3106, lng: 73.1670, label: "Vadodara, Gujarat" },
  "sg highway": { lat: 23.0225, lng: 72.5714, label: "SG Highway IT Park" },
  "alkapuri": { lat: 22.3100, lng: 73.1700, label: "Alkapuri Commercial Hub" },
  "ghogha": { lat: 21.6845, lng: 72.2750, label: "Ghogha Circle & Beach" },
  "mumbai central airport": { lat: 19.0896, lng: 72.8656, label: "Mumbai Central Airport (BOM)" },
  "mumbai": { lat: 19.0760, lng: 72.8777, label: "Mumbai, Maharashtra" }
};

export function getCoordsForPlace(placeName, defaultCoords = { lat: 21.7645, lng: 72.1519 }) {
  if (!placeName) return defaultCoords;

  if (typeof placeName === 'object') {
    if (typeof placeName.lat === 'number' && typeof placeName.lng === 'number') {
      return placeName;
    }
    placeName = placeName.label || placeName.name || placeName.pickup || placeName.dropoff || '';
  }

  if (typeof placeName !== 'string') {
    return defaultCoords;
  }

  const p = placeName.toLowerCase();

  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (p.includes(key)) {
      return { ...coords, label: placeName };
    }
  }

  // Slight deterministic offset for unknown places so route line doesn't collapse
  let hash = 0;
  for (let i = 0; i < placeName.length; i++) {
    hash = placeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offsetLat = ((hash % 100) / 10000);
  const offsetLng = (((hash >> 2) % 100) / 10000);

  return {
    lat: (defaultCoords && typeof defaultCoords.lat === 'number' ? defaultCoords.lat : 21.7645) + (offsetLat || 0.015),
    lng: (defaultCoords && typeof defaultCoords.lng === 'number' ? defaultCoords.lng : 72.1519) + (offsetLng || 0.020),
    label: placeName
  };
}

/**
 * Generates initial highway waypoints around Gulf of Khambhat / major highways
 */
export function generateRoutePolyline(startPos, endPos) {
  const safeStart = (startPos && typeof startPos.lat === 'number' && !isNaN(startPos.lat) && typeof startPos.lng === 'number' && !isNaN(startPos.lng)) ? startPos : { lat: 21.7645, lng: 72.1519 };
  const safeEnd = (endPos && typeof endPos.lat === 'number' && !isNaN(endPos.lat) && typeof endPos.lng === 'number' && !isNaN(endPos.lng)) ? endPos : { lat: 23.0225, lng: 72.5714 };

  const isBhavnagar = safeStart.lat < 21.9 && safeStart.lng < 72.3;
  const isVadodara = safeEnd.lng > 73.0 && safeEnd.lat > 22.0 && safeEnd.lat < 22.5;

  if (isBhavnagar && isVadodara) {
    return [
      safeStart,
      { lat: 21.8844, lng: 71.9318 },
      { lat: 22.3732, lng: 71.9837 },
      { lat: 22.4215, lng: 72.3115 },
      { lat: 22.4880, lng: 72.7042 },
      { lat: 22.4500, lng: 73.0600 },
      safeEnd
    ];
  }

  const isAhmedabad = safeEnd.lat > 22.9 && safeEnd.lng < 72.7;
  if (isBhavnagar && isAhmedabad) {
    return [
      safeStart,
      { lat: 21.8844, lng: 71.9318 },
      { lat: 22.3732, lng: 71.9837 },
      { lat: 22.6074, lng: 72.1578 },
      { lat: 22.8360, lng: 72.3644 },
      safeEnd
    ];
  }

  const midLat = (safeStart.lat + safeEnd.lat) / 2 + 0.003;
  const midLng = (safeStart.lng + safeEnd.lng) / 2 - 0.002;
  return [
    safeStart,
    { lat: midLat, lng: midLng },
    safeEnd
  ];
}

/**
 * Fetches real turn-by-turn road route coordinates from OSRM driving router
 */
export async function fetchRoadPolyline(startPos, endPos) {
  if (!startPos || !endPos) return generateRoutePolyline(startPos, endPos);
  
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startPos.lng},${startPos.lat};${endPos.lng},${endPos.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await response.json();

    if (data && data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
      const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
      if (coords.length > 1) return coords;
    }
  } catch (e) {
    console.warn("OSRM routing fallback used:", e);
  }

  return generateRoutePolyline(startPos, endPos);
}

/**
 * Calculates distance in KM between 2 coordinates
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number' || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Estimates Google Maps style driving time in minutes based on real driving speeds
 */
export function estimateEtaMins(distKm) {
  if (!distKm || distKm <= 0) return 0;
  if (distKm <= 10) return Math.round(distKm * 2.4); // City traffic ~25 km/h
  if (distKm <= 40) return Math.round(distKm * 1.6); // Suburbs ~37 km/h
  return Math.round(distKm * 1.25); // Highway driving ~48 km/h
}
