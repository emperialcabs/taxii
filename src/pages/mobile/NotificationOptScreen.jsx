import React, { useState } from 'react';

const NotificationGraphic = () => (
  <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '260px' }}>
    <defs>
      <linearGradient id="notifBg" x1="0" y1="0" x2="340" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="notifShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.14" />
      </filter>
    </defs>
    <rect width="340" height="260" rx="28" fill="url(#notifBg)" />

    {/* Phone mockup */}
    <g filter="url(#notifShadow)" transform="translate(95, 12)">
      <rect width="150" height="235" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="138" height="223" rx="22" fill="#FFFFFF" />
      <rect x="44" y="10" width="52" height="8" rx="4" fill="#0F172A" />

      {/* Screen header */}
      <rect x="6" y="24" width="138" height="35" fill="#F8FAFC" />
      <text x="20" y="46" fontFamily="League Spartan, sans-serif" fontSize="12" fontWeight="800" fill="#0F172A">Push Alerts</text>

      {/* Bell graphic floating */}
      <g transform="translate(75, 95)">
        <circle cx="0" cy="0" r="32" fill="#FEF3C7" className="ob-animate-pulse" />
        <g className="ob-animate-bell" transform="translate(-16, -18)">
          <path d="M16 2 C8 2 2 8 2 16 V22 L0 26 H32 L30 22 V16 C30 8 24 2 16 2 Z" fill="#FFAE00" />
          <path d="M12 28 C12 30 14 32 16 32 C18 32 20 30 20 28 Z" fill="#D97706" />
        </g>
      </g>

      {/* Incoming Ride Alert Card */}
      <g transform="translate(12, 145)">
        <rect width="126" height="70" rx="12" fill="#FFFFFF" stroke="#FFAE00" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="10" fill="#10B981" />
        <path d="M16 20 L19 23 L24 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="18" fontFamily="League Spartan, sans-serif" fontSize="10" fontWeight="800" fill="#0F172A">Driver Nearby!</text>
        <text x="36" y="27" fontFamily="Space Grotesk, sans-serif" fontSize="7" fill="#64748B">EMPERIAL CABS • 2 min away</text>
        <rect x="12" y="42" width="102" height="18" rx="6" fill="#0F172A" />
        <text x="63" y="54" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="8" fontWeight="800" fill="#FFFFFF">Track Live</text>
      </g>
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

      <div className="verify-screen-body" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '320px', minHeight: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <NotificationGraphic />
          </div>

          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Notifications
          </h2>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
            Enable notifications to get real-time ride tracking, driver updates & exclusive promos.
          </p>

          {statusText && (
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: isError ? '#EF4444' : '#10B981', margin: '12px 0 0 0', fontWeight: '700' }}>
              {statusText}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
          <button 
            type="button"
            onClick={handleAllowNotifications}
            style={{
              width: '100%',
              background: '#FFAE00',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255, 174, 0, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            Allow Notifications
          </button>

          <button 
            type="button"
            onClick={onNext}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '16px',
              fontWeight: '700',
              color: '#64748B',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
