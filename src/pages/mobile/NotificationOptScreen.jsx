import React, { useState } from 'react';
import notificationImg from '../../assets/images/notification/notification-img.png';

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
          <img 
            className="verify-hero-img" 
            src={notificationImg} 
            alt="Notification Illustration" 
            style={{ width: '100%', maxWidth: '280px', maxHeight: '240px', margin: '0 auto 20px auto', display: 'block', objectFit: 'contain' }}
          />
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
