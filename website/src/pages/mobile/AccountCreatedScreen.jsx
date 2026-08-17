import React, { useEffect } from 'react';
import accountCreatedImg from '../../assets/images/account-create/account-img.png';

const accFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 240" fill="none"><rect width="280" height="240" rx="24" fill="%23F8FAFC"/><circle cx="140" cy="110" r="55" fill="%23ECFDF5"/><path d="M140 60L160 100H200L168 124L180 165L140 140L100 165L112 124L80 100H120L140 60Z" fill="%2310B981"/><text x="140" y="200" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="%230F172A">ACCOUNT CREATED</text></svg>`;

export default function AccountCreatedScreen({ onNext, onBack }) {
  // Immediately set onboarding flags so refresh or reload stays on APP_HOME
  useEffect(() => {
    try {
      localStorage.setItem('taxigo_onboarded', 'true');
      localStorage.setItem('taxigo_profile_completed', 'true');
    } catch (e) {}

    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onNext}>‹</button>
        <h2 className="white-header-title">Account Created</h2>
      </div>

      <div className="verify-screen-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
          <div style={{ width: '100%', maxWidth: '260px', height: '200px', margin: '0 auto 20px auto' }}>
            <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="accBg" x1="0" y1="0" x2="280" y2="220" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F0FDF4" />
                  <stop offset="1" stopColor="#DCFCE7" />
                </linearGradient>
                <filter id="checkGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#22C55E" floodOpacity="0.35" />
                </filter>
              </defs>
              <rect width="280" height="220" rx="28" fill="url(#accBg)" />
              <circle cx="140" cy="110" r="68" fill="#86EFAC" fillOpacity="0.4" className="ob-animate-pulse" />
              <g filter="url(#checkGlow)" className="ob-animate-check">
                <circle cx="140" cy="110" r="48" fill="#22C55E" />
                <path d="M124 110 L134 120 L158 96" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              {/* Confetti Elements */}
              <circle cx="70" cy="60" r="6" fill="#F59E0B" />
              <circle cx="210" cy="70" r="5" fill="#3B82F6" />
              <circle cx="65" cy="160" r="7" fill="#EC4899" />
              <circle cx="215" cy="150" r="6" fill="#10B981" />
            </svg>
          </div>
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
