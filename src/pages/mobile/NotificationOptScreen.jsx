import React, { useState } from 'react';
import notifImg from '../../assets/images/onboarding/02_notifications.png';

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
          <div style={{ width: '100%', maxWidth: '320px', minHeight: '260px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px auto' }}>
            <img 
              src={notifImg} 
              alt="Notifications" 
              className="onboarding-hero-img"
              style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.06))' }}
            />
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
              background: '#FFAE00',
              color: '#FFFFFF',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255, 174, 0, 0.35)',
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
