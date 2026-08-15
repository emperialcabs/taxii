import React, { useState } from 'react';
import db from '../../services/dbService';
import { signInWithGoogle } from '../../services/firebaseService';
import { saveCustomerToMySQL, loadAllInquiriesFromMySQL } from '../../services/mysqlService';

export default function LetsYouInScreen({ phoneNumber, setPhoneNumber, onNext, onGoogleSignIn, onBack }) {
  const [loading, setLoading] = useState(false);

  // ── After login: save profile to Hostinger MySQL Database AND restore past trips ──
  const syncWithMySQL = async (profile) => {
    try {
      // 1. Save profile directly to Hostinger MySQL Database
      await saveCustomerToMySQL(profile).catch(() => {});

      // 2. Pull user's past trip history from Hostinger MySQL Database
      const mysqlInquiries = await loadAllInquiriesFromMySQL().catch(() => []);
      const userPhoneKey = (profile.phone || '').replace(/\D/g, '');
      const userEmailKey = (profile.email || '').toLowerCase().trim();

      const userInquiries = (mysqlInquiries || []).filter(i => {
        const iPhone = (i.customerPhone || '').replace(/\D/g, '');
        const iEmail = (i.customerEmail || '').toLowerCase().trim();
        return (userPhoneKey && iPhone && userPhoneKey === iPhone) || (userEmailKey && iEmail && userEmailKey === iEmail);
      });

      if (userInquiries && userInquiries.length > 0) {
        const localRaw = localStorage.getItem('cabsy_inquiries');
        const localList = localRaw ? JSON.parse(localRaw) : [];
        const existingIds = new Set(localList.map(i => i.id).filter(Boolean));
        const fresh = userInquiries.filter(i => !existingIds.has(i.id));
        const merged = [...fresh, ...localList];
        localStorage.setItem('cabsy_inquiries', JSON.stringify(merged));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.warn('MySQL sync on login failed:', e);
    }
  };

  const [authError, setAuthError] = useState(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const googleUser = await signInWithGoogle();

      if (!googleUser || !googleUser.email) {
        throw new Error("Could not obtain user email from Google.");
      }

      const realProfile = {
        id: 'CUST-' + Math.floor(10000 + Math.random() * 89999),
        name: googleUser.name || 'Google User',
        email: googleUser.email,
        phone: phoneNumber || '',
        photoURL: googleUser.photoURL || null,
        uid: googleUser.uid || null,
        profession: 'Rider',
        area: 'Bhavnagar, Gujarat',
        registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Active',
        lastLogin: new Date().toISOString()
      };

      try {
        localStorage.setItem('cabsy_user_profile', JSON.stringify(realProfile));
        localStorage.setItem('taxigo_onboarded', 'true');
        
        // 1. Save directly to Hostinger MySQL Database
        await saveCustomerToMySQL(realProfile).catch(() => {});

        // 2. Save into dbService local registry
        db.saveCustomer(realProfile);

        // 3. Dispatch real-time events for Admin Portal customer directory sync
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'CUSTOMER_UPDATED', data: realProfile } }));

        // 4. Restore past trips from MySQL
        await syncWithMySQL(realProfile);
      } catch(e) {}

      setLoading(false);
      if (onGoogleSignIn) {
        onGoogleSignIn(realProfile);
      } else {
        onNext();
      }
    } catch (err) {
      setLoading(false);
      console.warn("Google Auth error:", err);
      const msg = err?.code === 'auth/popup-closed-by-user' 
        ? 'Sign-in cancelled.' 
        : 'Google Sign-in failed. Please sign in with your mobile number.';
      setAuthError(msg);
    }
  };

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
          <h1 className="let-you-title">Let’s You In</h1>

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
            {loading ? 'Opening Google Sign-In...' : 'Continue with Google'}
          </button>

          {authError && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '13px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {authError}
            </div>
          )}

          <p className="let-you-footer-txt" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
            Don’t have an account? <span style={{ color: '#10B981', fontWeight: '800', cursor: 'pointer' }} onClick={onNext}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
