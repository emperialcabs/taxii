import React, { useState } from 'react';
import db from '../../services/dbService';
import { signInWithGoogle, loadCustomerFromFirestore, saveCustomerToFirestore } from '../../services/firebaseService';
import { saveCustomerToMySQL, loadAllInquiriesFromMySQL } from '../../services/mysqlService';

// ─── Utility: derive a clean display name from an email ──────────────────────
const formatNameFromEmail = (email) => {
  if (!email || !email.includes('@')) return '';
  return email.split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export default function LetsYouInScreen({
  phoneNumber, setPhoneNumber,
  selectedGoogleAccount, setSelectedGoogleAccount,
  onNext, onGoToCreateAccount, onGoogleSignIn, onBack
}) {
  const [loading, setLoading] = useState(false);
  const [showFallbackPicker, setShowFallbackPicker] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  // ─── After Google gives us user data: check Firestore, route accordingly ──
  const processGoogleUser = (googleData) => {
    if (!googleData || !googleData.email) return;

    const email = googleData.email;
    let name = googleData.name || '';
    if (!name || name === 'Google User') {
      name = formatNameFromEmail(email);
    }
    const photoURL = googleData.photoURL || null;
    const uid = googleData.uid || 'goog_' + Date.now();

    // ── Build profile instantly from Google data ──
    const profile = {
      id: 'CUST-' + Math.floor(10000 + Math.random() * 89999),
      name,
      email,
      phone: phoneNumber || localStorage.getItem('cabsy_user_phone') || '',
      photoURL,
      uid,
      profession: '',
      area: '',
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active',
      lastLogin: new Date().toISOString()
    };

    // ── Save to localStorage INSTANTLY (no network wait) ──
    try {
      localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
      localStorage.setItem('cabsy_user_phone', profile.phone || '');
      localStorage.setItem('taxigo_onboarded', 'true');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    if (setSelectedGoogleAccount) setSelectedGoogleAccount(profile);
    setLoading(false);

    // ── Check Firestore in BACKGROUND for returning user detection ──
    loadCustomerFromFirestore(email).then(existing => {
      if (existing && existing.name && existing.phone) {
        // Merge cloud profile into local
        const merged = { ...profile, ...existing, lastLogin: new Date().toISOString() };
        localStorage.setItem('cabsy_user_profile', JSON.stringify(merged));
        localStorage.setItem('taxigo_profile_completed', 'true');
        window.dispatchEvent(new Event('storage'));
      }
    }).catch(() => {});

    // ── Background: save to Firestore + MySQL (non-blocking) ──
    saveCustomerToFirestore(profile).catch(() => {});
    saveCustomerToMySQL(profile).catch(() => {});
    try { db.saveCustomer(profile); } catch(e) {}

    // ── Background: restore trip history (non-blocking) ──
    restoreTrips(profile);

    // ── Check if returning user (local check — instant) ──
    const isProfileCompleted = localStorage.getItem('taxigo_profile_completed') === 'true';
    if (isProfileCompleted) {
      // Returning user → go straight to home
      if (onGoogleSignIn) {
        onGoogleSignIn(profile);
      } else if (onNext) {
        onNext();
      }
    } else {
      // New user → go to complete profile
      if (onGoToCreateAccount) {
        onGoToCreateAccount();
      } else if (onNext) {
        onNext();
      }
    }
  };

  // ─── Restore trip history from MySQL for returning user ──
  const restoreTrips = async (profile) => {
    try {
      const mysqlInquiries = await loadAllInquiriesFromMySQL().catch(() => []);
      const userPhone = (profile.phone || '').replace(/\D/g, '');
      const userEmail = (profile.email || '').toLowerCase().trim();

      const userTrips = (mysqlInquiries || []).filter(i => {
        const iPhone = (i.customerPhone || '').replace(/\D/g, '');
        const iEmail = (i.customerEmail || '').toLowerCase().trim();
        return (userPhone && iPhone && userPhone === iPhone) ||
               (userEmail && iEmail && userEmail === iEmail);
      });

      if (userTrips.length > 0) {
        const localRaw = localStorage.getItem('cabsy_inquiries');
        const localList = localRaw ? JSON.parse(localRaw) : [];
        const existingIds = new Set(localList.map(i => i.id).filter(Boolean));
        const fresh = userTrips.filter(i => !existingIds.has(i.id));
        const merged = [...fresh, ...localList];
        localStorage.setItem('cabsy_inquiries', JSON.stringify(merged));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.warn('[Auth] Trip restore failed:', e);
    }
  };

  // ─── Main handler: "Continue with Google" button ──
  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      if (googleUser && googleUser.email) {
        processGoogleUser(googleUser);
      } else {
        setShowFallbackPicker(true);
        setLoading(false);
      }
    } catch (err) {
      console.warn('[Auth] Google auth error:', err);
      setShowFallbackPicker(true);
      setLoading(false);
    }
  };

  // ─── Fallback picker: user selects/types an email ──
  const handleFallbackSelect = (email) => {
    if (!email || !email.includes('@')) return;
    setShowFallbackPicker(false);
    setLoading(true);
    processGoogleUser({
      name: formatNameFromEmail(email),
      email: email,
      photoURL: null,
      uid: 'goog_' + Date.now()
    });
  };

  const goToCreateAccount = onGoToCreateAccount || onNext;

  return (
    <div className="real-mobile-app">
      <div className="let-you-in-page-wrapper">
        {/* Red City Banner Header */}
        <div className="let-you-red-header">
          <button className="let-you-white-back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="let-you-centered-logo-box">
            <img src="/assets/images/let-you-screen/logo.svg" alt="Empire Cab Logo" />
          </div>
        </div>

        {/* White Curved Bottom Sheet Content */}
        <div className="let-you-white-bottom-sheet">
          <h1 className="let-you-title">Let's You In</h1>

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

          <div style={{ textAlign: 'center', margin: '18px 0 12px 0', fontSize: '13px', color: '#94A3B8', fontWeight: '700' }}>
            ────── OR ──────
          </div>

          {/* Google Sign-In Button */}
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
              fontFamily: 'League Spartan, sans-serif',
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
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="let-you-footer-txt" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
            Don't have an account? <span style={{ color: '#10B981', fontWeight: '800', cursor: 'pointer' }} onClick={goToCreateAccount}>Sign up</span>
          </p>
        </div>
      </div>

      {/* ── Fallback In-App Account Picker (only shows if native picker failed) ── */}
      {showFallbackPicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            background: '#FFFFFF', width: '100%', maxWidth: '500px',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            padding: '24px 24px 36px', boxSizing: 'border-box',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'League Spartan', color: '#0F172A' }}>
                  Sign in with Google
                </h3>
              </div>
              <button 
                onClick={() => setShowFallbackPicker(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', color: '#64748B' }}
              >✕</button>
            </div>
            
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
              Enter your Google email to sign in to Empire Cab
            </p>

            {/* Email Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="yourname@gmail.com" 
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                autoFocus
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: '14px',
                  border: '1.5px solid #CBD5E1', fontSize: '15px',
                  fontFamily: 'Space Grotesk', outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customEmail.includes('@')) {
                    handleFallbackSelect(customEmail);
                  }
                }}
              />
              <button 
                onClick={() => handleFallbackSelect(customEmail)}
                disabled={!customEmail.includes('@')}
                style={{
                  padding: '14px 20px', background: customEmail.includes('@') ? '#10B981' : '#CBD5E1',
                  color: '#FFFFFF', border: 'none', borderRadius: '14px',
                  fontWeight: '800', cursor: customEmail.includes('@') ? 'pointer' : 'not-allowed',
                  fontFamily: 'League Spartan', fontSize: '15px',
                  transition: 'background 0.2s ease'
                }}
              >
                Sign In →
              </button>
            </div>

            <p style={{ margin: '16px 0 0', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
              Your name and profile picture will be fetched automatically from your account
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
