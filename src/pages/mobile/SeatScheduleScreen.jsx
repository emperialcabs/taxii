import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function SeatScheduleScreen({ 
  userCoords,
  pickupLoc,
  dropoffLoc,
  selectedSeat, 
  setSelectedSeat, 
  scheduledDate, 
  setScheduledDate, 
  scheduledTime, 
  setScheduledTime, 
  onNext, 
  onBack 
}) {
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

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

          {/* Bottom Card for Seats & Schedule */}
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
                  color: '#1E293B'
                }}
              >
                <span>←</span> Back
              </button>
              <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🛣️</span> 18.5 km
              </div>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.3px', margin: '0 0 10px 0' }}>
              PASSENGER SEATS NEEDED
            </p>
            <div className="seat-selection-grid">
              {[1, 2, 3, 4, 6, 7].map((num) => (
                <button 
                  key={num} 
                  className={`seat-box-btn ${selectedSeat === num ? 'active' : ''}`}
                  onClick={() => setSelectedSeat(num)}
                >
                  {num}
                </button>
              ))}
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.3px', margin: '16px 0 10px 0' }}>
              SCHEDULE DATE & TIME
            </p>
            <div className="schedule-inputs-row">
              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#1E293B', cursor: 'pointer' }}
                >
                  <option value="Today, 10 Aug 2026">Today, 10 Aug 2026</option>
                  <option value="Tomorrow, 11 Aug 2026">Tomorrow, 11 Aug 2026</option>
                  <option value="Wed, 12 Aug 2026">Wed, 12 Aug 2026</option>
                  <option value="Thu, 13 Aug 2026">Thu, 13 Aug 2026</option>
                  <option value="Fri, 14 Aug 2026">Fri, 14 Aug 2026</option>
                  <option value="Sat, 15 Aug 2026">Sat, 15 Aug 2026</option>
                </select>
                <span style={{ fontSize: '16px', pointerEvents: 'none' }}>📅</span>
              </div>
              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#1E293B', cursor: 'pointer' }}>
                  {[
                    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
                    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
                  ].map((timeVal) => (
                    <option key={timeVal} value={timeVal}>{timeVal}</option>
                  ))}
                </select>
                <span style={{ fontSize: '16px', pointerEvents: 'none' }}>🕒</span>
              </div>
            </div>

            <button className="taxigo-btn-primary" onClick={onNext}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
