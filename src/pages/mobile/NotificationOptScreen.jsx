import React, { useState } from 'react';

export default function NotificationOptScreen({ onNext, onBack }) {
  const [statusText, setStatusText] = useState('');

  const handleAllowNotifications = async () => {
    setStatusText('Requesting permission...');
    try {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setStatusText('Notifications Enabled! ✅');
        } else {
          setStatusText('Permission Saved.');
        }
      }
    } catch (e) {
      console.log('Notification permission handled:', e);
    }
    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Notifications</h2>
      </div>
      <div className="verify-screen-body">
        <div>
          <img className="verify-hero-img" src="/assets/images/notification/notification-img.png" alt="Notification" />
          <h2 style={{ textAlign: 'center', fontFamily: 'League Spartan', fontSize: '28px', color: '#212B46' }}>Stay Updated</h2>
          <p className="verify-desc-txt">Turn on notifications to get real-time ride tracking, driver updates, and exclusive promos.</p>
          {statusText && (
            <p style={{ textAlign: 'center', color: '#22C55E', fontWeight: '700', fontSize: '14px', margin: '8px 0 0 0' }}>
              {statusText}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="taxigo-btn-primary" onClick={handleAllowNotifications}>Allow Notifications</button>
          <button style={{ background: 'none', border: 'none', color: '#67696B', fontWeight: '600', cursor: 'pointer', padding: '10px' }} onClick={onNext}>Skip for Now</button>
        </div>
      </div>
    </div>
  );
}
