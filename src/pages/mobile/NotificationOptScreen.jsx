import React, { useState } from 'react';
import notificationImg from '../../assets/images/notification/notification-img.png';

const notifFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 240" fill="none"><rect width="280" height="240" rx="24" fill="%23F8FAFC"/><circle cx="140" cy="110" r="55" fill="%23FEF3C7"/><path d="M140 70C125 70 115 82 115 98V125L105 135V142H175V135L165 125V98C165 82 155 70 140 70Z" fill="%23F59E0B"/><circle cx="140" cy="155" r="8" fill="%23D97706"/><text x="140" y="205" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="%230F172A">ENABLE NOTIFICATIONS</text></svg>`;

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
        // Fallback for webviews / devices without Notification API
        setStatusText('Notifications Enabled! ✅');
        setTimeout(() => {
          if (onNext) onNext();
        }, 500);
        return;
      }
    } catch (e) {
      console.log('Notification permission handled:', e);
      setStatusText('Notifications Enabled! ✅');
      setTimeout(() => {
        if (onNext) onNext();
      }, 500);
    }
  };

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Notification</h2>
      </div>

      <div className="verify-screen-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
          <div style={{ width: '100%', maxWidth: '260px', height: '200px', margin: '0 auto 20px auto' }}>
            <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="notifBg" x1="0" y1="0" x2="280" y2="220" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFBEB" />
                  <stop offset="1" stopColor="#FEF3C7" />
                </linearGradient>
                <filter id="bellShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#F59E0B" floodOpacity="0.3" />
                </filter>
              </defs>
              <rect width="280" height="220" rx="28" fill="url(#notifBg)" />
              <circle cx="140" cy="110" r="70" fill="#FDE68A" fillOpacity="0.5" />
              <g filter="url(#bellShadow)">
                <path d="M140 45 C115 45 100 65 100 95 V130 L90 145 H190 L180 130 V95 C180 65 165 45 140 45 Z" fill="#F59E0B" />
                <circle cx="140" cy="160" r="14" fill="#D97706" />
                <circle cx="172" cy="65" r="16" fill="#EF4444" />
                <text x="172" y="70" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF">3</text>
              </g>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '32px', fontWeight: '800', color: '#1E293B', margin: '12px 0 10px 0' }}>
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
              marginTop: '16px',
              padding: '0 16px'
            }}>
              {statusText}
            </p>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', width: '100%' }}>
          <button 
            className="notification-allow-btn" 
            onClick={handleAllowNotifications}
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
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
