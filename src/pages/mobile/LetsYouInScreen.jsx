import React, { useState } from 'react';
import { signInWithGoogle } from '../../services/firebaseService';

export default function LetsYouInScreen({ phoneNumber, setPhoneNumber, onNext, onGoogleSignIn, onBack }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Trigger Direct Real Firebase Google OAuth Popup
      const googleUser = await signInWithGoogle();
      setLoading(false);
      
      if (googleUser && googleUser.email) {
        if (onGoogleSignIn) {
          onGoogleSignIn({
            name: googleUser.name || 'Google User',
            email: googleUser.email
          });
        } else {
          onNext();
        }
      } else {
        alert("Firebase Google Authentication was cancelled or could not complete.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Firebase Google Auth Error:", err);
      alert("Firebase Auth Error: " + (err.message || "Failed to sign in with Firebase Google Provider."));
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

          {/* Real Firebase Google Sign In Button - Direct OAuth */}
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
            {loading ? 'Opening Firebase Auth...' : 'Continue with Google'}
          </button>
        </div>
        <p className="let-you-footer-txt">Don’t have an account? <span onClick={onNext}>Sign up</span></p>
      </div>
    </div>
  );
}
