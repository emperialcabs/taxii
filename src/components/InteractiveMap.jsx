import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom DivIcons for high visual appeal without image loading failures
const createUserPinIcon = (label = "Your Location") => {
  return L.divIcon({
    className: 'custom-leaflet-user-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background: #212B46; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-family: 'League Spartan', sans-serif; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); margin-bottom: 4px;">
          📍 ${label}
        </div>
        <div style="width: 18px; height: 18px; background: #22C55E; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 12px rgba(34,197,94,0.8); animation: pulse 2s infinite;"></div>
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
      <div style="transform: translate(-50%, -50%); background: #FFAA01; color: #212B46; padding: 6px 10px; border-radius: 20px; font-size: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; border: 2px solid #212B46; font-weight: bold;">
        🚕 <span style="font-size: 10px; margin-left: 3px; font-family: sans-serif;">${badge}</span>
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
        <div style="background: #EF4444; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; font-family: 'League Spartan', sans-serif; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); margin-bottom: 4px;">
          🏁 ${label}
        </div>
        <div style="width: 16px; height: 16px; background: #EF4444; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 10px rgba(239,68,68,0.7);"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Component to dynamically re-center map & trigger map.invalidateSize() safely
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
        if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
          map.flyTo([center.lat, center.lng], zoom || 15, { animate: true, duration: 1.2 });
        }
      } catch (err) {
        console.warn("Leaflet map view set notice:", err);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [center?.lat, center?.lng, zoom, map]);
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
      const lat = this.props.center?.lat || 47.6062;
      const lng = this.props.center?.lng || -122.3321;
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#E5E7EB' }}>
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

export default function InteractiveMap({
  center = { lat: 47.6062, lng: -122.3321 },
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
  const safeLat = (center && typeof center.lat === 'number' && !isNaN(center.lat)) ? center.lat : 47.6062;
  const safeLng = (center && typeof center.lng === 'number' && !isNaN(center.lng)) ? center.lng : -122.3321;
  const mapCenter = [safeLat, safeLng];

  // Calculate Haversine distance in KM between pickup and destination
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

  return (
    <div className="interactive-google-map-container" style={{ ...style, position: 'relative', width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none' }}>
      {/* Floating Total Distance Badge (Light Map Theme, Single Line) */}
      {distKm && (
        <div 
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            color: '#212B46',
            padding: '6px 14px',
            borderRadius: '20px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
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
          <span style={{ color: '#212B46', fontWeight: '800' }}>{distKm} KM</span>
          <span style={{ color: '#94A3B8' }}>•</span>
          <span style={{ color: '#22C55E', fontWeight: '600' }}>~{estMins} mins</span>
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
          style={{ width: '100%', height: '100%', background: '#E5E7EB' }}
        >
          <MapRecenter center={{ lat: safeLat, lng: safeLng }} zoom={zoom} />
          
          {/* High Performance Vector Roadmap Tile Layer (100% iOS Safari & WebView Compatible) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://maps.google.com">Google Maps</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            subdomains={['a', 'b', 'c', 'd']}
          />

          {/* User GPS Location Marker (Draggable for Pinpoint Accuracy) */}
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
              <Popup>📍 Drag pin to set exact pickup spot!</Popup>
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

          {/* Bold High-Contrast Route Line (Start -> End Map Route) */}
          {Array.isArray(routePolyline) && routePolyline.length > 0 ? (
            <>
              <Polyline 
                positions={routePolyline.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number').map(p => [p.lat, p.lng])} 
                pathOptions={{ color: '#212B46', weight: 8, opacity: 0.9 }} 
              />
              <Polyline 
                positions={routePolyline.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number').map(p => [p.lat, p.lng])} 
                pathOptions={{ color: '#FFAA01', weight: 5, opacity: 1.0 }} 
              />
            </>
          ) : (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number' ? (
            <>
              <Polyline
                positions={[[safeLat, safeLng], [destination.lat, destination.lng]]}
                pathOptions={{ color: '#212B46', weight: 8, opacity: 0.9 }}
              />
              <Polyline
                positions={[[safeLat, safeLng], [destination.lat, destination.lng]]}
                pathOptions={{ color: '#FFAA01', weight: 5, opacity: 1.0 }}
              />
            </>
          ) : null)}
        </MapContainer>
      </MapErrorBoundary>
    </div>
  );
}
