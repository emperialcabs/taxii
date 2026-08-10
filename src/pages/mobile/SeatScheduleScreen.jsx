import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function SeatScheduleScreen({ 
  userCoords,
  pickupLoc,
  dropoffLoc,
  tripType = 'one-way',
  setTripType,
  scheduledDate, 
  setScheduledDate, 
  scheduledTime, 
  setScheduledTime,
  returnDate,
  setReturnDate,
  onNext, 
  onBack 
}) {
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

  // Compute distance from Admin destinations
  const getRouteDistanceKm = () => {
    try {
      const savedDest = localStorage.getItem('cabsy_destinations') || localStorage.getItem('cabsy_routes');
      if (savedDest) {
        const parsedD = JSON.parse(savedDest);
        if (Array.isArray(parsedD) && parsedD.length > 0) {
          const matched = parsedD.find(r => 
            (pickupLoc && r.pickup && (r.pickup.toLowerCase().includes(pickupLoc.toLowerCase()) || pickupLoc.toLowerCase().includes(r.pickup.toLowerCase()))) &&
            (dropoffLoc && r.dropoff && (r.dropoff.toLowerCase().includes(dropoffLoc.toLowerCase()) || dropoffLoc.toLowerCase().includes(r.dropoff.toLowerCase())))
          );
          if (matched && matched.distanceKm) return Number(matched.distanceKm);
        }
      }
    } catch (e) {}
    return 154;
  };

  const baseDistance = getRouteDistanceKm();
  const effectiveDistance = tripType === 'round-trip' ? baseDistance * 2 : baseDistance;

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={13}
            userLabel={pickupLoc || "Pickup Point"}
            destination={destPos}
            routePolyline={routePolyline}
          />

          {/* Bottom Card for Trip Type & Schedule */}
          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button 
                onClick={onBack}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px',
                  color: '#0F172A'
                }}
              >
                <span>←</span> Back
              </button>
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(217,119,6,0.1)' }}>
                <span>●</span> {tripType === 'round-trip' ? `${effectiveDistance} KM (${baseDistance} KM × 2)` : `${baseDistance} KM`}
              </div>
            </div>

            {/* 1. TRIP TYPE SELECTOR (ONE-WAY VS ROUND TRIP) */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              SELECT TRIP TYPE
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setTripType('one-way')}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  border: tripType === 'one-way' ? '2px solid #FFAA01' : '1.5px solid #E2E8F0',
                  background: tripType === 'one-way' ? '#FFFBEB' : '#FFFFFF',
                  color: tripType === 'one-way' ? '#0F172A' : '#64748B',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: tripType === 'one-way' ? '0 4px 14px rgba(255,170,1,0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>One-Way Trip</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#22C55E' }}>{baseDistance} KM</span>
              </button>

              <button
                type="button"
                onClick={() => setTripType('round-trip')}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  border: tripType === 'round-trip' ? '2px solid #FFAA01' : '1.5px solid #E2E8F0',
                  background: tripType === 'round-trip' ? '#FFFBEB' : '#FFFFFF',
                  color: tripType === 'round-trip' ? '#0F172A' : '#64748B',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: tripType === 'round-trip' ? '0 4px 14px rgba(255,170,1,0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Round Trip (Return)</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#D97706' }}>{baseDistance * 2} KM (2×)</span>
              </button>
            </div>

            {/* 2. SCHEDULE DATE & TIME */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              SCHEDULE PICKUP DATE & TIME
            </p>

            <div className="schedule-inputs-row" style={{ marginBottom: tripType === 'round-trip' ? '12px' : '20px' }}>
              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                >
                  <option value="Today, 10 Aug 2026">Today, 10 Aug 2026</option>
                  <option value="Tomorrow, 11 Aug 2026">Tomorrow, 11 Aug 2026</option>
                  <option value="Wed, 12 Aug 2026">Wed, 12 Aug 2026</option>
                  <option value="Thu, 13 Aug 2026">Thu, 13 Aug 2026</option>
                  <option value="Fri, 14 Aug 2026">Fri, 14 Aug 2026</option>
                  <option value="Sat, 15 Aug 2026">Sat, 15 Aug 2026</option>
                </select>
              </div>

              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={scheduledTime} 
                  onChange={(e) => setScheduledTime(e.target.value)} 
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                >
                  {[
                    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
                    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
                  ].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Return Date if Round Trip */}
            {tripType === 'round-trip' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                  RETURN DATE (OPTIONAL)
                </label>
                <div className="schedule-input-box">
                  <select 
                    value={returnDate || 'Tomorrow, 11 Aug 2026'} 
                    onChange={(e) => setReturnDate && setReturnDate(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                  >
                    <option value="Tomorrow, 11 Aug 2026">Tomorrow, 11 Aug 2026</option>
                    <option value="Wed, 12 Aug 2026">Wed, 12 Aug 2026</option>
                    <option value="Thu, 13 Aug 2026">Thu, 13 Aug 2026</option>
                    <option value="Fri, 14 Aug 2026">Fri, 14 Aug 2026</option>
                    <option value="Sat, 15 Aug 2026">Sat, 15 Aug 2026</option>
                  </select>
                </div>
              </div>
            )}

            <button className="taxigo-btn-primary" onClick={onNext}>
              Continue to Choose Car ({effectiveDistance} KM) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
