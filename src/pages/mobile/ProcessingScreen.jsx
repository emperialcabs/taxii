import React, { useEffect } from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function ProcessingScreen({ onCancel, onMatched }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onMatched) onMatched();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onMatched]);

  const pickupPos = { lat: 47.6062, lng: -122.3321 };
  const nearbyTaxis = [
    { lat: 47.6075, lng: -122.3300, label: 'Searching...' },
    { lat: 47.6050, lng: -122.3340, label: 'Searching...' }
  ];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={15}
            userLabel="Searching Nearby Drivers..."
            nearbyTaxis={nearbyTaxis}
          />

          <div className="homescreen-bottom-card" style={{ textAlign: 'center', padding: '30px 24px' }}>
            {/* Circular Dotted Spinner (processing-screen.html) */}
            <div className="processing-spinner-container">
              <div className="taxigo-spinner-dots" />
            </div>

            <h2 style={{ fontFamily: 'League Spartan', fontSize: '26px', color: '#212B46', margin: '0 0 8px 0', fontWeight: '700' }}>
              We are processing your booking...
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '16px', color: '#67696B', margin: '0 0 20px 0' }}>
              Your ride will start soon
            </p>

            {/* Slide to Cancel Bar */}
            <div 
              className="slide-to-cancel-track"
              onClick={onCancel}
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
