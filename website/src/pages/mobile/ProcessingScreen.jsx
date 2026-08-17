import React, { useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function ProcessingScreen({ onCancel, onMatched }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onMatched) onMatched();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onMatched]);

  const pickupPos = { lat: 21.7645, lng: 72.1519 };
  const nearbyTaxis = [
    { lat: 21.7665, lng: 72.1535, label: 'Nearby Dzire' },
    { lat: 21.7625, lng: 72.1495, label: 'Nearby Ertiga' }
  ];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={15}
            userLabel="Searching Nearby Drivers in Gujarat..."
            nearbyTaxis={nearbyTaxis}
          />

          <div className="homescreen-bottom-card" style={{ textAlign: 'center', padding: '30px 24px' }}>
            <div className="processing-spinner-container">
              <div className="taxigo-spinner-dots" />
            </div>

            <h2 style={{ fontFamily: 'League Spartan', fontSize: '24px', color: '#1E293B', margin: '0 0 6px 0', fontWeight: '800' }}>
              Finding Nearby Drivers...
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '15px', color: '#64748B', margin: '0 0 20px 0' }}>
              Connecting with nearest top-rated cab in your area
            </p>

            <div 
              className="slide-to-cancel-track"
              onClick={onCancel}
              style={{ cursor: 'pointer' }}
            >
              <div className="slide-cancel-knob">➔</div>
              <span className="slide-cancel-text">Slide to Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
