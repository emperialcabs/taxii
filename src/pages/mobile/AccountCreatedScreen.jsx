import React, { useEffect } from 'react';

// 2026 AI-Infused MNC Vector Graphic for Account Created Screen
const AccountCreatedGraphic = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="accSky" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="accPhoneShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
      <filter id="accAvatarGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#FFB800" floodOpacity="0.4" />
      </filter>
    </defs>

    <rect width="340" height="280" rx="32" fill="url(#accSky)" />

    {/* Background Window Curtain Graphic */}
    <g opacity="0.35">
      <path d="M30 15 V160 H110 V15 Z M70 15 V160 Z M30 80 H110 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
    </g>

    {/* Plant Pot on Left */}
    <g transform="translate(20, 165)">
      <rect x="18" y="42" width="26" height="35" rx="4" fill="#334155" />
      <path d="M31 42 C12 25 5 0 31 -10 C57 0 50 25 31 42 Z" fill="#FF4D4D" />
      <path d="M31 36 C18 20 20 0 31 -10 Z" fill="#E11D48" />
    </g>

    {/* Central 3D Smartphone showing Welcome Screen & Login Card */}
    <g filter="url(#accPhoneShadow)" transform="translate(95, 15)">
      <rect width="145" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="133" height="233" rx="22" fill="#FFFFFF" />
      
      {/* Golden Top Header inside Phone */}
      <path d="M6 6 H139 V100 H6 Z" fill="#FFB800" />
      <rect x="42" y="10" width="50" height="8" rx="4" fill="#0F172A" opacity="0.5" />

      {/* Floating User Avatar Badge Circle */}
      <g transform="translate(38, 40)" filter="url(#accAvatarGlow)" className="ob-animate-float">
        <circle cx="34" cy="34" r="34" fill="#FFFFFF" />
        <circle cx="34" cy="34" r="30" fill="#FF9500" />
        {/* User Head & Shoulders Icon */}
        <circle cx="34" cy="26" r="11" fill="#FFFFFF" />
        <path d="M18 52 C18 42 50 42 50 52 Z" fill="#FFFFFF" />
      </g>

      {/* White Card Container over Phone */}
      <g transform="translate(14, 115)">
        <rect width="117" height="110" rx="10" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="1" />
        <text x="58" y="24" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="14" fontWeight="800" fill="#0F172A">WELCOME</text>
        
        {/* Input Line 1 */}
        <rect x="12" y="36" width="93" height="14" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="16" y="41" width="30" height="4" rx="2" fill="#CBD5E1" />

        {/* Input Line 2 */}
        <rect x="12" y="56" width="93" height="14" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="16" y="61" width="40" height="4" rx="2" fill="#CBD5E1" />

        {/* Golden Login Button */}
        <rect x="12" y="78" width="93" height="20" rx="6" fill="#FFB800" />
        <text x="58" y="92" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="10" fontWeight="900" fill="#FFFFFF">LOGIN</text>
      </g>
    </g>

    {/* Standing Female Character Leaning on Phone on Right */}
    <g transform="translate(225, 90)" className="ob-animate-float-slow">
      <ellipse cx="30" cy="165" rx="26" ry="7" fill="#0F172A" opacity="0.15" />
      <path d="M18 100 L22 164 H36 L30 100 Z" fill="#334155" />
      <path d="M32 100 L40 164 H54 L44 100 Z" fill="#1E293B" />
      <path d="M14 45 C14 35 48 35 48 45 L42 102 H20 Z" fill="#10B981" />
      {/* Smartphone */}
      <rect x="28" y="50" width="10" height="18" rx="2" fill="#0F172A" transform="rotate(-10 28 50)" />
      {/* Head */}
      <circle cx="30" cy="24" r="12" fill="#FCA5A5" />
      <path d="M22 18 C22 8 42 8 40 18 C40 24 36 28 30 28 C24 28 22 24 22 18 Z" fill="#1E293B" />
    </g>
  </svg>
);

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

      <div className="verify-screen-body" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '320px', height: '270px', margin: '0 auto 16px auto' }}>
            <AccountCreatedGraphic />
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
              background: 'linear-gradient(135deg, #FFB800 0%, #FF9500 100%)',
              color: '#FFFFFF',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 149, 0, 0.35)',
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
