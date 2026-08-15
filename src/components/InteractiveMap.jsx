import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Safely patch Leaflet DomUtil to prevent uncaught TypeError: Cannot read properties of undefined (reading '_leaflet_pos')
if (typeof L !== 'undefined' && L.DomUtil && !L.DomUtil._patchedLeafletPos) {
  L.DomUtil._patchedLeafletPos = true;
  const origGetPos = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el) {
    if (!el) return new L.Point(0, 0);
    try {
      return origGetPos.call(L.DomUtil, el) || new L.Point(0, 0);
    } catch (err) {
      return new L.Point(0, 0);
    }
  };
}

// Custom DivIcons for high visual appeal without image loading failures
const createUserPinIcon = (label = "Your Location") => {
  return L.divIcon({
    className: 'custom-leaflet-user-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background: #0F172A; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.25); margin-bottom: 4px;">
          <span style="color: #22C55E; margin-right: 4px;">●</span> ${label}
        </div>
        <div style="width: 16px; height: 16px; background: #22C55E; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(34,197,94,0.8);"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const createTaxiPinIcon = (badge = "Taxi") => {
  return L.divIcon({
    className: 'custom-leaflet-taxi-pin',
    html: `
      <div style="transform: translate(-50%, -50%); background: #10B981; color: #FFFFFF; padding: 5px 10px; border-radius: 16px; font-size: 12px; box-shadow: 0 4px 12px rgba(16,185,129,0.3); display: flex; align-items: center; justify-content: center; border: 2px solid #FFFFFF; font-weight: 800; font-family: 'Space Grotesk', sans-serif;">
        <span style="margin-right: 3px;">●</span> ${badge}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const createDestinationPinIcon = (label = "Dropoff") => {
  return L.divIcon({
    className: 'custom-leaflet-dest-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background: #EF4444; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.25); margin-bottom: 4px;">
          <span style="color: #FFFFFF; margin-right: 4px;">●</span> ${label}
        </div>
        <div style="width: 14px; height: 14px; background: #EF4444; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(239,68,68,0.7);"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Component to dynamically re-center & auto-fit route bounds on map view update
function MapRecenter({ center, destination, routePolyline, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !map._container) return;
    const timer = setTimeout(() => {
      try {
        if (!map._container) return;
        map.invalidateSize();

        if (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number' && center && typeof center.lat === 'number') {
          const bounds = L.latLngBounds([
            [center.lat, center.lng],
            [destination.lat, destination.lng]
          ]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
        } else if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
          map.flyTo([center.lat, center.lng], zoom || 15, { animate: true, duration: 1.2 });
        }
      } catch (err) {
        console.warn("Leaflet map view set notice:", err);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [center?.lat, center?.lng, destination?.lat, destination?.lng, zoom, map]);

  return null;
}

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Leaflet Map Render Exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lat = this.props.center?.lat || 21.7645;
      const lng = this.props.center?.lng || 72.1519;
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F1F5F9' }}>
          <iframe
            title="Google Maps Live Vector Fallback"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

import { fetchRoadPolyline } from '../utils/locationCoords';

export default function InteractiveMap({
  center = { lat: 21.7645, lng: 72.1519 },
  zoom = 15,
  showUserPin = true,
  userLabel = "Your Location",
  nearbyTaxis = [],
  destination = null,
  routePolyline = null,
  activeDriverPos = null,
  onUserLocationChange = null,
  style = { width: '100%', height: '100%' }
}) {
  const safeLat = (center && typeof center.lat === 'number' && !isNaN(center.lat)) ? center.lat : 21.7645;
  const safeLng = (center && typeof center.lng === 'number' && !isNaN(center.lng)) ? center.lng : 72.1519;
  const mapCenter = [safeLat, safeLng];

  const [liveRoadLine, setLiveRoadLine] = React.useState(null);

  useEffect(() => {
    if (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number') {
      let isMounted = true;
      fetchRoadPolyline({ lat: safeLat, lng: safeLng }, destination).then(pts => {
        if (isMounted && Array.isArray(pts) && pts.length > 0) {
          setLiveRoadLine(pts);
        }
      });
      return () => { isMounted = false; };
    } else {
      setLiveRoadLine(null);
    }
  }, [safeLat, safeLng, destination?.lat, destination?.lng]);

  // Calculate distance in KM between pickup and destination
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') return 18.5;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d < 0.5 ? 18.5 : Math.round(d * 10) / 10;
  };

  const distKm = destination && typeof destination.lat === 'number' ? calculateDistanceKm(safeLat, safeLng, destination.lat, destination.lng) : null;
  const estMins = distKm ? Math.max(12, Math.round(distKm * 1.5)) : null;

  const activePolyline = liveRoadLine || routePolyline;
  const rawPositions = Array.isArray(activePolyline) ? activePolyline : [];
  const safePositions = rawPositions
    .filter(p => p && typeof p.lat === 'number' && !isNaN(p.lat) && typeof p.lng === 'number' && !isNaN(p.lng))
    .map(p => [p.lat, p.lng]);
  const hasPolyline = safePositions.length >= 2;

  return (
    <div className="interactive-google-map-container" style={{ ...style, position: 'relative', width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none' }}>
      {/* Floating Total Distance Badge */}
      {distKm && (
        <div 
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            color: '#1E293B',
            padding: '6px 14px',
            borderRadius: '20px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            fontFamily: "'Space Grotesk', 'League Spartan', sans-serif",
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 1000,
            border: '1.5px solid #E2E8F0',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '14px' }}>🛣️</span>
          <span style={{ color: '#1E293B', fontWeight: '800' }}>{distKm} KM</span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ color: '#22C55E', fontWeight: '800' }}>~{estMins} mins</span>
        </div>
      )}

      <MapErrorBoundary center={{ lat: safeLat, lng: safeLng }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom || 15}
          zoomControl={false}
          dragging={true}
          touchZoom={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          style={{ width: '100%', height: '100%', background: '#F8FAFC' }}
        >
          <MapRecenter center={{ lat: safeLat, lng: safeLng }} destination={destination} routePolyline={routePolyline} zoom={zoom} />
          
          {/* Google Maps Vector Vector Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={20}
          />

          {/* User GPS Location Marker */}
          {showUserPin && (
            <Marker 
              position={[safeLat, safeLng]} 
              icon={createUserPinIcon(userLabel)}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  if (e.target && e.target.getLatLng) {
                    const newPos = e.target.getLatLng();
                    if (onUserLocationChange) {
                      onUserLocationChange({ lat: newPos.lat, lng: newPos.lng });
                    }
                  }
                }
              }}
            >
              <Popup>📍 Drag pin to set pickup spot!</Popup>
            </Marker>
          )}

          {/* Nearby Available Taxis */}
          {Array.isArray(nearbyTaxis) && nearbyTaxis.map((taxi, idx) => {
            if (!taxi || typeof taxi.lat !== 'number' || typeof taxi.lng !== 'number') return null;
            return (
              <Marker 
                key={idx} 
                position={[taxi.lat, taxi.lng]} 
                icon={createTaxiPinIcon(taxi.label || `Taxi #${idx + 1}`)}
              />
            );
          })}

          {/* Destination Pin */}
          {destination && typeof destination.lat === 'number' && typeof destination.lng === 'number' && (
            <Marker position={[destination.lat, destination.lng]} icon={createDestinationPinIcon(destination.label || "Dropoff Location")}>
              <Popup>🏁 {destination.label || "Destination"}</Popup>
            </Marker>
          )}

          {/* Active Driver Taxi Marker */}
          {activeDriverPos && typeof activeDriverPos.lat === 'number' && typeof activeDriverPos.lng === 'number' && (
            <Marker position={[activeDriverPos.lat, activeDriverPos.lng]} icon={createTaxiPinIcon("Your Driver")}>
              <Popup>🚕 Driver En Route</Popup>
            </Marker>
          )}

          {/* Google Maps Style Royal Blue Navigation Route Line */}
          {hasPolyline ? (
            <>
              <Polyline 
                positions={safePositions} 
                pathOptions={{ color: '#1E40AF', weight: 9, opacity: 0.7, lineCap: 'round', lineJoin: 'round' }} 
              />
              <Polyline 
                positions={safePositions} 
                pathOptions={{ color: '#2563EB', weight: 6, opacity: 1.0, lineCap: 'round', lineJoin: 'round' }} 
              />
            </>
          ) : (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number' ? (
            <>
              <Polyline
                positions={[[safeLat, safeLng], [destination.lat, destination.lng]]}
                pathOptions={{ color: '#1E40AF', weight: 9, opacity: 0.7, lineCap: 'round', lineJoin: 'round' }}
              />
              <Polyline
                positions={[[safeLat, safeLng], [destination.lat, destination.lng]]}
                pathOptions={{ color: '#2563EB', weight: 6, opacity: 1.0, lineCap: 'round', lineJoin: 'round' }}
              />
            </>
          ) : null)}
        </MapContainer>
      </MapErrorBoundary>
    </div>
  );
}
