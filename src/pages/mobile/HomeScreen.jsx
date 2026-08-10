import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { Geolocation } from '@capacitor/geolocation';
import { getCoordsForPlace } from '../../utils/locationCoords';

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
    if (h < 12) return 'Good Morning ☀️';
    if (h < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  }, []);

  const [customerAddress, setCustomerAddress] = useState('Bhavnagar, Gujarat');
  const [userCoords, setUserCoords] = useState({ lat: 21.7645, lng: 72.1519 });
  const hasRealGpsRef = React.useRef(false);

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

    const requestLocationPermission = async () => {
      try {
        if (Geolocation && typeof Geolocation.requestPermissions === 'function') {
          await Geolocation.requestPermissions();
        }
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
        if (position && position.coords) {
          hasRealGpsRef.current = true;
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocation({ lat, lng }, `Live Phone GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          return true;
        }
      } catch (err) {}

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            hasRealGpsRef.current = true;
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            updateLocation({ lat, lng }, `Live Phone GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
      return false;
    };

    requestLocationPermission().then(success => {
      if (!success && !hasRealGpsRef.current) {
        fetch('http://ip-api.com/json')
          .then(res => res.json())
          .then(data => {
            if (!hasRealGpsRef.current && data && typeof data.lat === 'number' && typeof data.lon === 'number') {
              updateLocation({ lat: data.lat, lng: data.lon }, `${data.city || 'Current City'}, ${data.regionName || ''}`);
            }
          })
          .catch(() => {});
      }
    });

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          hasRealGpsRef.current = true;
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateLocation({ lat, lng }, `Live Phone GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load places configured in Admin Panel (cabsy_places in localStorage)
  const getAdminPlaces = () => {
    try {
      const saved = localStorage.getItem('cabsy_places');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => {
            const nameStr = typeof p === 'string' ? p : (p.name || p.title || p.location);
            const coords = getCoordsForPlace(nameStr, userCoords);
            return {
              name: `📍 ${nameStr}`,
              lat: coords.lat,
              lng: coords.lng
            };
          });
        }
      }
    } catch (e) {}

    // Default Fallback Places
    return [
      { name: '📍 Bhavnagar City Center, Gujarat', lat: 21.7645, lng: 72.1519 },
      { name: '📍 Waghawadi Road, Bhavnagar', lat: 21.7580, lng: 72.1460 },
      { name: '📍 Ghogha Circle, Bhavnagar', lat: 21.7610, lng: 72.1480 },
      { name: '📍 Kalanala, Bhavnagar', lat: 21.7690, lng: 72.1500 },
      { name: '📍 Chitra GIDC, Bhavnagar', lat: 21.7810, lng: 72.1280 },
      { name: '📍 Subhashnagar, Bhavnagar', lat: 21.7450, lng: 72.1620 },
      { name: '📍 Victoria Park, Bhavnagar', lat: 21.7430, lng: 72.1380 },
      { name: '📍 Bhavnagar Railway Station', lat: 21.7702, lng: 72.1444 },
      { name: '📍 Bhavnagar Airport (BHU)', lat: 21.7523, lng: 72.1852 },
      { name: '📍 Takhteshwar Temple, Bhavnagar', lat: 21.7565, lng: 72.1456 },
      { name: '📍 Alkapuri, Vadodara', lat: 22.3106, lng: 73.1670 },
      { name: '📍 Ahmedabad Airport (AMD)', lat: 23.0772, lng: 72.6347 },
      { name: '📍 Mumbai Central, Maharashtra', lat: 19.0760, lng: 72.8777 }
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
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    hasRealGpsRef.current = true;
                    updateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }, `Live GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
                  });
                }
              }}
              title="Recenter Map"
            >
              🎯
            </div>
            <div style={{ background: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1.5px solid #E2E8F0', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#22C55E' }}>●</span> GPS Live
            </div>
            {userPhoto ? (
              <img className="floating-user-avatar" src={userPhoto} alt="User" />
            ) : (
              <div className="floating-user-avatar" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#FFAA01' }}>👤</div>
            )}
          </div>

          {/* Bottom Expandable Trip Sheet */}
          <div className="homescreen-bottom-card">
            <div className="drag-handle-bar" />
            <div style={{ marginBottom: '14px' }}>
              <p className="home-greeting-txt" style={{ margin: 0 }}>{greeting}</p>
              <p style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#1E293B', margin: '2px 0 0 0' }}>
                Welcome back, {userName} ✨
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
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                📍
              </div>
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800', letterSpacing: '0.5px' }}>CURRENT PICKUP LOCATION</div>
                <div style={{ fontFamily: 'Space Grotesk', color: '#1E293B', fontSize: '15px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
              <span>🚕</span> Where do you want to go?
            </button>
          </div>
        </div>
      </div>

      {/* Location Search Modal Overlay */}
      {isSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#1E293B', margin: 0 }}>📍 Select Pickup Location</h2>
              <button onClick={() => setIsSearchOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: '#1E293B' }}>✕</button>
            </div>

            <input 
              type="text" 
              placeholder="Search street, locality or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#F8FAFC' }}
              autoFocus
            />

            <div style={{ overflowY: 'auto', maxHeight: '45vh', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredLocations.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    updateLocation({ lat: loc.lat, lng: loc.lng }, loc.name.replace('📍 ', ''));
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  style={{ padding: '14px 16px', borderRadius: '14px', background: '#F8FAFC', cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: '700', color: '#1E293B', fontSize: '14px' }}>{loc.name}</span>
                  <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '800' }}>Select →</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setIsSearchOpen(false); onStartBooking(); }}
              style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFAA01', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '6px' }}
            >
              Confirm Location & Continue →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <div className="taxigo-bottom-nav">
        <button className={`nav-tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="nav-tab-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'rides' ? 'active' : ''}`} onClick={() => setActiveTab('rides')}>
          <span className="nav-tab-icon">🚘</span>
          <span>My Rides</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <span className="nav-tab-icon">💳</span>
          <span>Wallet</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
          <span className="nav-tab-icon">👤</span>
          <span>Account</span>
        </button>
      </div>
    </div>
  );
}
