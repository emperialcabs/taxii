import React, { useState } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';
import { INITIAL_VEHICLES } from '../AdminPortal';

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
  selectedCar,
  setSelectedCar,
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

  // Load configured vehicles from Admin Portal (Zero demo/hardcoded fallback cars)
  const getFleetVehicles = () => {
    let rawList = [];
    try {
      const savedV = localStorage.getItem('cabsy_vehicles');
      if (savedV) {
        const parsed = JSON.parse(savedV);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawList = parsed;
        }
      }
    } catch (e) {}

    if (rawList.length === 0) {
      rawList = INITIAL_VEHICLES;
    }

    return rawList
      .filter(v => (v.status || 'Active').toLowerCase() === 'active')
      .map((v, idx) => {
        const r = Number(v.ratePerKm || v.pricePerKm || v.rate) || 5;
        const fare = Math.round(r * effectiveDistance);
        return {
          id: v.id || `CAR-${101 + idx}`,
          name: v.name,
          type: v.passengers || v.type || '4 Persons',
          ratePerKm: r,
          totalFareNum: fare,
          price: `₹${fare.toLocaleString('en-IN')}`,
          tag: v.status || 'Active'
        };
      });
  };

  const fleet = getFleetVehicles();
  const [currentCarId, setCurrentCarId] = useState(selectedCar || fleet[0]?.id);
  const activeCarObj = fleet.find(c => c.id === currentCarId) || fleet[0];

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

          {/* Bottom Card for Trip Type, Schedule & Vehicle Selection */}
          <div className="homescreen-bottom-card" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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
              <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(16,185,129,0.1)' }}>
                <span>●</span> {tripType === 'round-trip' ? `${effectiveDistance} KM (${baseDistance} KM × 2)` : `${baseDistance} KM`}
              </div>
            </div>

            {/* 1. TRIP TYPE SELECTOR (ONE-WAY VS ROUND TRIP) */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              1. SELECT TRIP TYPE
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setTripType('one-way')}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: tripType === 'one-way' ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                  background: tripType === 'one-way' ? '#F0FDF4' : '#FFFFFF',
                  color: tripType === 'one-way' ? '#0F172A' : '#64748B',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: tripType === 'one-way' ? '0 4px 14px rgba(16,185,129,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>One-Way Trip</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>{baseDistance} KM</span>
              </button>

              <button
                type="button"
                onClick={() => setTripType('round-trip')}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: tripType === 'round-trip' ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                  background: tripType === 'round-trip' ? '#F0FDF4' : '#FFFFFF',
                  color: tripType === 'round-trip' ? '#0F172A' : '#64748B',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: tripType === 'round-trip' ? '0 4px 14px rgba(16,185,129,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>Round Trip (Return)</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>{baseDistance * 2} KM (2×)</span>
              </button>
            </div>

            {/* 2. SCHEDULE DATE & TIME */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              2. SCHEDULE PICKUP DATE & TIME
            </p>

            <div className="schedule-inputs-row" style={{ marginBottom: tripType === 'round-trip' ? '10px' : '16px' }}>
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
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

            {/* 3. CHOOSE FLEET CAR ON THIS SCREEN */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              3. SELECT FLEET CAR (PRICE PER KM)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {fleet.map((car) => {
                const isSelected = currentCarId === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      setCurrentCarId(car.id);
                      if (setSelectedCar) setSelectedCar(car.id);
                    }}
                    style={{
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      border: isSelected ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '12px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(16, 185, 129, 0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{car.name}</span>
                      <span style={{ fontSize: '10px', fontWeight: '800', background: isSelected ? '#DCFCE7' : '#F1F5F9', color: isSelected ? '#15803D' : '#64748B', padding: '2px 6px', borderRadius: '8px' }}>
                        ₹{car.ratePerKm}/km
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{car.type}</span>
                      <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#22C55E' }}>{car.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Booking Submission Button */}
            <button 
              className="taxigo-btn-primary" 
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px',
                borderRadius: '16px',
                fontFamily: 'League Spartan, sans-serif',
                fontSize: '17px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(52, 211, 153, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onNext && onNext(activeCarObj)}
            >
              Confirm Booking Request ({activeCarObj.price}) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
