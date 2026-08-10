import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace } from '../../utils/locationCoords';
import BottomNavBar from '../../components/BottomNavBar';
import { getBestLiveLocation, watchLiveLocation, reverseGeocodeCoords } from '../../services/liveLocationService';

export default function HomeScreen({ activeTab, setActiveTab, onStartBooking }) {
  // Load saved profile from localStorage
  const userProfile = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  }, []);

  const userName = userProfile?.name?.split(' ')[0] || 'Rider';
  const userPhoto = userProfile?.photoURL || null;

  // Time-based greeting
  const greeting = React.useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const [customerAddress, setCustomerAddress] = useState('Locating address...');
  const [userCoords, setUserCoords] = useState({ lat: 21.7645, lng: 72.1519 });
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('taxigo_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          setUserCoords({ lat: parsed.lat, lng: parsed.lng });
          if (parsed.address) setCustomerAddress(parsed.address);
        }
      }
    } catch (e) {}
  }, []);

  const updateLocation = (coords, addr) => {
    setUserCoords(coords);
    if (addr) setCustomerAddress(addr);
    try {
      localStorage.setItem('taxigo_user_location', JSON.stringify({ lat: coords.lat, lng: coords.lng, address: addr }));
    } catch (e) {}
  };

  useEffect(() => {
    let watchId = null;

    // Fetch initial high-accuracy location via 3-Method 3-Check engine
    getBestLiveLocation().then(res => {
      if (res) {
        updateLocation({ lat: res.lat, lng: res.lng }, res.address);
        setIsLocating(false);
      }
    });

    // Start real-time watch update
    watchId = watchLiveLocation((updateRes) => {
      if (updateRes) {
        updateLocation({ lat: updateRes.lat, lng: updateRes.lng }, updateRes.address);
        setIsLocating(false);
      }
    });

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load places configured in Admin Portal (cabsy_places)
  const getAdminPlaces = () => {
    try {
      const savedPlaces = localStorage.getItem('cabsy_places');
      if (savedPlaces) {
        const parsed = JSON.parse(savedPlaces);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            name: p,
            ...getCoordsForPlace(p, userCoords)
          }));
        }
      }
    } catch (e) {}

    return [
      { name: 'Bhavnagar Airport (BHU)', lat: 21.7523, lng: 72.1852 },
      { name: 'Takhteshwar Temple, Bhavnagar', lat: 21.7565, lng: 72.1456 },
      { name: 'Alkapuri, Vadodara', lat: 22.3106, lng: 73.1670 },
      { name: 'Ahmedabad Airport (AMD)', lat: 23.0772, lng: 72.6347 },
      { name: 'Mumbai Central, Maharashtra', lat: 19.0760, lng: 72.8777 }
    ];
  };

  const [adminPlacesList, setAdminPlacesList] = useState(getAdminPlaces);

  useEffect(() => {
    setAdminPlacesList(getAdminPlaces());
  }, [isSearchOpen]);

  const filteredLocations = adminPlacesList.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Leaflet Interactive Map */}
          <InteractiveMap
            center={userCoords}
            zoom={15}
            userLabel="Your Live Spot"
            onUserLocationChange={(newCoords) => {
              updateLocation(newCoords, `Pinned Spot (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})`);
            }}
          />

          {/* Floating Top Controls */}
          <div className="map-floating-header">
            <div 
              className="floating-icon-btn" 
              onClick={() => {
                setIsLocating(true);
                getBestLiveLocation().then(res => {
                  if (res) updateLocation({ lat: res.lat, lng: res.lng }, res.address);
                  setIsLocating(false);
                });
              }}
              title="Recenter Map"
              style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}
            >
              🎯
            </div>
            <div style={{ background: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1.5px solid #E2E8F0', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#22C55E' }}>●</span> GPS Live
            </div>
            {userPhoto ? (
              <img className="floating-user-avatar" src={userPhoto} alt="User" />
            ) : (
              <div className="floating-user-avatar" style={{ background: '#F1F5F9', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{userName.charAt(0)}</div>
            )}
          </div>

          {/* Bottom Expandable Trip Sheet */}
          <div className="homescreen-bottom-card">
            <div className="drag-handle-bar" />
            <div style={{ marginBottom: '14px' }}>
              <p className="home-greeting-txt" style={{ margin: 0 }}>{greeting}</p>
              <p style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '2px 0 0 0' }}>
                Welcome back, {userName}
              </p>
            </div>

            {/* Pickup Spot Selector Card */}
            <div 
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              onClick={() => setIsSearchOpen(true)}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                ●
              </div>
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800', letterSpacing: '0.5px' }}>CURRENT PICKUP LOCATION</div>
                <div style={{ fontFamily: 'Space Grotesk', color: '#0F172A', fontSize: '15px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customerAddress}
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#64748B', fontWeight: 'bold' }}>→</span>
            </div>

            {/* Primary Action Button */}
            <button 
              className="taxigo-btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
              onClick={onStartBooking}
            >
              Where do you want to go?
            </button>
          </div>
        </div>
      </div>

      {/* Location Search Modal Overlay */}
      {isSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Select Pickup Location</h2>
              <button onClick={() => setIsSearchOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: '#0F172A' }}>✕</button>
            </div>

            <input 
              type="text" 
              placeholder="Search street, locality or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '14px 16px', borderRadius: '14px', border: '1.5px solid #CBD5E1', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: '600' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '300px' }}>
              {filteredLocations.map((loc, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    updateLocation({ lat: loc.lat, lng: loc.lng }, loc.name);
                    setIsSearchOpen(false);
                  }}
                  style={{ padding: '14px 16px', borderRadius: '14px', background: '#F8FAFC', cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{loc.name}</span>
                  <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '800' }}>Select →</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setIsSearchOpen(false); onStartBooking(); }}
              style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: '#FFFFFF', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '6px', boxShadow: '0 8px 24px rgba(52, 211, 153, 0.4)' }}
            >
              Confirm Location & Continue →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
