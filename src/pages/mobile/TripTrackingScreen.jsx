import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import BottomNavBar from '../../components/BottomNavBar';
import { getCoordsForPlace, generateRoutePolyline, calculateDistanceKm } from '../../utils/locationCoords';
import { RotateCcw } from 'lucide-react';

export default function TripTrackingScreen({ userCoords, pickupLoc, dropoffLoc, activeTab, setActiveTab, onNavigateTab, onCompleteRide }) {
  const [activeRide, setActiveRide] = useState(null);
  const [liveGpsCoords, setLiveGpsCoords] = useState(null);

  // 1. Sync Active Ride Data from localStorage / Admin Portal Events
  useEffect(() => {
    const syncRide = () => {
      try {
        const saved = localStorage.getItem('cabsy_inquiries');
        if (saved) {
          const list = JSON.parse(saved);
          const current = list.find(i => i.status === 'Confirmed' || i.status === 'In Progress' || i.status === 'On Ride');
          if (current) setActiveRide(current);
        }
      } catch (e) {}
    };
    syncRide();
    window.addEventListener('storage', syncRide);
    window.addEventListener('taxigo_trip_started', syncRide);
    return () => {
      window.removeEventListener('storage', syncRide);
      window.removeEventListener('taxigo_trip_started', syncRide);
    };
  }, []);

  // 2. Watch Real Device GPS Location Live in Real-Time
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos && pos.coords) {
          setLiveGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        }
      },
      (err) => {
        console.warn("GPS watch position notice:", err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );
    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const rawPickup = activeRide?.pickup || pickupLoc || "Bhavnagar, Gujarat";
  const rawDropoff = activeRide?.dropoff || dropoffLoc || "Ahmedabad Airport (AMD)";

  const actualPickup = typeof rawPickup === 'object' ? (rawPickup.label || rawPickup.name || "Bhavnagar, Gujarat") : String(rawPickup || "Bhavnagar, Gujarat");
  const actualDropoff = typeof rawDropoff === 'object' ? (rawDropoff.label || rawDropoff.name || "Ahmedabad Airport (AMD)") : String(rawDropoff || "Ahmedabad Airport (AMD)");

  const pickupPos = getCoordsForPlace(actualPickup, userCoords);
  const destPos = getCoordsForPlace(actualDropoff, userCoords);

  // Current live driver/user position: uses device GPS if available, else userCoords or pickupPos
  const currentLivePos = liveGpsCoords || userCoords || pickupPos || { lat: 21.7645, lng: 72.1519 };

  const routePolyline = generateRoutePolyline(currentLivePos, destPos) || [];

  // Real-time Live Distance & ETA calculation to Destination
  const realDistKmNum = calculateDistanceKm(currentLivePos.lat, currentLivePos.lng, destPos.lat, destPos.lng);
  const displayDistKm = realDistKmNum > 0 ? realDistKmNum.toFixed(1) : "0.0";
  
  const totalMinsLeft = Math.max(1, Math.round(realDistKmNum * 1.5));
  const hoursLeft = Math.floor(totalMinsLeft / 60);
  const minsLeft = totalMinsLeft % 60;
  const etaTimeStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;

  // Arrival clock calculation based on live distance
  const arrivalDate = new Date(Date.now() + totalMinsLeft * 60000);
  const arrivalTimeFormatted = arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const [mapCenter, setMapCenter] = useState(currentLivePos);
  useEffect(() => {
    setMapCenter(currentLivePos);
  }, [currentLivePos.lat, currentLivePos.lng]);

  return (
    <div className="real-mobile-app" style={{ background: '#0F172A', position: 'relative', width: '100%', height: '100vh', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* 1. MAIN MAP VIEWPORT */}
      <div className="full-homescreen-map-wrapper" style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
        <InteractiveMap
          center={mapCenter}
          zoom={13}
          userLabel={actualPickup}
          destination={destPos}
          activeDriverPos={currentLivePos}
          routePolyline={routePolyline}
        />
      </div>

      {/* 2. FLOATING RE-CENTRE BUTTON */}
      <div style={{ position: 'absolute', left: '16px', bottom: '160px', zIndex: 999 }}>
        <button 
          onClick={() => setMapCenter(currentLivePos)}
          style={{
            background: '#1E293B',
            color: '#FFFFFF',
            border: '1px solid #334155',
            padding: '10px 18px',
            borderRadius: '24px',
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            cursor: 'pointer'
          }}
        >
          ▲ Re-centre Live
        </button>
      </div>

      {/* 3. BOTTOM NAVIGATION STATUS CARD */}
      <div style={{
        position: 'absolute',
        bottom: '64px',
        left: 0,
        right: 0,
        zIndex: 999,
        background: '#121827',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '14px 20px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
        color: '#FFFFFF'
      }}>
        <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '4px', margin: '0 auto 10px auto' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#22C55E', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
              {etaTimeStr}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '700', marginTop: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
              {displayDistKm} km • {arrivalTimeFormatted}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setMapCenter(currentLivePos)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#1E293B',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Recentre Map"
            >
              <RotateCcw size={20} color="#FFFFFF" />
            </button>

            <button 
              onClick={onCompleteRide}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '24px',
                fontWeight: '900',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM NAVIGATION TOOLBAR */}
      <BottomNavBar 
        activeTab={activeTab || 'rides'} 
        setActiveTab={(tab) => {
          if (onNavigateTab) {
            onNavigateTab(tab);
          } else if (setActiveTab) {
            setActiveTab(tab);
          }
        }} 
      />
    </div>
  );
}
