import React, { useState, useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function TripTrackingScreen({ userCoords, pickupLoc, dropoffLoc, onCompleteRide }) {
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

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
            zoom={13}
            userLabel={pickupLoc || "Pickup Point"}
            destination={destPos}
            activeDriverPos={currentDriverPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                ● Trip In Progress
              </span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '800', color: '#22C55E' }}>
                ₹270 Total
              </span>
            </div>

            <h2 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
              Heading to {dropoffLoc || 'Destination'} 🚗
            </h2>
            <p style={{ color: '#64748B', margin: '0 0 16px 0', fontSize: '13px', fontFamily: 'Space Grotesk' }}>
              Estimated Arrival: 18 mins • Driver: Ramesh Patel
            </p>

            <button className="taxigo-btn-primary" onClick={onCompleteRide}>
              Complete Trip & Pay ₹270 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
