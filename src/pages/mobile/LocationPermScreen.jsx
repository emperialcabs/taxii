import React, { useState } from 'react';

export default function LocationPermScreen({ onNext, onBack }) {
  const [statusText, setStatusText] = useState('');

  const handleEnableGps = () => {
    setStatusText('Activating GPS Location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStatusText('Location Granted! ✅');
          setTimeout(onNext, 400);
        },
        () => {
          setStatusText('Proceeding with Default Location');
          setTimeout(onNext, 500);
        }
      );
    } else {
      onNext();
    }
  };

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Enable GPS Location</h2>
      </div>
      <div className="verify-screen-body">
        <div>
          <img className="verify-hero-img" src="/assets/images/location/enable-location-img.png" alt="Location" />
          <h2 style={{ textAlign: 'center', fontFamily: 'League Spartan', fontSize: '28px', color: '#212B46' }}>Location Access</h2>
          <p className="verify-desc-txt">Taxigo uses your location to find nearby drivers and provide accurate pickup ETAs.</p>
          {statusText && (
            <p style={{ textAlign: 'center', color: '#22C55E', fontWeight: '700', fontSize: '14px', margin: '8px 0 0 0' }}>
              {statusText}
            </p>
          )}
        </div>
        <button className="taxigo-btn-primary" onClick={handleEnableGps}>Enable GPS</button>
      </div>
    </div>
  );
}
