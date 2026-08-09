import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function TripTrackingScreen({ userCoords, dropoffLoc, onCompleteRide }) {
  const pickupPos = (userCoords && typeof userCoords.lat === 'number') ? userCoords : { lat: 21.7645, lng: 72.1519, label: 'Pickup Point' };
  const destPos = { lat: pickupPos.lat - 0.012, lng: pickupPos.lng + 0.014, label: dropoffLoc || 'Destination' };

  // Simulated live route polyline points
  const routePolyline = [
    pickupPos,
    { lat: pickupPos.lat - 0.004, lng: pickupPos.lng + 0.005 },
    { lat: pickupPos.lat - 0.008, lng: pickupPos.lng + 0.009 },
    destPos
  ];

  // Animate driver progress along route
  const [driverStep, setDriverStep] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverStep((prev) => (prev < routePolyline.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, [routePolyline.length]);

  const currentDriverPos = routePolyline[driverStep];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={currentDriverPos}
            zoom={14}
            userLabel="Pickup Point"
            destination={destPos}
            activeDriverPos={currentDriverPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <h2 style={{ fontFamily: 'League Spartan', fontSize: '24px', margin: 0, color: '#212B46' }}>On Trip to {dropoffLoc}</h2>
            <p style={{ color: '#67696B', margin: '4px 0 16px 0' }}>Estimated Arrival in 12 Mins</p>
            <button className="taxigo-btn-primary" onClick={onCompleteRide}>Complete Trip & Pay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
