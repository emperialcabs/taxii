import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function TripTrackingScreen({ userCoords, pickupLoc, dropoffLoc, onCompleteRide }) {
  const [activeRide, setActiveRide] = useState(null);

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
    return () => window.removeEventListener('storage', syncRide);
  }, []);

  const actualPickup = activeRide?.pickup || pickupLoc || "Bhavnagar, Gujarat";
  const actualDropoff = activeRide?.dropoff || dropoffLoc || "Ahmedabad Airport (AMD)";
  const driverName = activeRide?.driver || "Ramesh Patel";
  const fareAmt = activeRide?.fare || 770;

  const pickupPos = getCoordsForPlace(actualPickup, userCoords);
  const destPos = getCoordsForPlace(actualDropoff, userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

  const [driverStep, setDriverStep] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverStep((prev) => (prev < routePolyline.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [routePolyline.length]);

  const currentDriverPos = routePolyline[driverStep] || pickupPos;
  const totalSteps = Math.max(1, routePolyline.length);
  const remainingSteps = totalSteps - driverStep;
  const remainingDistKm = (remainingSteps * 2.2).toFixed(1);
  const remainingTimeMins = Math.max(2, Math.round(remainingSteps * 2.5));

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={currentDriverPos}
            zoom={13}
            userLabel={actualPickup}
            destination={destPos}
            activeDriverPos={currentDriverPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                ● {activeRide?.status === 'In Progress' ? 'Ride In Progress' : 'Driver Assigned & En Route'}
              </span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '800', color: '#22C55E' }}>
                ₹{fareAmt} Total
              </span>
            </div>

            <h2 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
              Heading to {actualDropoff} 🚗
            </h2>
            <p style={{ color: '#64748B', margin: '0 0 8px 0', fontSize: '13px', fontFamily: 'Space Grotesk' }}>
              From: {actualPickup}
            </p>

            <div style={{ display: 'flex', gap: '12px', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', margin: '10px 0 16px 0', border: '1px solid #E2E8F0' }}>
              <div>
                <small style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>REMAINING DISTANCE</small>
                <strong style={{ color: '#0F172A', fontSize: '14px' }}>{remainingDistKm} km</strong>
              </div>
              <div style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: '12px' }}>
                <small style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>ESTIMATED ARRIVAL</small>
                <strong style={{ color: '#16A34A', fontSize: '14px' }}>{remainingTimeMins} mins</strong>
              </div>
              <div style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: '12px' }}>
                <small style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>DRIVER</small>
                <strong style={{ color: '#2563EB', fontSize: '14px' }}>{driverName}</strong>
              </div>
            </div>

            <button className="taxigo-btn-primary" onClick={onCompleteRide}>
              Complete Trip & Pay ₹{fareAmt} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
