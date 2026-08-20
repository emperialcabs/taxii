import React, { useState, useEffect } from 'react';
import { getBestLiveLocation } from '../../services/liveLocationService';
import { Navigation, MapPin, ArrowLeft, ArrowRight, Compass, Sparkles, Calendar, Clock, Plus, Minus, CheckCircle, Car } from 'lucide-react';

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

const POPULAR_CITIES = [
  "Bhavnagar",
  "Ahmedabad",
  "Vadodara",
  "Surat",
  "Rajkot",
  "Mumbai",
  "Gandhinagar"
];

const DEFAULT_ROUTES = [
  { id: 'DEST-101', name: 'Bhavnagar ➔ Railway Station', pickup: 'Bhavnagar, Gujarat', dropoff: 'Bhavnagar Railway Station', distanceKm: 18 },
  { id: 'DEST-102', name: 'Bhavnagar ➔ Ahmedabad Airport (AMD)', pickup: 'Bhavnagar, Gujarat', dropoff: 'Ahmedabad Airport (AMD)', distanceKm: 175 },
  { id: 'DEST-103', name: 'Bhavnagar ➔ Vadodara Central Station', pickup: 'Bhavnagar, Gujarat', dropoff: 'Vadodara Central Railway Station', distanceKm: 110 },
  { id: 'DEST-104', name: 'Bhavnagar ➔ SG Highway IT Park', pickup: 'Bhavnagar, Gujarat', dropoff: 'SG Highway IT Park', distanceKm: 180 },
  { id: 'DEST-105', name: 'Bhavnagar ➔ Alkapuri Hub', pickup: 'Bhavnagar, Gujarat', dropoff: 'Alkapuri Commercial Hub', distanceKm: 112 },
  { id: 'DEST-106', name: 'Bhavnagar ➔ Ghogha Circle & Beach', pickup: 'Bhavnagar, Gujarat', dropoff: 'Ghogha Circle & Beach', distanceKm: 12 }
];

