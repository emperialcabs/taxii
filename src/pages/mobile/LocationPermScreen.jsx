import React, { useState } from 'react';
import locationImg from '../../assets/images/location/enable-location-img.png';

export default function LocationPermScreen({ onNext, onBack }) {
  const [statusText, setStatusText] = useState('');
  const [isError, setIsError] = useState(false);

  const handleEnableGps = () => {
    setStatusText('Activating GPS Location...');
    setIsError(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStatusText('Location Granted! ✅');
          setTimeout(() => {
            if (onNext) onNext();
          }, 500);
        },
        (err) => {
          console.log('Location permission error:', err);
          setStatusText('Please allow location access in your device/browser settings to proceed.');
          setIsError(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setStatusText('Location Granted! ✅');
      setTimeout(() => {
        if (onNext) onNext();
      }, 500);
    }
  };

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Enable Location</h2>
      </div>

      <div className="verify-screen-body">
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <img 
            className="verify-hero-img" 
            src={locationImg} 
            alt="Enable Location Illustration" 
            style={{ maxWidth: '240px', maxHeight: '200px', margin: '0 auto 16px auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = locationImg;
            }}
          />
          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '28px', fontWeight: '800', color: '#1E293B', margin: '16px 0 10px 0' }}>
            Enable Location
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto 20px auto' }}>
            Choose your location to start find the request around you.
          </p>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#64748B' }}>
            Can we access your location?{' '}
            <span 
              style={{ color: '#1E293B', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onNext}
            >
              Set Manually
            </span>
          </p>

          {statusText && (
            <p style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '14px', 
              fontWeight: '700', 
              color: isError ? '#EF4444' : '#10B981', 
              marginTop: '16px',
              padding: '0 16px'
            }}>
              {statusText}
            </p>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '16px', width: '100%' }}>
          <button 
            className="notification-allow-btn" 
            onClick={handleEnableGps}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFAE00 0%, #FF9500 100%)',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 174, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
}
