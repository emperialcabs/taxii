import React, { useState } from 'react';
import locationImg from '../../assets/images/location/enable-location-img.png';

const locFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" fill="none"><rect width="280" height="220" rx="24" fill="%23F8FAFC"/><circle cx="140" cy="100" r="55" fill="%23EFF6FF"/><path d="M140 60C120 60 105 75 105 95C105 125 140 150 140 150C140 150 175 125 175 95C175 75 160 60 140 60ZM140 107C133 107 128 102 128 95C128 88 133 83 140 83C147 83 152 88 152 95C152 102 147 107 140 107Z" fill="%233B82F6"/><text x="140" y="185" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="%230F172A">ENABLE GPS LOCATION</text></svg>`;

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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '240px', height: '180px', margin: '0 auto 16px auto' }}>
            <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="locBg" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F0FDF4" />
                  <stop offset="1" stopColor="#DCFCE7" />
                </linearGradient>
                <filter id="locPinGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#166534" floodOpacity="0.25" />
                </filter>
              </defs>
              <rect width="240" height="180" rx="24" fill="url(#locBg)" />
              <circle cx="120" cy="90" r="60" fill="#86EFAC" fillOpacity="0.4" />
              <circle cx="120" cy="90" r="40" fill="#86EFAC" fillOpacity="0.6" />
              <g filter="url(#locPinGlow)">
                <path d="M120 40 C102 40 88 54 88 72 C88 96 120 125 120 125 C120 125 152 96 152 72 C152 54 138 40 120 40 Z" fill="#22C55E" />
                <circle cx="120" cy="70" r="10" fill="#FFFFFF" />
                <circle cx="120" cy="70" r="5" fill="#15803D" />
              </g>
            </svg>
          </div>
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
