import React, { useState, useEffect } from 'react';

const DEFAULT_PLACES = [
  "Bhavnagar, Gujarat",
  "Bhavnagar Railway Station",
  "Ahmedabad Airport (AMD)",
  "Vadodara Central Railway Station",
  "SG Highway IT Park",
  "Alkapuri Commercial Hub",
  "Ghogha Circle & Beach",
  "Mumbai Central Airport (BOM)"
];

const DEFAULT_ROUTES = [
  { id: 'DEST-101', name: 'Bhavnagar ➔ Railway Station', pickup: 'Bhavnagar, Gujarat', dropoff: 'Bhavnagar Railway Station', distanceKm: 18 },
  { id: 'DEST-102', name: 'Bhavnagar ➔ Ahmedabad Airport (AMD)', pickup: 'Bhavnagar, Gujarat', dropoff: 'Ahmedabad Airport (AMD)', distanceKm: 175 },
  { id: 'DEST-103', name: 'Bhavnagar ➔ Vadodara Central Station', pickup: 'Bhavnagar, Gujarat', dropoff: 'Vadodara Central Railway Station', distanceKm: 110 },
  { id: 'DEST-104', name: 'Bhavnagar ➔ SG Highway IT Park', pickup: 'Bhavnagar, Gujarat', dropoff: 'SG Highway IT Park', distanceKm: 180 },
  { id: 'DEST-105', name: 'Bhavnagar ➔ Alkapuri Hub', pickup: 'Bhavnagar, Gujarat', dropoff: 'Alkapuri Commercial Hub', distanceKm: 112 },
  { id: 'DEST-106', name: 'Bhavnagar ➔ Ghogha Circle & Beach', pickup: 'Bhavnagar, Gujarat', dropoff: 'Ghogha Circle & Beach', distanceKm: 12 },
  { id: 'DEST-107', name: 'Bhavnagar ➔ Mumbai Central Airport', pickup: 'Bhavnagar, Gujarat', dropoff: 'Mumbai Central Airport (BOM)', distanceKm: 540 }
];

