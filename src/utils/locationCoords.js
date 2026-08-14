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
  if (!startPos || !endPos) return [];

  // If Bhavnagar to Vadodara / Alkapuri: Route via Dhandhuka & Tarapur highway around gulf
  const isBhavnagar = startPos.lat < 21.9 && startPos.lng < 72.3;
  const isVadodara = endPos.lng > 73.0 && endPos.lat > 22.0 && endPos.lat < 22.5;

  if (isBhavnagar && isVadodara) {
    return [
      startPos,
      { lat: 21.8844, lng: 71.9318 }, // Vallabhipur
      { lat: 22.3732, lng: 71.9837 }, // Dhandhuka
      { lat: 22.4215, lng: 72.3115 }, // Fedara
      { lat: 22.4880, lng: 72.7042 }, // Tarapur
      { lat: 22.4500, lng: 73.0600 }, // Vasad
      endPos                          // Vadodara
    ];
  }

  // If Bhavnagar to Ahmedabad
  const isAhmedabad = endPos.lat > 22.9 && endPos.lng < 72.7;
  if (isBhavnagar && isAhmedabad) {
    return [
      startPos,
      { lat: 21.8844, lng: 71.9318 }, // Vallabhipur
      { lat: 22.3732, lng: 71.9837 }, // Dhandhuka
      { lat: 22.6074, lng: 72.1578 }, // Bagodara
      { lat: 22.8360, lng: 72.3644 }, // Bavla
      endPos                          // Ahmedabad
    ];
  }

  // General fallback: intermediate 3-point arc
  const midLat = (startPos.lat + endPos.lat) / 2 + 0.003;
  const midLng = (startPos.lng + endPos.lng) / 2 - 0.002;
  return [
    startPos,
    { lat: midLat, lng: midLng },
    endPos
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
