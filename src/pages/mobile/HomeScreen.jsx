import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { Geolocation } from '@capacitor/geolocation';

export default function HomeScreen({ activeTab, setActiveTab, onStartBooking }) {
  // Load saved Google profile from localStorage
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
  // Initial coords state set to Bhavnagar, Gujarat
  const [userCoords, setUserCoords] = useState({ lat: 21.7645, lng: 72.1519 }); // Bhavnagar Center

  const nearbyTaxis = [];

  const hasRealGpsRef = React.useRef(false);

  // Restore saved location if present
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

    // Automatic Permission Popup Request (Allow / Deny System Prompt)
    const requestLocationPermission = async () => {
      try {
        // Trigger Capacitor Native OS Permission Dialog (Allow / Deny)
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
      } catch (err) {
        console.warn("Native location request notice:", err);
      }

      // Fallback for HTML5 / Safari Browser Native Permission Bar
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            hasRealGpsRef.current = true;
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            updateLocation({ lat, lng }, `Live Phone GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          },
          (err) => {
            console.warn("Browser GPS permission notice:", err);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
      return false;
    };

    requestLocationPermission().then(success => {
      if (!success && !hasRealGpsRef.current) {
        // Backup IP Geolocation ONLY if hardware GPS was denied or delayed
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

    // Continuously stream high-precision hardware GPS updates
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          hasRealGpsRef.current = true;
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateLocation({ lat, lng }, `Live Phone GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        },
        (err) => {
          console.warn("Hardware GPS streaming notice:", err);
        },
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

  const searchLocations = [
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
    { name: '📍 Mumbai Central, Maharashtra', lat: 19.0760, lng: 72.8777 },
    { name: '📍 Connaught Place, New Delhi', lat: 28.6139, lng: 77.2090 },
    { name: '📍 MG Road, Bengaluru', lat: 12.9716, lng: 77.5946 },
  ];

  const filteredLocations = searchLocations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        {/* Google Map Viewport */}
        <div className="live-map-viewport" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Interactive Google Maps Leaflet Engine */}
          <InteractiveMap
            center={userCoords}
            zoom={15}
            userLabel="Your Live Location (Drag pin to move!)"
            nearbyTaxis={nearbyTaxis}
            onUserLocationChange={(newCoords) => {
              updateLocation(newCoords, `Pinned Spot (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})`);
            }}
          />

          {/* Floating Top Nav Controls */}
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
            <div style={{ background: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'League Spartan', fontSize: '13px', fontWeight: '700', color: '#212B46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#22C55E' }}>●</span> GPS Active
            </div>
            {userPhoto ? (
              <img className="floating-user-avatar" src={userPhoto} alt="User" style={{ borderRadius: '50%', border: '2px solid #FFAA01' }} />
            ) : (
              <div className="floating-user-avatar" style={{ background: 'linear-gradient(135deg, #212B46 0%, #1A2238 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#FFAA01', borderRadius: '50%', border: '2px solid #FFAA01' }}>👤</div>
            )}
          </div>

          {/* Bottom Expandable Trip Card */}
          <div className="homescreen-bottom-card">
            <div className="drag-handle-bar" />
            <div style={{ marginBottom: '12px' }}>
              <p className="home-greeting-txt" style={{ margin: 0 }}>{greeting}</p>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '600', color: '#67696B', margin: '2px 0 0 0' }}>Welcome back, <strong style={{ color: '#212B46' }}>{userName}</strong> 🚀</p>
            </div>

            {/* Pickup / Dropoff Box with Customer Address */}
            <div 
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              onClick={() => setIsSearchOpen(true)}
            >
              <span style={{ fontSize: '20px' }}>📍</span>
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '12px', color: '#22C55E', fontWeight: '700' }}>CURRENT PICKUP</div>
                <div style={{ fontFamily: 'Space Grotesk', color: '#212B46', fontSize: '15px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {customerAddress}
                </div>
              </div>
              <span style={{ fontSize: '18px', color: '#67696B' }}>›</span>
            </div>

            {/* Primary Action Button */}
            <button 
              className="taxigo-btn-primary" 
              style={{ width: '100%', marginTop: '8px', padding: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
              onClick={onStartBooking}
            >
              <span>🚘</span> Request Ride Now
            </button>
          </div>
        </div>
      </div>

      {/* Location Search Modal Overlay */}
      {isSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ background: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#212B46', margin: 0 }}>📍 Select Pickup Location</h2>
              <button onClick={() => setIsSearchOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: '#212B46' }}>✕</button>
            </div>

            <input 
              type="text" 
              placeholder="Search street, locality or city (e.g. Alkapuri)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '2px solid #E2E8F0', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#F8FAFC' }}
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
                  style={{ padding: '12px 14px', borderRadius: '12px', background: '#F8FAFC', cursor: 'pointer', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: '600', color: '#212B46', fontSize: '14px' }}>{loc.name}</span>
                  <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '700' }}>Select ›</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setIsSearchOpen(false); onStartBooking(); }}
              style={{ background: '#212B46', color: '#FFAA01', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '6px' }}
            >
              Confirm Location & Proceed to Booking 🚕
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
          <span className="nav-tab-icon">🚗</span>
          <span>My Rides</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <span className="nav-tab-icon">👛</span>
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