export default function SelectLocationScreen({ pickupLoc, setPickupLoc, dropoffLoc, setDropoffLoc, onSelectLocation, onBack }) {
  const [places, setPlaces] = useState(DEFAULT_PLACES);
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'pickup' | 'dropoff' | null

  // Fetch live Admin Panel configuration from localStorage
  useEffect(() => {
    try {
      const savedPlaces = localStorage.getItem('cabsy_places');
      if (savedPlaces) {
        const parsedP = JSON.parse(savedPlaces);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          setPlaces(parsedP);
        }
      }

      const savedDestinations = localStorage.getItem('cabsy_destinations');
      if (savedDestinations) {
        const parsedD = JSON.parse(savedDestinations);
        if (Array.isArray(parsedD) && parsedD.length > 0) {
          setRoutes(parsedD);
        }
      }
    } catch (e) {
      console.warn("Failed to load admin routes:", e);
    }
  }, []);

  // Calculate distance display for selected route
  const currentMatchedRoute = routes.find(r => 
    (pickupLoc && (r.pickup.toLowerCase().includes(pickupLoc.toLowerCase()) || pickupLoc.toLowerCase().includes(r.pickup.toLowerCase()))) &&
    (dropoffLoc && (r.dropoff.toLowerCase().includes(dropoffLoc.toLowerCase()) || dropoffLoc.toLowerCase().includes(r.dropoff.toLowerCase())))
  );

  const currentDistance = currentMatchedRoute 
    ? `${currentMatchedRoute.distanceKm} km`
    : (dropoffLoc ? '18 km' : '');

  const handleSelectAdminRoute = (route) => {
    setPickupLoc(route.pickup);
    setDropoffLoc(route.dropoff);
    setActiveDropdown(null);
  };

  const isBothLocationsEntered = pickupLoc && pickupLoc.trim() !== '' && dropoffLoc && dropoffLoc.trim() !== '';

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Select Destination</h2>
      </div>

      <div style={{ padding: '16px 20px', paddingBottom: '100px', overflowY: 'auto' }}>
        {/* Pickup & Dropoff Selection Card */}
        <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '1.5px solid #E2E8F0', marginBottom: '16px', position: 'relative' }}>
          
          {/* Pickup Location Selector */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#22C55E', letterSpacing: '0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>●</span> PICK-UP LOCATION (FROM ADMIN PLACES)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '600', color: '#212B46', background: '#FFFFFF' }} 
                value={pickupLoc} 
                onChange={(e) => setPickupLoc(e.target.value)} 
                onFocus={() => setActiveDropdown('pickup')}
                placeholder="Select or type Pick-up Location"
              />
            </div>

            {/* Dropdown Options for Pickup */}
            {activeDropdown === 'pickup' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxHeight: '180px', overflowY: 'auto', marginTop: '4px' }}>
                <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
                  ADMIN PLACES ({places.length})
                </div>
                {places.map((place, i) => (
                  <div 
                    key={i}
                    style={{ padding: '10px 14px', fontSize: '14px', fontWeight: '600', color: '#212B46', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                    onClick={() => {
                      setPickupLoc(place);
                      setActiveDropdown(null);
                    }}
                  >
                    🟢 {place}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropoff Location Selector */}
          <div style={{ position: 'relative', borderTop: '1px dashed #CBD5E1', paddingTop: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#FB4945', letterSpacing: '0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📍</span> DROP-OFF DESTINATION (TO ADMIN PLACES)
              </span>
              {currentDistance && (
                <span style={{ background: '#212B46', color: '#FFAA01', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                  🛣️ {currentDistance}
                </span>
              )}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '600', color: '#212B46', background: '#FFFFFF' }} 
                value={dropoffLoc} 
                onChange={(e) => setDropoffLoc(e.target.value)} 
                onFocus={() => setActiveDropdown('dropoff')}
                placeholder="Select or type Dropoff Destination"
              />
            </div>

            {/* Dropdown Options for Dropoff */}
            {activeDropdown === 'dropoff' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxHeight: '180px', overflowY: 'auto', marginTop: '4px' }}>
                <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0' }}>
                  ADMIN DESTINATIONS ({places.length})
                </div>
                {places.map((place, i) => (
                  <div 
                    key={i}
                    style={{ padding: '10px 14px', fontSize: '14px', fontWeight: '600', color: '#212B46', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                    onClick={() => {
                      setDropoffLoc(place);
                      setActiveDropdown(null);
                    }}
                  >
                    🔴 {place}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Places Badges Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#212B46', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>📍 ADMIN LOCATION PLACES ({places.length})</span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Tap to select</span>
          </div>
          <div className="location-chips-bar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {places.map((place, i) => (
              <button 
                key={i} 
                className={`location-chip-btn ${dropoffLoc === place ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                onClick={() => {
                  if (!pickupLoc || pickupLoc.trim() === '') {
                    setPickupLoc("Bhavnagar, Gujarat");
                  }
                  setDropoffLoc(place);
                }}
              >
                📍 {place}
              </button>
            ))}
          </div>
        </div>

        {/* ADMIN CREATED ROUTES SECTION ONLY */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#212B46', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🛣️ ADMIN CONFIGURED ROUTES ({routes.length})</span>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700' }}>Tap route to auto-fill</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {routes.map((route, idx) => {
              const isSelected = (pickupLoc === route.pickup && dropoffLoc === route.dropoff);
              const estFare = Math.round((route.distanceKm || 15) * 15);

              return (
                <div 
                  key={route.id || idx} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '14px', 
                    background: isSelected ? '#FEF3C7' : '#FFFFFF', 
                    borderRadius: '16px', 
                    border: isSelected ? '2px solid #FFAA01' : '1.5px solid #E2E8F0', 
                    boxShadow: isSelected ? '0 4px 12px rgba(255,170,1,0.2)' : '0 2px 8px rgba(0,0,0,0.03)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleSelectAdminRoute(route)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#212B46', color: '#FFAA01', padding: '3px 8px', borderRadius: '8px' }}>
                      {route.id || `ROUTE-${idx + 1}`}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#212B46' }}>🛣️ {route.distanceKm} KM</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#22C55E' }}>₹{estFare}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#212B46' }}>
                      <span style={{ color: '#22C55E', fontWeight: 'bold' }}>●</span>
                      <span>From: {route.pickup}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#212B46' }}>
                      <span style={{ color: '#FB4945', fontWeight: 'bold' }}>📍</span>
                      <span>To: {route.dropoff}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', zIndex: 100 }}>
        <button 
          style={{
            width: '100%',
            background: isBothLocationsEntered ? '#212B46' : '#94A3B8',
            color: isBothLocationsEntered ? '#FFAA01' : '#FFFFFF',
            border: 'none',
            padding: '16px',
            borderRadius: '16px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '16px',
            fontWeight: '800',
            cursor: isBothLocationsEntered ? 'pointer' : 'not-allowed',
            boxShadow: isBothLocationsEntered ? '0 4px 14px rgba(33,43,70,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          disabled={!isBothLocationsEntered}
          onClick={() => {
            if (isBothLocationsEntered) {
              onSelectLocation();
            }
          }}
        >
          {isBothLocationsEntered ? 'Confirm Admin Route & Proceed →' : 'Select Pickup & Dropoff Location'}
        </button>
      </div>
    </div>
  );
}
