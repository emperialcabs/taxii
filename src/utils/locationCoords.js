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
    lat: defaultCoords.lat + (offsetLat || 0.015),
    lng: defaultCoords.lng + (offsetLng || 0.020),
    label: placeName
  };
}

export function generateRoutePolyline(startPos, endPos) {
  const midLat = (startPos.lat + endPos.lat) / 2 + 0.003;
  const midLng = (startPos.lng + endPos.lng) / 2 - 0.002;
  return [
    startPos,
    { lat: midLat, lng: midLng },
    endPos
  ];
}
