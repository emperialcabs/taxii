import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';
import { Compass, Search, Volume2, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';

export default function TripTrackingScreen({ userCoords, pickupLoc, dropoffLoc, onCompleteRide }) {
  const [activeRide, setActiveRide] = useState(null);
  const [soundMuted, setSoundMuted] = useState(false);

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

  const rawPickup = activeRide?.pickup || pickupLoc || "Bhavnagar, Gujarat";
  const rawDropoff = activeRide?.dropoff || dropoffLoc || "Ahmedabad Airport (AMD)";

  const actualPickup = typeof rawPickup === 'object' ? (rawPickup.label || rawPickup.name || "Bhavnagar, Gujarat") : String(rawPickup || "Bhavnagar, Gujarat");
  const actualDropoff = typeof rawDropoff === 'object' ? (rawDropoff.label || rawDropoff.name || "Ahmedabad Airport (AMD)") : String(rawDropoff || "Ahmedabad Airport (AMD)");
  const driverName = activeRide?.driver || "Ramesh Patel";
  const fareAmt = activeRide?.fare || 770;

  const pickupPos = getCoordsForPlace(actualPickup, userCoords);
  const destPos = getCoordsForPlace(actualDropoff, userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos) || [];

  const [driverStep, setDriverStep] = useState(1);
  useEffect(() => {
    if (!routePolyline || routePolyline.length === 0) return;
    const interval = setInterval(() => {
      setDriverStep((prev) => (prev < routePolyline.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [routePolyline.length]);

  const currentDriverPos = (routePolyline && routePolyline[driverStep]) || pickupPos || { lat: 21.7645, lng: 72.1519 };
  const totalSteps = Math.max(1, routePolyline.length);
  const remainingSteps = totalSteps - driverStep;
  const remainingDistKm = (remainingSteps * 5.2).toFixed(0); // e.g. 164 km
  const hoursLeft = Math.floor(remainingSteps * 0.15);
  const minsLeft = Math.max(12, Math.round((remainingSteps * 0.15 - hoursLeft) * 60));
  const etaTimeStr = `${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft}m`;
  
  // Arrival clock calculation
  const arrivalDate = new Date(Date.now() + (hoursLeft * 60 + minsLeft) * 60000);
  const arrivalTimeFormatted = arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const dropoffShortText = typeof actualDropoff === 'string' ? actualDropoff.split(',')[0] : 'Destination';

  return (
    <div className="real-mobile-app" style={{ background: '#0F172A', position: 'relative', width: '100%', height: '100vh', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 1. TOP TURN-BY-TURN GUIDANCE BANNER */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 999,
        background: '#044e42',
        borderRadius: '20px',
        padding: '16px 20px',
        color: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>
            ↑
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', fontFamily: 'League Spartan, sans-serif', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              Highway NH-47
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: '10px', marginTop: '6px', fontSize: '13px', fontWeight: '700' }}>
              Then ↱ {dropoffShortText}
            </div>
          </div>
        </div>

        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <Sparkles size={22} style={{ color: '#2563EB' }} />
        </div>
      </div>

      {/* 2. MAIN MAP VIEWPORT */}
      <div className="full-homescreen-map-wrapper" style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
        <InteractiveMap
          center={currentDriverPos}
          zoom={12}
          userLabel={actualPickup}
          destination={destPos}
          activeDriverPos={currentDriverPos}
          routePolyline={routePolyline}
        />
      </div>

      {/* 3. RIGHT FLOATING MAP CONTROL TOOLS */}
      <div style={{
        position: 'absolute',
        right: '16px',
        top: '120px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button style={floatingBtnStyle} title="Compass">
          <Compass size={22} color="#FFFFFF" />
        </button>
        <button style={floatingBtnStyle} title="Search Route">
          <Search size={22} color="#FFFFFF" />
        </button>
        <button style={floatingBtnStyle} onClick={() => setSoundMuted(!soundMuted)} title="Mute Guidance">
          <Volume2 size={22} color={soundMuted ? '#EF4444' : '#FFFFFF'} />
        </button>
        <button style={floatingBtnStyle} title="Report Traffic Hazard">
          <ShieldAlert size={22} color="#F59E0B" />
        </button>
      </div>

      {/* 4. FLOATING BOTTOM-LEFT RE-CENTRE BUTTON */}
      <div style={{ position: 'absolute', left: '16px', bottom: '110px', zIndex: 999 }}>
        <button style={{
          background: '#1E293B',
          color: '#FFFFFF',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '24px',
          fontWeight: '800',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          cursor: 'pointer'
        }}>
          ▲ Re-centre
        </button>
      </div>

      {/* 5. BOTTOM NAVIGATION STATUS CARD */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: '#121827',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '16px 20px 24px 20px',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
        color: '#FFFFFF'
      }}>
        <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '4px', margin: '0 auto 14px auto' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#22C55E', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
              {etaTimeStr} <span style={{ fontSize: '18px', color: '#22C55E' }}>🌱</span>
            </div>
            <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '700', marginTop: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>
              {remainingDistKm} km • {arrivalTimeFormatted}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#1E293B',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <RotateCcw size={22} color="#FFFFFF" />
            </button>

            <button 
              onClick={onCompleteRide}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '24px',
                fontWeight: '900',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
              }}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const floatingBtnStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  background: '#1E293B',
  border: '1px solid #334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  cursor: 'pointer'
};
