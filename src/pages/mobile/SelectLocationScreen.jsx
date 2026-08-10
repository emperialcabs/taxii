import React, { useState, useEffect } from 'react';
import { getBestLiveLocation } from '../../services/liveLocationService';

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
  { id: 'DEST-106', name: 'Bhavnagar ➔ Ghogha Circle & Beach', pickup: 'Bhavnagar, Gujarat', dropoff: 'Ghogha Circle & Beach', distanceKm: 12 }
];

export default function SelectLocationScreen({ pickupLoc, setPickupLoc, dropoffLoc, setDropoffLoc, onSelectLocation, onBack }) {
  const [places, setPlaces] = useState(DEFAULT_PLACES);
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'pickup' | 'dropoff' | null

  // Helper to fetch exact Admin Panel configuration
  const loadAdminConfig = () => {
    try {
      // 1. Load Admin Places
      const savedPlaces = localStorage.getItem('cabsy_places');
      if (savedPlaces) {
        const parsedP = JSON.parse(savedPlaces);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          const cleanPlaces = parsedP.map(p => typeof p === 'string' ? p : (p.name || p.title || p.location));
          setPlaces(cleanPlaces);
        }
      }

      // 2. Load Admin Routes
      const savedDestinations = localStorage.getItem('cabsy_destinations') || localStorage.getItem('cabsy_routes');
      if (savedDestinations) {
        const parsedD = JSON.parse(savedDestinations);
        if (Array.isArray(parsedD) && parsedD.length > 0) {
          setRoutes(parsedD);
          return;
        }
      }

      // 3. Fallback: If admin saved custom places, generate routes strictly for those admin places
      if (savedPlaces) {
        const parsedP = JSON.parse(savedPlaces);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          const generatedRoutes = parsedP.map((placeStr, idx) => {
            const pName = typeof placeStr === 'string' ? placeStr : (placeStr.name || placeStr.title || placeStr.location);
            return {
              id: `ADMIN-R-${idx}`,
              name: `Bhavnagar ➔ ${pName}`,
              pickup: 'Bhavnagar, Gujarat',
              dropoff: pName,
              distanceKm: 15 + (idx * 12)
            };
          });
          setRoutes(generatedRoutes);
        }
      }
    } catch (e) {
      console.warn("Failed to load admin routes:", e);
    }
  };

  useEffect(() => {
    loadAdminConfig();
  }, []);

  // Calculate distance for selected route
  const currentMatchedRoute = routes.find(r => 
    (pickupLoc && (r.pickup.toLowerCase().includes(pickupLoc.toLowerCase()) || pickupLoc.toLowerCase().includes(r.pickup.toLowerCase()))) &&
    (dropoffLoc && (r.dropoff.toLowerCase().includes(dropoffLoc.toLowerCase()) || dropoffLoc.toLowerCase().includes(r.dropoff.toLowerCase())))
  );

  const currentDistance = currentMatchedRoute 
    ? `${currentMatchedRoute.distanceKm} km`
    : (dropoffLoc ? '18 km' : '');

  const handleSelectRoute = (route) => {
    setPickupLoc(route.pickup);
    setDropoffLoc(route.dropoff);
    setActiveDropdown(null);
  };

  const isBothLocationsEntered = pickupLoc && pickupLoc.trim() !== '' && dropoffLoc && dropoffLoc.trim() !== '';

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC' }}>
      {/* Premium Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <button className="header-back-arrow" onClick={onBack}>←</button>
        <h2 className="white-header-title">Select Destination</h2>
      </div>

      <div style={{ padding: '16px 20px 100px 20px', overflowY: 'auto' }}>
        
        {/* Pickup & Dropoff Input Card */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          position: 'relative'
        }}>
          {/* Pickup Input */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.4)', display: 'inline-block' }}></span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>PICKUP LOCATION</span>
            </div>
            <input 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '14px', 
                border: '1.5px solid #CBD5E1', 
                outline: 'none', 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontSize: '15px', 
                fontWeight: '600', 
                color: '#0F172A', 
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }} 
              value={pickupLoc} 
              onChange={(e) => setPickupLoc(e.target.value)} 
              onFocus={() => setActiveDropdown('pickup')}
              placeholder="Search pickup spot or city..."
            />

            {/* Dropdown Options for Pickup */}
            {activeDropdown === 'pickup' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', maxHeight: '220px', overflowY: 'auto', marginTop: '6px' }}>
                <div 
                  onClick={async () => {
                    setPickupLoc('Detecting live location...');
                    const locRes = await getBestLiveLocation();
                    if (locRes && locRes.address) {
                      setPickupLoc(locRes.address);
                    } else {
                      setPickupLoc('Bhavnagar, Gujarat');
                    }
                    setActiveDropdown(null);
                  }}
                  style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#059669', background: '#ECFDF5', borderBottom: '1px solid #A7F3D0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span>🎯</span>
                  <span><strong>Use My Current Live GPS Spot</strong></span>
                </div>
                <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  ADMIN CONFINED PLACES & LOCATIONS
                </div>
                {places.map((place, i) => (
                  <div 
                    key={i}
                    style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0F172A', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onClick={() => {
                      setPickupLoc(place);
                      setActiveDropdown(null);
                    }}
                  >
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>📍</span>
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropoff Input */}
          <div style={{ position: 'relative', borderTop: '1px dashed #E2E8F0', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: 'bold' }}>📍</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>DROP-OFF DESTINATION</span>
              </div>
              {currentDistance && (
                <span style={{ background: '#F0FDF4', border: '1.5px solid #6EE7B7', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', boxShadow: '0 2px 6px rgba(5, 150, 105, 0.12)' }}>
                  Distance: {currentDistance}
                </span>
              )}
            </div>
            <input 
              style={{ 
                width: '100%', 
                padding: '12px 14px', 
                borderRadius: '14px', 
                border: '1.5px solid #CBD5E1', 
                outline: 'none', 
                fontFamily: 'Space Grotesk, sans-serif', 
                fontSize: '15px', 
                fontWeight: '600', 
                color: '#0F172A', 
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }} 
              value={dropoffLoc} 
              onChange={(e) => setDropoffLoc(e.target.value)} 
              onFocus={() => setActiveDropdown('dropoff')}
              placeholder="Search destination spot..."
            />

            {/* Dropdown Options for Dropoff */}
            {activeDropdown === 'dropoff' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', maxHeight: '200px', overflowY: 'auto', marginTop: '6px' }}>
                <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  ADMIN CONFINED PLACES & LOCATIONS
                </div>
                {places.map((place, i) => (
                  <div 
                    key={i}
                    style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0F172A', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    onClick={() => {
                      setDropoffLoc(place);
                      setActiveDropdown(null);
                    }}
                  >
                    <span style={{ color: '#EF4444', fontWeight: 'bold' }}>📍</span>
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DIRECT ROUTES SECTION */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontFamily: 'League Spartan', fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Available Direct Routes
            </h3>
            <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '700' }}>
              Tap route to select
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routes.map((route, idx) => {
              const isSelected = (pickupLoc === route.pickup && dropoffLoc === route.dropoff);
              const estFare = Math.round((route.distanceKm || 15) * 15);

              return (
                <div 
                  key={route.id || idx} 
                  style={{ 
                    padding: '16px', 
                    background: isSelected ? '#F0FDF4' : '#FFFFFF', 
                    borderRadius: '20px', 
                    border: isSelected ? '2px solid #10B981' : '1.5px solid #E2E8F0', 
                    boxShadow: isSelected ? '0 6px 18px rgba(52, 211, 153, 0.25)' : '0 2px 10px rgba(0,0,0,0.03)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleSelectRoute(route)}
                >
                  {/* Top Bar: Route Type & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      background: isSelected ? '#D1FAE5' : '#F1F5F9', 
                      color: isSelected ? '#059669' : '#475569', 
                      border: isSelected ? '1px solid #6EE7B7' : 'none',
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      letterSpacing: '0.3px'
                    }}>
                      DIRECT ROUTE
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>
                        {route.distanceKm} km
                      </span>
                      <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#22C55E' }}>
                        ₹{estFare}
                      </span>
                    </div>
                  </div>

                  {/* Route Timeline (From ➔ To) */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }}></span>
                      <div style={{ width: '2px', height: '18px', background: '#CBD5E1' }}></div>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {route.pickup}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {route.dropoff}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '16px 20px', 
        background: '#FFFFFF', 
        borderTop: '1px solid #E2E8F0', 
        boxShadow: '0 -6px 20px rgba(0,0,0,0.06)', 
        zIndex: 100 
      }}>
        <button 
          style={{
            width: '100%',
            background: isBothLocationsEntered 
              ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' 
              : '#E2E8F0',
            color: isBothLocationsEntered ? '#FFFFFF' : '#94A3B8',
            border: 'none',
            padding: '16px',
            borderRadius: '18px',
            fontFamily: 'League Spartan, sans-serif',
            fontSize: '18px',
            fontWeight: '800',
            cursor: isBothLocationsEntered ? 'pointer' : 'not-allowed',
            boxShadow: isBothLocationsEntered ? '0 8px 24px rgba(52, 211, 153, 0.4)' : 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          disabled={!isBothLocationsEntered}
          onClick={() => {
            if (isBothLocationsEntered) {
              onSelectLocation();
            }
          }}
        >
          {isBothLocationsEntered ? 'Confirm Route & Schedule Trip →' : 'Select Pickup & Destination'}
        </button>
      </div>
    </div>
  );
}
