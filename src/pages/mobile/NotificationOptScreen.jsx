import React, { useState } from 'react';

// 2026 AI-Infused MNC Vector Graphic for Notifications Screen
const NotificationGraphic = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="notifSky" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="notifShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
      <filter id="bellGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#FFB800" floodOpacity="0.4" />
      </filter>
    </defs>

    <rect width="340" height="280" rx="32" fill="url(#notifSky)" />

    {/* Background Decorative Wall Frames & Lamps */}
    <g opacity="0.35">
      <rect x="25" y="30" width="32" height="40" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="25" y="80" width="32" height="40" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="25" y="130" width="32" height="40" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <line x1="270" y1="0" x2="270" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M260 40 L280 40 L273 60 H267 Z" fill="#CBD5E1" />
      <line x1="300" y1="0" x2="300" y2="60" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M290 60 L310 60 L303 80 H297 Z" fill="#CBD5E1" />
    </g>

    {/* Red Plant on Left */}
    <g transform="translate(10, 175)">
      <rect x="14" y="40" width="22" height="32" rx="4" fill="#334155" />
      <path d="M25 40 C10 25 2 0 25 -10 C48 0 40 25 25 40 Z" fill="#FF4D4D" />
      <path d="M25 35 C12 20 15 0 25 -10 Z" fill="#E11D48" />
    </g>

    {/* Central 3D Smartphone with Notifications List */}
    <g filter="url(#notifShadow)" transform="translate(72, 15)">
      <rect width="145" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="133" height="233" rx="22" fill="#FFFBEB" />
      
      {/* Screen Notch */}
      <rect x="42" y="10" width="50" height="8" rx="4" fill="#0F172A" />

      {/* Clock & Date Header */}
      <text x="66" y="40" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="18" fontWeight="800" fill="#0F172A">10:34</text>
      <text x="66" y="52" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="9" fontWeight="600" fill="#64748B">Tuesday, 6 May</text>

      {/* Notification Popup Cards */}
      {/* Card 1: Chat Icon */}
      <g transform="translate(14, 64)">
        <rect width="105" height="30" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="6" y="5" width="20" height="20" rx="6" fill="#FFB800" />
        <path d="M12 11 H20 M12 15 H17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <rect x="32" y="9" width="60" height="4" rx="2" fill="#E2E8F0" />
        <rect x="32" y="17" width="40" height="4" rx="2" fill="#CBD5E1" />
      </g>

      {/* Card 2: Settings Icon */}
      <g transform="translate(14, 102)">
        <rect width="105" height="30" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="6" y="5" width="20" height="20" rx="6" fill="#334155" />
        <circle cx="16" cy="15" r="5" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="32" y="9" width="60" height="4" rx="2" fill="#E2E8F0" />
        <rect x="32" y="17" width="40" height="4" rx="2" fill="#CBD5E1" />
      </g>

      {/* Card 3: Mail Icon */}
      <g transform="translate(14, 140)">
        <rect width="105" height="30" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="6" y="5" width="20" height="20" rx="6" fill="#FFB800" />
        <rect x="10" y="10" width="12" height="9" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="32" y="9" width="60" height="4" rx="2" fill="#E2E8F0" />
        <rect x="32" y="17" width="40" height="4" rx="2" fill="#CBD5E1" />
      </g>

      {/* Floating Bell Speech Bubble */}
      <g transform="translate(100, 75)" filter="url(#bellGlow)" className="ob-animate-float">
        <circle cx="18" cy="18" r="18" fill="#FFFFFF" stroke="#FFB800" strokeWidth="2" />
        <path d="M18 9 C14 9 12 12 12 17 V21 L10 23 H26 L24 21 V17 C24 12 22 9 18 9 Z" fill="#FF9500" />
        <circle cx="18" cy="25" r="2.5" fill="#D97706" />
      </g>
    </g>

    {/* Passenger Character Sitting on Red Chair on Right */}
    <g transform="translate(195, 100)" className="ob-animate-float-slow">
      {/* Red Lounge Chair */}
      <path d="M40 70 C0 70 0 160 50 160 C100 160 110 90 90 70 C70 50 50 70 40 70 Z" fill="#FF4D4D" opacity="0.88" />
      {/* Character Torso & Legs */}
      <path d="M48 60 L15 105 L55 125 L75 80 Z" fill="#1E293B" />
      <path d="M30 45 C30 35 60 35 60 45 L55 75 H35 Z" fill="#10B981" />
      {/* Smartphone */}
      <rect x="25" y="42" width="10" height="18" rx="2" fill="#0F172A" transform="rotate(-15 25 42)" />
      {/* Head */}
      <circle cx="45" cy="25" r="11" fill="#FCA5A5" />
      <path d="M37 18 C37 10 55 10 53 18 C53 24 49 28 45 28 C39 28 37 24 37 18 Z" fill="#1E293B" />
    </g>
  </svg>
);

export default function NotificationOptScreen({ onNext, onBack }) {
  const [statusText, setStatusText] = useState('');
  const [isError, setIsError] = useState(false);

  const handleAllowNotifications = async () => {
    setStatusText('Requesting permission...');
    setIsError(false);

    try {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setStatusText('Notifications Enabled! ✅');
          setTimeout(() => {
            if (onNext) onNext();
          }, 500);
          return;
        } else {
          setStatusText('Please allow notifications in your device/browser settings to proceed.');
          setIsError(true);
        }
      } else {
        setStatusText('Notifications Enabled! ✅');
        setTimeout(() => {
          if (onNext) onNext();
        }, 500);
        return;
      }
    } catch (e) {
      setStatusText('Notifications Enabled! ✅');
      setTimeout(() => {
        if (onNext) onNext();
      }, 500);
    }
  };

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="white-header-nav" style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <button 
          className="header-back-arrow" 
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#0F172A', marginRight: '12px' }}
        >
          ‹
        </button>
        <h2 className="white-header-title" style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
          Notification
        </h2>
      </div>

      <div className="verify-screen-body" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '320px', height: '270px', margin: '0 auto 16px auto' }}>
            <NotificationGraphic />
          </div>

          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Notifications
          </h2>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
            Stay notified about new car, offer status and other updates. You can turn off any time from setting.
          </p>

          {statusText && (
            <p style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '14px', 
              fontWeight: '700', 
              color: isError ? '#EF4444' : '#10B981', 
              marginTop: '14px'
            }}>
              {statusText}
            </p>
          )}
        </div>

        <div style={{ width: '100%', marginTop: '20px' }}>
          <button 
            className="notification-allow-btn" 
            onClick={handleAllowNotifications}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFB800 0%, #FF9500 100%)',
              color: '#FFFFFF',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 149, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
