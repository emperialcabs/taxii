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

  const isBhavnagarSide = safeStart.lat < 22.1 && safeStart.lng < 72.4;
  const isVadodaraSide = safeEnd.lng > 73.0 && safeEnd.lat > 22.0 && safeEnd.lat < 22.6;

  // Real highway routing around Gulf of Khambhat (Bhavnagar -> Dholera -> Vataman -> Tarapur -> Anand -> Vadodara)
  if (isBhavnagarSide && isVadodaraSide) {
    return [
      safeStart,
      { lat: 22.2500, lng: 72.1800 }, // Dholera Expressway
      { lat: 22.4300, lng: 72.2200 }, // Vataman Circle
      { lat: 22.4900, lng: 72.7000 }, // Tarapur Cross Road
      { lat: 22.5500, lng: 72.9500 }, // Anand Bypass
      safeEnd
    ];
  }

  // Reverse check: Vadodara -> Bhavnagar
  const isBhavnagarEnd = safeEnd.lat < 22.1 && safeEnd.lng < 72.4;
  const isVadodaraStart = safeStart.lng > 73.0 && safeStart.lat > 22.0 && safeStart.lat < 22.6;
  if (isVadodaraStart && isBhavnagarEnd) {
    return [
      safeStart,
      { lat: 22.5500, lng: 72.9500 },
      { lat: 22.4900, lng: 72.7000 },
      { lat: 22.4300, lng: 72.2200 },
      { lat: 22.2500, lng: 72.1800 },
      safeEnd
    ];
  }

  // Create clean 5-point interpolated road curve starting directly from live user location to destination
  const p1 = safeStart;
  const p5 = safeEnd;
  const latDiff = p5.lat - p1.lat;
  const lngDiff = p5.lng - p1.lng;

  const p2 = { lat: p1.lat + latDiff * 0.25 + 0.002, lng: p1.lng + lngDiff * 0.25 - 0.001 };
  const p3 = { lat: p1.lat + latDiff * 0.50 + 0.003, lng: p1.lng + lngDiff * 0.50 + 0.002 };
  const p4 = { lat: p1.lat + latDiff * 0.75 + 0.001, lng: p1.lng + lngDiff * 0.75 - 0.001 };

  return [p1, p2, p3, p4, p5];
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
 * Calculates distance in KM between 2 coordinates accounting for real road routes
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
  const crowFliesDist = R * c;

  // Check if route bypasses Gulf of Khambhat (e.g. Bhavnagar to Vadodara / Anand)
  const isBhavnagar1 = lat1 < 22.1 && lon1 < 72.4;
  const isVadodara2 = lon2 > 73.0 && lat2 > 22.0 && lat2 < 22.6;
  const isBhavnagar2 = lat2 < 22.1 && lon2 < 72.4;
  const isVadodara1 = lon1 > 73.0 && lat1 > 22.0 && lat1 < 22.6;

  if ((isBhavnagar1 && isVadodara2) || (isVadodara1 && isBhavnagar2)) {
    // Road driving distance around Gulf of Khambhat highway bypass (Dholera - Vataman - Tarapur)
    const roadDist = crowFliesDist * 1.76;
    return Math.round(roadDist * 10) / 10;
  }

  // Standard Indian road driving factor (~1.25x crow flies distance for normal roads)
  const standardRoadDist = crowFliesDist * 1.25;
  return Math.round(standardRoadDist * 10) / 10;
}

/**
 * Estimates Google Maps style driving time in minutes based on real driving speeds
 */
export function estimateEtaMins(distKm) {
  if (!distKm || distKm <= 0) return 0;
  if (distKm <= 10) return Math.round(distKm * 2.4); // City traffic ~25 km/h
  if (distKm <= 40) return Math.round(distKm * 1.6); // Suburbs ~37 km/h
  // Highway driving (~62 km/h avg speed -> ~0.96 min per km)
  return Math.round(distKm * 0.96);
}
