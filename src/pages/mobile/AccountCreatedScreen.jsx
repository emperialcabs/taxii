import React from 'react';

export default function AccountCreatedScreen({ onNext, onBack }) {
  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Account Created</h2>
      </div>

      <div className="verify-screen-body">
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <img 
            className="verify-hero-img" 
            src="/assets/images/account-create/account-img.png" 
            alt="Account Created Illustration" 
            style={{ maxWidth: '240px', maxHeight: '200px', margin: '0 auto 16px auto', display: 'block', objectFit: 'contain' }}
          />
          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '28px', fontWeight: '800', color: '#1E293B', margin: '20px 0 12px 0' }}>
            Account Created
          </h2>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: '#64748B', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
            Your account had been created successfully.
          </p>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button 
            className="notification-allow-btn" 
            onClick={onNext}
          >
            Book My First Ride!
          </button>
        </div>
      </div>
    </div>
  );
}
