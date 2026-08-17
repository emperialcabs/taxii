import React, { useEffect } from 'react';
import accCreatedImg from '../../assets/images/onboarding/01_account_created.png';

export default function AccountCreatedScreen({ onNext, onBack }) {
  useEffect(() => {
    try {
      localStorage.setItem('taxigo_onboarded', 'true');
      localStorage.setItem('taxigo_profile_completed', 'true');
    } catch (e) {}
  }, []);

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="white-header-nav" style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <button 
          className="header-back-arrow" 
          onClick={onNext}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#0F172A', marginRight: '12px' }}
        >
          ‹
        </button>
        <h2 className="white-header-title" style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
          Account Created
        </h2>
      </div>

      <div className="verify-screen-body" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '320px', height: '260px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: '0 auto 16px auto', overflow: 'hidden', borderRadius: '24px' }}>
            <img 
              src={accCreatedImg} 
              alt="Account Created" 
              className="onboarding-cropped-image"
            />
          </div>

          <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Account Created
          </h2>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', color: '#64748B', lineHeight: '1.6', maxWidth: '310px', margin: '0 auto' }}>
            Your account had been created successfully.
          </p>
        </div>

        <div style={{ width: '100%', marginTop: '20px' }}>
          <button 
            className="notification-allow-btn" 
            onClick={onNext}
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
            Book My First Ride!
          </button>
        </div>
      </div>
    </div>
  );
}
