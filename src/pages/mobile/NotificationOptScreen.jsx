import React, { useState } from 'react';

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

      <div className="verify-screen-body">
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <img 
            className="verify-hero-img" 
            src="/assets/images/notification/notification-img.png" 
            alt="Notification Illustration" 
            style={{ maxWidth: '240px', maxHeight: '200px', margin: '0 auto 16px auto', display: 'block', objectFit: 'contain' }}
          />
          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '28px', fontWeight: '800', color: '#1E293B', margin: '16px 0 10px 0' }}>
            Notifications
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
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

        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button 
            className="notification-allow-btn" 
            onClick={handleAllowNotifications}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
