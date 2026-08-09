import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function SeatScheduleScreen({ 
  userCoords,
  selectedSeat, 
  setSelectedSeat, 
  scheduledDate, 
  setScheduledDate, 
  scheduledTime, 
  setScheduledTime, 
  onNext, 
  onBack 
}) {
  const pickupPos = (userCoords && typeof userCoords.lat === 'number') ? userCoords : { lat: 21.7645, lng: 72.1519, label: 'Pickup Point' };
  const destPos = { lat: pickupPos.lat - 0.008, lng: pickupPos.lng + 0.009, label: 'Dropoff Destination' };
  const routePolyline = [
    pickupPos,
    { lat: (pickupPos.lat + destPos.lat) / 2 + 0.002, lng: (pickupPos.lng + destPos.lng) / 2 },
    destPos
  ];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={14}
            userLabel="Pickup Point"
            destination={destPos}
            routePolyline={routePolyline}
          />

          {/* Bottom Card for Seats & Schedule */}
          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onBack}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>‹</span>
                <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '700', color: '#212B46' }}>Back</span>
              </div>
              <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', color: '#212B46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#FFAA01' }}>🛣️</span> 18.5 KM
              </div>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '700', color: '#67696B', letterSpacing: '1px', margin: 0 }}>NEED SEAT</p>
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

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '700', color: '#67696B', letterSpacing: '1px', margin: '16px 0 0 0' }}>SCHEDULE DATE & TIME</p>
            <div className="schedule-inputs-row">
              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#212B46', cursor: 'pointer' }}
                >
                  <option value="Today, 09 Aug 2026">Today, 09 Aug 2026</option>
                  <option value="Tomorrow, 10 Aug 2026">Tomorrow, 10 Aug 2026</option>
                  <option value="Mon, 11 Aug 2026">Mon, 11 Aug 2026</option>
                  <option value="Tue, 12 Aug 2026">Tue, 12 Aug 2026</option>
                  <option value="Wed, 13 Aug 2026">Wed, 13 Aug 2026</option>
                  <option value="Thu, 14 Aug 2026">Thu, 14 Aug 2026</option>
                  <option value="Fri, 15 Aug 2026">Fri, 15 Aug 2026</option>
                  <option value="Sat, 16 Aug 2026">Sat, 16 Aug 2026</option>
                </select>
                <input 
                  type="date" 
                  style={{ position: 'absolute', right: '10px', opacity: 0, width: '30px', height: '30px', cursor: 'pointer' }} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const d = new Date(e.target.value);
                      const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      setScheduledDate(formatted);
                    }
                  }} 
                />
                <span style={{ fontSize: '16px', pointerEvents: 'none' }}>📅</span>
              </div>
              <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#212B46', cursor: 'pointer' }}>
                  {[
                    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
                    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM",
                    "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
                    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
                    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
                    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
                    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
                  ].map((timeVal) => (
                    <option key={timeVal} value={timeVal}>{timeVal}</option>
                  ))}
                </select>
                <input 
                  type="time" 
                  style={{ position: 'absolute', right: '10px', opacity: 0, width: '30px', height: '30px', cursor: 'pointer' }} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const [h, m] = e.target.value.split(':');
                      const hourNum = parseInt(h, 10);
                      const ampm = hourNum >= 12 ? 'PM' : 'AM';
                      const formattedHour = (hourNum % 12 === 0 ? 12 : hourNum % 12).toString().padStart(2, '0');
                      setScheduledTime(`${formattedHour}:${m} ${ampm}`);
                    }
                  }} 
                />
                <span style={{ fontSize: '16px', pointerEvents: 'none' }}>🕒</span>
              </div>
            </div>

            <button className="taxigo-btn-primary" onClick={onNext}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