export default function SelectLocationScreen({ 
  pickupLoc, 
  setPickupLoc, 
  dropoffLoc, 
  setDropoffLoc, 
  pickupCity = '',
  setPickupCity = () => {},
  dropoffCity = '',
  setDropoffCity = () => {},
  noOfDays = 1,
  setNoOfDays = () => {},
  isCustom = false,
  setIsCustom = () => {},
  tripType,
  setTripType = () => {},
  onSelectLocation, 
  onBack 
}) {
  const [places, setPlaces] = useState(DEFAULT_PLACES);
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'pickup' | 'dropoff' | 'pickupCity' | 'dropoffCity' | null
  const [mode, setMode] = useState(isCustom ? 'custom' : 'standard'); // 'standard' | 'custom'

  // Local Custom Form State
  const [cPickupCity, setCPickupCity] = useState(pickupCity || 'Bhavnagar');
  const [cDropoffCity, setCDropoffCity] = useState(dropoffCity || 'Ahmedabad');
  const [cPickupAddress, setCPickupAddress] = useState(pickupLoc || 'Bhavnagar, Gujarat');
  const [cDropoffAddress, setCDropoffAddress] = useState(dropoffLoc || 'Ahmedabad Airport (AMD)');
  const [cDays, setCDays] = useState(noOfDays || 1);

  // Sync back config
  const loadAdminConfig = () => {
    try {
      const savedPlaces = localStorage.getItem('cabsy_places');
      if (savedPlaces) {
        const parsedP = JSON.parse(savedPlaces);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          const cleanPlaces = parsedP.map(p => typeof p === 'string' ? p : (p.name || p.title || p.location));
          setPlaces(cleanPlaces);
        }
      }

      const savedDestinations = localStorage.getItem('cabsy_destinations') || localStorage.getItem('cabsy_routes');
      if (savedDestinations) {
        const parsedD = JSON.parse(savedDestinations);
        if (Array.isArray(parsedD) && parsedD.length > 0) {
          setRoutes(parsedD);
          return;
        }
      }

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

  const handleSelectRoute = (route) => {
    setPickupLoc(route.pickup);
    setDropoffLoc(route.dropoff);
    setIsCustom(false);
    setActiveDropdown(null);
  };

  const isStandardReady = pickupLoc && pickupLoc.trim() !== '' && dropoffLoc && dropoffLoc.trim() !== '';
  const isCustomReady = cPickupCity.trim() !== '' && cDropoffCity.trim() !== '' && cPickupAddress.trim() !== '' && cDropoffAddress.trim() !== '';

  const handleProceedStandard = () => {
    setIsCustom(false);
    onSelectLocation();
  };

  const handleProceedCustom = () => {
    setIsCustom(true);
    setPickupCity(cPickupCity);
    setDropoffCity(cDropoffCity);
    setPickupLoc(cPickupAddress);
    setDropoffLoc(cDropoffAddress);
    setNoOfDays(cDays);
    if (setTripType) setTripType('custom-trip');
    onSelectLocation();
  };

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="header-back-arrow" onClick={onBack} style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F172A' }}>
            <ArrowLeft size={18} />
          </button>
          <h2 className="white-header-title" style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'League Spartan, sans-serif' }}>Select Destination</h2>
        </div>
      </div>

      <div className="mobile-screen-body" style={{ padding: '16px 20px 110px 20px', flex: 1 }}>
        
        {/* PREMIUM CLEAN LIGHT SEGMENTED TOGGLE */}
        <div style={{ 
          background: '#F1F5F9', 
          borderRadius: '16px', 
          padding: '4px', 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4px', 
          marginBottom: '20px',
          border: '1px solid #E2E8F0'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('standard');
              setIsCustom(false);
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: mode === 'standard' ? '1px solid #CBD5E1' : 'none',
              background: mode === 'standard' ? '#FFFFFF' : 'transparent',
              color: mode === 'standard' ? '#0F172A' : '#64748B',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: mode === 'standard' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Car size={16} color={mode === 'standard' ? '#10B981' : '#64748B'} />
            <span>Point-to-Point</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('custom');
              setIsCustom(true);
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: mode === 'custom' ? '1.5px solid #10B981' : 'none',
              background: mode === 'custom' ? '#FFFFFF' : 'transparent',
              color: mode === 'custom' ? '#0F172A' : '#64748B',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: mode === 'custom' ? '0 2px 8px rgba(16,185,129,0.15)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} color={mode === 'custom' ? '#10B981' : '#64748B'} />
            <span>Custom Trip</span>
          </button>
        </div>

        {/* MODE 1: STANDARD POINT-TO-POINT */}
        {mode === 'standard' && (
          <div>
            {/* Pickup & Dropoff Card */}
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
                      <Navigation size={18} color="#10B981" />
                      <span><strong>Use My Current Live GPS Spot</strong></span>
                    </div>
                    <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      POPULAR SPOTS & CITIES
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
                        <MapPin size={16} color="#10B981" />
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropoff Input */}
              <div style={{ position: 'relative', borderTop: '1px dashed #E2E8F0', paddingTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MapPin size={16} color="#EF4444" />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px' }}>DROP-OFF DESTINATION</span>
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

                {activeDropdown === 'dropoff' && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', maxHeight: '200px', overflowY: 'auto', marginTop: '6px' }}>
                    <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '800', color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      POPULAR SPOTS & CITIES
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
                        <MapPin size={16} color="#EF4444" />
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Routes List */}
            <div>
              <h3 style={{ fontFamily: 'League Spartan', fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0' }}>
                Available Direct Routes
              </h3>
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
                        position: 'relative'
                      }}
                      onClick={() => handleSelectRoute(route)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: isSelected ? '#D1FAE5' : '#F1F5F9', color: isSelected ? '#059669' : '#475569', padding: '4px 10px', borderRadius: '12px' }}>
                          DIRECT ROUTE
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>{route.distanceKm} km</span>
                          <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#22C55E' }}>₹{estFare}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }}></span>
                          <div style={{ width: '2px', height: '18px', background: '#CBD5E1' }}></div>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>{route.pickup}</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif' }}>{route.dropoff}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CUSTOM OUTSTATION & MULTI-CITY TRIP (CLEAN LIGHT CORPORATE UI) */}
        {mode === 'custom' && (
          <div>
            {/* HERO CARD - CLEAN WHITE WITH EMERALD ACCENT */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid #E2E8F0',
              marginBottom: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  ✨ Multi-City Custom Trip
                </span>
                <Sparkles size={20} color="#10B981" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#0F172A', lineHeight: 1.2 }}>
                Custom Outstation & Multi-Day Rental
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.4 }}>
                Specify your exact pickup & dropoff cities, door-to-door locations, and number of days.
              </p>
            </div>

            {/* CITIES & LOCATIONS FORM CARD */}
            <div style={{ 
              background: '#FFFFFF', 
              borderRadius: '24px', 
              padding: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
              border: '1.5px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              {/* PICKUP & DROPOFF CITY GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {/* Pickup City */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    PICKUP CITY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhavnagar"
                    value={cPickupCity}
                    onChange={(e) => setCPickupCity(e.target.value)}
                    onFocus={() => setActiveDropdown('pickupCity')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '1.5px solid #CBD5E1',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#0F172A',
                      background: '#F8FAFC',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {activeDropdown === 'pickupCity' && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '160px', overflowY: 'auto', marginTop: '4px' }}>
                      {POPULAR_CITIES.map((city, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCPickupCity(city);
                            setActiveDropdown(null);
                          }}
                          style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', color: '#0F172A', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                        >
                          📍 {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropoff City */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    DROPOFF CITY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmedabad"
                    value={cDropoffCity}
                    onChange={(e) => setCDropoffCity(e.target.value)}
                    onFocus={() => setActiveDropdown('dropoffCity')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '1.5px solid #CBD5E1',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#0F172A',
                      background: '#F8FAFC',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {activeDropdown === 'dropoffCity' && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '160px', overflowY: 'auto', marginTop: '4px' }}>
                      {POPULAR_CITIES.map((city, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCDropoffCity(city);
                            setActiveDropdown(null);
                          }}
                          style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', color: '#0F172A', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                        >
                          🏁 {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTUAL DETAILED PICKUP LOCATION */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
                  ACTUAL DETAILED PICKUP LOCATION
                </label>
                <input
                  type="text"
                  placeholder="e.g. House 14, Waghawadi Road, near Circle"
                  value={cPickupAddress}
                  onChange={(e) => setCPickupAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid #CBD5E1',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0F172A',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* ACTUAL DETAILED DROPOFF LOCATION */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
                  ACTUAL DETAILED DROPOFF LOCATION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Terminal 2, Ahmedabad Airport (AMD)"
                  value={cDropoffAddress}
                  onChange={(e) => setCDropoffAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid #CBD5E1',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0F172A',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* NUMBER OF DAYS STEPPER CONTROL (LIGHT CLEAN STYLE) */}
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TRIP DURATION
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', fontFamily: 'League Spartan, sans-serif' }}>
                    {cDays} {cDays === 1 ? 'Day Rental' : 'Days Rental'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setCDays(Math.max(1, cDays - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Minus size={18} />
                  </button>

                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', minWidth: '24px', textAlign: 'center', fontFamily: 'League Spartan, sans-serif' }}>
                    {cDays}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCDays(cDays + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#10B981',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* ROUTE SUMMARY BADGE */}
            {isCustomReady && (
              <div style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <CheckCircle size={22} color="#10B981" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#047857', fontFamily: 'League Spartan, sans-serif' }}>
                    {cPickupCity} ➔ {cDropoffCity} ({cDays} Day{cDays > 1 ? 's' : ''})
                  </div>
                  <div style={{ fontSize: '12px', color: '#065F46', fontWeight: '600' }}>
                    Custom itinerary specified. Proceed to select your fleet vehicle & pickup schedule.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BUTTON */}
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
        {mode === 'standard' ? (
          <button 
            style={{
              width: '100%',
              background: isStandardReady 
                ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' 
                : '#E2E8F0',
              color: isStandardReady ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '16px',
              borderRadius: '18px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              cursor: isStandardReady ? 'pointer' : 'not-allowed',
              boxShadow: isStandardReady ? '0 8px 24px rgba(52, 211, 153, 0.4)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={!isStandardReady}
            onClick={handleProceedStandard}
          >
            {isStandardReady ? 'Confirm Route & Schedule Trip →' : 'Select Pickup & Destination'}
          </button>
        ) : (
          <button 
            style={{
              width: '100%',
              background: isCustomReady 
                ? 'linear-gradient(135deg, #34D399 0%, #10B981 100%)' 
                : '#E2E8F0',
              color: isCustomReady ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '16px',
              borderRadius: '18px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              cursor: isCustomReady ? 'pointer' : 'not-allowed',
              boxShadow: isCustomReady ? '0 8px 24px rgba(52, 211, 153, 0.4)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={!isCustomReady}
            onClick={handleProceedCustom}
          >
            {isCustomReady ? 'Continue to Select Fleet Car & Schedule →' : 'Fill Pickup & Dropoff Details'}
          </button>
        )}
      </div>
    </div>
  );
}
