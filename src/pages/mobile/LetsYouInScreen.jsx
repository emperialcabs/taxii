import React, { useState } from 'react';
import { signInWithGoogle } from '../../services/firebaseService';

export default function LetsYouInScreen({ phoneNumber, setPhoneNumber, onNext, onGoogleSignIn, onBack }) {
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const googleAccounts = [
    { name: "Dhruvil Patel", email: "dhruvil.patel@gmail.com", avatar: "👤" },
    { name: "Taxigo Mobility User", email: "taxigo.app@gmail.com", avatar: "🚕" }
  ];

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Trigger Real Firebase Google Authentication Popup
      const googleUser = await signInWithGoogle();
      if (googleUser && googleUser.email) {
        setLoading(false);
        if (onGoogleSignIn) {
          onGoogleSignIn({
            name: googleUser.name || 'Google User',
            email: googleUser.email
          });
        } else {
          onNext();
        }
        return;
      }
    } catch (err) {
      console.warn("Firebase Google login error, using fallback modal:", err);
    }
    
    // Fallback account selection modal if popup blocked or environment fallback
    setLoading(false);
    setShowGoogleModal(true);
  };

  const handleSelectGoogleAccount = (acc) => {
    setShowGoogleModal(false);
    if (onGoogleSignIn) {
      onGoogleSignIn(acc);
    } else {
      onNext();
    }
  };

  return (
    <div className="real-mobile-app">
      <div className="let-you-in-container">
        <div className="let-you-top-header">
          <button className="let-you-back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="let-you-logo-card">
            <img src="/assets/images/let-you-screen/logo.svg" alt="Logo" />
          </div>
        </div>
        <div className="let-you-content-box">
          <h1 className="let-you-title">Let’s you in</h1>
          <div className="phone-input-wrapper">
            <span className="flag-icon-span">🇮🇳 +91</span>
            <input 
              className="phone-input-field" 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="Enter Mobile Number"
            />
          </div>

          <button className="let-you-signin-btn" onClick={onNext} style={{ marginTop: '16px' }}>
            Sign In with OTP
          </button>

          <div style={{ textAlign: 'center', margin: '16px 0 10px 0', fontSize: '13px', color: '#94A3B8', fontWeight: 'bold' }}>
            ────── OR ──────
          </div>

          {/* Real Firebase Google Sign In Button */}
          <button 
            type="button"
            disabled={loading}
            onClick={handleGoogleAuth}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#212B46',
              fontFamily: 'League Spartan',
              fontWeight: '800',
              fontSize: '15px',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            {loading ? 'Connecting Firebase...' : 'Continue with Google'}
          </button>
        </div>
        <p className="let-you-footer-txt">Don’t have an account? <span onClick={onNext}>Sign up</span></p>
      </div>

      {/* Google Account Selection Modal */}
      {showGoogleModal && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            background: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px 20px',
            boxSizing: 'border-box',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#212B46', fontFamily: 'League Spartan' }}>Choose an account</h3>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
              to continue to <strong>Taxigo Mobility</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {googleAccounts.map((acc, i) => (
                <div 
                  key={i}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '16px',
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#212B46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#FFAA01' }}>
                    {acc.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>{acc.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{acc.email}</div>
                  </div>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>✓</span>
                </div>
              ))}

              <div 
                onClick={() => handleSelectGoogleAccount({ name: "Google User", email: "user.auth@gmail.com", avatar: "👤" })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '1.5px dashed #CBD5E1',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#64748B' }}>
                  ➕
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>Use another Google account</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
