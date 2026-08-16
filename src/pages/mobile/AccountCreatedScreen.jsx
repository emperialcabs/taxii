import React, { useEffect } from 'react';
import accountCreatedImg from '../../assets/images/account-create/account-img.png';

export default function AccountCreatedScreen({ onNext, onBack }) {
  // Show screen for a minor 3 seconds before proceeding automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onNext]);

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
            src={accountCreatedImg} 
            alt="Account Created Illustration" 
            style={{ width: '100%', maxWidth: '280px', maxHeight: '240px', margin: '0 auto 20px auto', display: 'block', objectFit: 'contain' }}
          />
          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '32px', fontWeight: '800', color: '#1E293B', margin: '16px 0 10px 0' }}>
            Account Created
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', color: '#64748B', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
            Your account had been created successfully.
          </p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px', width: '100%' }}>
          <button 
            className="notification-allow-btn" 
            onClick={onNext}
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
            Book My First Ride!
          </button>
        </div>
      </div>
    </div>
  );
}
