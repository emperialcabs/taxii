import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline, calculateDistanceKm, estimateEtaMins } from '../../utils/locationCoords';
import BottomNavBar from '../../components/BottomNavBar';
import { getBestLiveLocation, watchLiveLocation, reverseGeocodeCoords } from '../../services/liveLocationService';
import { db } from '../../services/dbService';
import { getCustomerNotifications } from '../../services/notificationEngine';
import { RotateCcw, User, Bell, CheckCircle2, XCircle, Clock3, Gift, MapPin, ArrowRight, X } from 'lucide-react';

export default function HomeScreen({ activeTab, setActiveTab, onStartBooking, onOpenTracking }) {
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

  // Active Ride Live Sync
  const [activeRide, setActiveRide] = useState(null);
  useEffect(() => {
    const checkActiveRide = () => {
      try {
        const saved = localStorage.getItem('cabsy_inquiries');
        if (saved) {
          const list = JSON.parse(saved);
          const current = list.find(i => i.status === 'Confirmed' || i.status === 'In Progress' || i.status === 'On Ride');
          if (current) {
            setActiveRide(current);
            return;
          }
        }
      } catch (e) {}
      setActiveRide(null);
    };

    checkActiveRide();
    window.addEventListener('storage', checkActiveRide);
    window.addEventListener('taxigo_trip_started', checkActiveRide);
    return () => {
      window.removeEventListener('storage', checkActiveRide);
      window.removeEventListener('taxigo_trip_started', checkActiveRide);
    };
  }, []);

  const activePickupPos = activeRide ? getCoordsForPlace(activeRide.pickup || activeRide.pickupLoc, userCoords) : null;
  const activeDestPos = activeRide ? getCoordsForPlace(activeRide.dropoff || activeRide.dropoffLoc, userCoords) : null;
  const activePolyline = (activePickupPos && activeDestPos) ? generateRoutePolyline(activePickupPos, activeDestPos) : [];

  // Live GPS Distance & ETA Calculation on Home Screen Map
  const currentLivePos = userCoords || activePickupPos || { lat: 21.7645, lng: 72.1519 };
  const realDistKmNum = (activeDestPos && currentLivePos) ? calculateDistanceKm(currentLivePos.lat, currentLivePos.lng, activeDestPos.lat, activeDestPos.lng) : 0;
  const displayDistKm = realDistKmNum > 0 ? realDistKmNum.toFixed(1) : "0.0";
  const totalMinsLeft = Math.max(1, estimateEtaMins(realDistKmNum));
  const hoursLeft = Math.floor(totalMinsLeft / 60);
  const minsLeft = totalMinsLeft % 60;
  const etaTimeStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;
  const arrivalDate = new Date(Date.now() + totalMinsLeft * 60000);
  const arrivalTimeFormatted = arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const handleExitRide = () => {
    try {
      const saved = localStorage.getItem('cabsy_inquiries');
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.map(i => {
          if (i.status === 'Confirmed' || i.status === 'In Progress' || i.status === 'On Ride') {
            return { ...i, status: 'Completed' };
          }
          return i;
        });
        localStorage.setItem('cabsy_inquiries', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('taxigo_trip_started'));
      }
    } catch (e) {}
    setActiveRide(null);
  };

  // Notification Modal State & Live Updates
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userNotifs, setUserNotifs] = useState([]);

  useEffect(() => {
    const loadNotifs = () => {
      const notifs = [];

      // 1. Direct Push Notifications from Admin / Engine
      const directNotifs = getCustomerNotifications(userProfile?.phone, userProfile?.email);
      if (directNotifs && directNotifs.length > 0) {
        directNotifs.forEach(dn => {
          let icon = '🔔';
          if (dn.type === 'reward') icon = '🎁';
          else if (dn.type === 'trip_started') icon = '▶';
          else if (dn.type === 'trip_completed') icon = '🏁';
          else if (dn.type === 'confirmed') icon = '✅';
          else if (dn.type === 'cancelled') icon = '❌';

          notifs.push({
            id: dn.id,
            type: dn.type || 'inquiry',
            icon,
            title: dn.title,
            desc: dn.desc || dn.body,
            time: dn.time || 'Just now',
            read: dn.read || false
          });
        });
      }

      try {
        const inquiries = db.getInquiries();
        const userInquiries = inquiries.filter(i => 
          (userProfile?.phone && i.customerPhone === userProfile.phone) ||
          (userProfile?.email && i.customerEmail === userProfile.email) ||
          (userProfile?.name && i.customerName?.toLowerCase() === userProfile.name?.toLowerCase())
        );

        if (userInquiries.length > 0) {
          userInquiries.forEach(inq => {
            if (inq.status === 'Confirmed' && !notifs.some(n => n.id === `inq-conf-${inq.id}`)) {
              notifs.push({
                id: `inq-conf-${inq.id}`,
                type: 'inquiry',
                icon: '🎉',
                title: `Booking Confirmed (${inq.id})`,
                desc: `Your trip from ${inq.pickup} to ${inq.dropoff} is confirmed! Driver: ${inq.driver || 'Assigned'}`,
                time: inq.date || 'Today',
                read: false
              });
            } else if (inq.status === 'Pending' && !notifs.some(n => n.id === `inq-pend-${inq.id}`)) {
              notifs.push({
                id: `inq-pend-${inq.id}`,
                type: 'inquiry',
                icon: '⏳',
                title: `Ride Inquiry Pending (${inq.id})`,
                desc: `Inquiry for ${inq.vehicle} (₹${inq.fare}) is under review by Empire Cab dispatchers.`,
                time: inq.date || 'Just now',
                read: false
              });
            }
          });
        }
      } catch (e) {}

      notifs.push({
        id: 'sys-gps',
        type: 'system',
        icon: '📍',
        title: 'GPS Live Location Active',
        desc: `Current pickup spot set near ${customerAddress}`,
        time: 'Active Now',
        read: true
      });

      setUserNotifs(notifs);
    };

    loadNotifs();

    window.addEventListener('storage', loadNotifs);
    window.addEventListener('taxigo_ride_booked', loadNotifs);
    window.addEventListener('taxigo_customer_notif', loadNotifs);
    return () => {
      window.removeEventListener('storage', loadNotifs);
      window.removeEventListener('taxigo_ride_booked', loadNotifs);
      window.removeEventListener('taxigo_customer_notif', loadNotifs);
    };
  }, [customerAddress, userProfile]);

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
            center={activePickupPos || userCoords}
            zoom={activeRide ? 11 : 15}
            userLabel={activeRide ? (activeRide.pickup || "Pickup Point") : "Your Live Spot"}
            destination={activeDestPos}
            activeDriverPos={activePickupPos}
            routePolyline={activePolyline}
            onUserLocationChange={(newCoords) => {
              updateLocation(newCoords, `Pinned Spot (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})`);
            }}
          />

          {/* Floating Top Controls */}
          <div className="map-floating-header">
            {/* Left Control: Profile Button */}
            <div 
              className="floating-icon-btn" 
              onClick={() => setActiveTab && setActiveTab('account')}
              title="My Account Profile"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                padding: '6px 14px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                width: 'auto'
              }}
            >
              {userPhoto ? (
                <img src={userPhoto} alt="User" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <User size={16} color="#0F172A" />
              )}
              <span style={{ fontFamily: 'Space Grotesk' }}>Profile</span>
            </div>

            {/* Center Control: Live GPS Indicator */}
            <div style={{ background: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', border: '1.5px solid #E2E8F0', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#22C55E' }}>●</span> GPS Live
            </div>

            {/* Right Control: Notification Bell Button */}
            <div 
              className="floating-icon-btn" 
              onClick={() => {
                setIsNotifOpen(true);
                // Mark all as read when opened
                setUserNotifs(prev => prev.map(n => ({ ...n, read: true })));
              }}
              title="Notifications & Updates"
              style={{
                position: 'relative',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
              }}
            >
              <Bell size={18} color="#0F172A" />
              {userNotifs.filter(n => !n.read).length > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#EF4444', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
                  {userNotifs.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Expandable Trip Sheet */}
          <div className="homescreen-bottom-card">
            <div className="drag-handle-bar" />

            {/* ACTIVE RIDE LIVE CARD ON HOMESCREEN (Light Theme, No Buttons) */}
            {activeRide && (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '16px 20px',
                  color: '#0F172A',
                  marginBottom: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#16A34A', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                    {etaTimeStr}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '13px', fontWeight: '700', marginTop: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {displayDistKm} km • {arrivalTimeFormatted}
                  </div>
                </div>

                <div style={{ background: '#F1F5F9', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk, sans-serif', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#22C55E' }}>●</span> Live Ride
                </div>
              </div>
            )}

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

      {/* Notifications & Live Updates Modal Overlay */}
      {isNotifOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', padding: '24px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>🔔</span>
                <h2 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Notifications & Live Updates
                </h2>
              </div>
              <button onClick={() => setIsNotifOpen(false)} style={{ background: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: '#0F172A', fontWeight: 'bold' }}>✕</button>
            </div>

            {/* Notification List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
              {userNotifs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                  <p style={{ fontWeight: '700', margin: 0 }}>No new notifications</p>
                  <small>All ride updates and announcements will appear here.</small>
                </div>
              ) : (
                userNotifs.map((notif, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      background: notif.type === 'inquiry' ? '#F0FDF4' : '#F8FAFC',
                      border: `1.5px solid ${notif.type === 'inquiry' ? '#BBF7D0' : '#E2E8F0'}`,
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginTop: '2px' }}>{notif.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <strong style={{ fontFamily: 'Space Grotesk', fontSize: '15px', color: '#0F172A' }}>{notif.title}</strong>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>{notif.time}</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>{notif.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setIsNotifOpen(false)}
              style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '4px', boxShadow: '0 6px 20px rgba(52, 211, 153, 0.35)' }}
            >
              Close Updates
            </button>
          </div>
        </div>
      )}

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
