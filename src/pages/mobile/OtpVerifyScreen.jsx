import React, { useState, useRef, useEffect } from 'react';
import { verifyPhoneOTP, verifyEmailOTP, sendPhoneOTP, sendEmailOTP } from '../../services/firebaseService';
import otpIllustration from '../../assets/images/splash-screen/otp_verification.png';

const otpFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" fill="none"><rect width="240" height="180" rx="20" fill="%23F1F5F9"/><circle cx="120" cy="80" r="45" fill="%23ECFDF5"/><path d="M105 75L115 85L135 65" stroke="%2310B981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="80" y="130" width="80" height="12" rx="6" fill="%23CBD5E1"/></svg>`;

export default function OtpVerifyScreen({ phoneNumber, otpCode, setOtpCode, onNext, onBack, authMethod, authEmail }) {
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Use 6-digit OTP
  const codeLength = 6;
  const [code, setCode] = useState(Array(codeLength).fill(''));
  const [demoCode, setDemoCode] = useState('');

  const targetEmail = authEmail || localStorage.getItem('cabsy_user_email_otp_target') || 'emperialcabs@gmail.com';

  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    setResendSuccess('');

    try {
      if (authMethod === 'email') {
        const res = await sendEmailOTP(targetEmail);
        if (res?.code) setDemoCode(res.code);
      } else {
        const phone = phoneNumber || localStorage.getItem('cabsy_user_phone') || '';
        await sendPhoneOTP(phone);
      }
      setResendSuccess('A new 6-digit verification code has been sent!');
      setCountdown(60);
      setCode(Array(codeLength).fill(''));
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (e) {
      console.warn('[Resend OTP Error]:', e);
      setError('Failed to resend OTP. Please try again.');
    }
    setResending(false);
  };

  // Auto-initialize Email / Phone OTP code on mount
  useEffect(() => {
    const initOTP = async () => {
      try {
        let activeCode = '';
        if (authMethod === 'email') {
          let raw = sessionStorage.getItem('taxigo_email_otp');
          if (!raw) {
            const res = await sendEmailOTP(targetEmail);
            activeCode = res?.code;
          } else {
            activeCode = JSON.parse(raw)?.code;
          }
        } else {
          const raw = sessionStorage.getItem('taxigo_phone_otp');
          if (raw) activeCode = JSON.parse(raw)?.code;
        }
        if (activeCode && activeCode.length === codeLength) {
          setDemoCode(activeCode);
        }
      } catch (e) {}
    };
    initOTP();
  }, [authMethod, targetEmail]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleInput = (value, idx) => {
    if (value.length > 1) value = value.slice(-1);
    const next = [...code];
    next[idx] = value;
    setCode(next);
    setError('');

    // Auto-advance to next input
    if (value && idx < codeLength - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const full = code.join('');
    if (full.length === codeLength && code.every(d => d !== '')) {
      handleVerify(full);
    }
  }, [code]);

  const handleVerify = async (otpString) => {
    const otp = otpString || code.join('');
    if (otp.length !== codeLength) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      if (authMethod === 'phone') {
        // Firebase Phone Auth verification (real SMS)
        const result = await verifyPhoneOTP(otp);
        if (result.success) {
          // Save phone user data
          const profile = {
            uid: result.user?.uid || 'phone_' + Date.now(),
            phone: result.user?.phone || phoneNumber,
            name: '',
            email: ''
          };
          try {
            localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
            localStorage.setItem('cabsy_user_phone', profile.phone);
          } catch (e) {}
          if (onNext) onNext();
        } else {
          setError(result.error || 'Invalid OTP. Please try again.');
        }
      } else if (authMethod === 'email') {
        // Email OTP verification (client-side)
        const email = authEmail || localStorage.getItem('cabsy_user_email_otp_target') || '';
        const result = verifyEmailOTP(email, otp);
        if (result.success) {
          // Save email user data
          const profile = {
            uid: 'email_' + Date.now(),
            email,
            name: email.split('@')[0].split(/[._-]/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            phone: ''
          };
          try {
            localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
            localStorage.setItem('cabsy_user_email_otp_target', '');
          } catch (e) {}
          if (onNext) onNext();
        } else {
          setError(result.error || 'Invalid OTP. Please try again.');
        }
      } else {
        // Fallback: just proceed (no real verification)
        if (onNext) onNext();
      }
    } catch (e) {
      setError(e?.message || 'Verification failed. Please try again.');
    }

    setVerifying(false);
  };

  const displayTarget = authMethod === 'email'
    ? (authEmail || localStorage.getItem('cabsy_user_email_otp_target') || 'your email')
    : `+91 ${phoneNumber}`;

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">OTP Verification</h2>
      </div>
      <div className="verify-screen-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
          
          {/* OTP Verification 3D Vector Graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '240px', height: '170px', margin: '0 auto' }}>
            <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="otpsBg" x1="0" y1="0" x2="240" y2="170" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F0F9FF" />
                  <stop offset="1" stopColor="#E0F2FE" />
                </linearGradient>
                <filter id="otpShieldShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0284C7" floodOpacity="0.25" />
                </filter>
              </defs>
              <rect width="240" height="170" rx="24" fill="url(#otpsBg)" />
              <circle cx="120" cy="85" r="55" fill="#BAE6FD" fillOpacity="0.5" />
              <g filter="url(#otpShieldShadow)">
                <path d="M120 35 L155 50 V85 C155 110 120 128 120 128 C120 128 85 110 85 85 V50 L120 35 Z" fill="#0284C7" />
                <rect x="108" y="70" width="24" height="20" rx="6" fill="#FFFFFF" />
                <path d="M114 70 V62 C114 58 116 56 120 56 C124 56 126 58 126 62 V70" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="120" cy="80" r="3" fill="#0284C7" />
              </g>
            </svg>
          </div>

          <div>
            <h3 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px 0' }}>
              Enter Verification Code
            </h3>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
              We've sent a 6-digit code to<br/>
              <strong style={{ color: '#0F172A' }}>{displayTarget}</strong>
            </p>
          </div>

          {/* Verification Code Badge */}
          {demoCode && (
            <div 
              style={{ 
                background: '#ECFDF5', 
                border: '1.5px dashed #10B981', 
                borderRadius: '12px', 
                padding: '10px 16px', 
                margin: '2px 0 6px 0', 
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onClick={() => {
                if (demoCode && demoCode.length === codeLength) {
                  setCode(demoCode.split(''));
                }
              }}
              title="Click to auto-fill OTP code"
            >
              <span style={{ fontSize: '13px', color: '#047857', fontWeight: '700' }}>
                🔑 Your Code: <strong style={{ fontSize: '17px', letterSpacing: '4px', color: '#065F46' }}>{demoCode}</strong> <span style={{ fontSize: '11px', textDecoration: 'underline', marginLeft: '4px' }}>(Tap to fill)</span>
              </span>
            </div>
          )}



          {/* 6-digit OTP Input Grid */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '8px 0' }}>
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleInput(e.target.value.replace(/\D/g, ''), idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  width: '46px', height: '54px', textAlign: 'center',
                  fontSize: '22px', fontWeight: '800', fontFamily: 'League Spartan',
                  borderRadius: '14px', border: `2px solid ${val ? '#10B981' : '#CBD5E1'}`,
                  background: val ? '#F0FDF4' : '#F8FAFC',
                  outline: 'none', color: '#0F172A',
                  transition: 'all 0.2s ease',
                  boxShadow: val ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = val ? '#10B981' : '#CBD5E1'; e.target.style.boxShadow = val ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'; }}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626',
              padding: '10px 16px', borderRadius: '12px', fontSize: '13px',
              fontWeight: '600', fontFamily: 'Space Grotesk', width: '100%', boxSizing: 'border-box'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#047857',
              padding: '10px 16px', borderRadius: '12px', fontSize: '13px',
              fontWeight: '600', fontFamily: 'Space Grotesk', width: '100%', boxSizing: 'border-box'
            }}>
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* Resend Timer */}
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            {countdown > 0 ? (
              <>Didn't receive code? <span style={{ color: '#64748B', fontWeight: '700' }}>Resend in 00:{String(countdown).padStart(2, '0')}</span></>
            ) : (
              <>Didn't receive code? <span style={{ color: resending ? '#94A3B8' : '#10B981', fontWeight: '800', cursor: resending ? 'default' : 'pointer' }} onClick={handleResendOTP}>
                {resending ? 'Resending...' : 'Resend OTP'}
              </span></>
            )}
          </p>
        </div>

        {/* Verify Button */}
        <button
          className="taxigo-btn-primary"
          disabled={verifying || code.join('').length < codeLength}
          onClick={() => handleVerify()}
          style={{
            width: '100%', marginTop: '20px',
            opacity: (verifying || code.join('').length < codeLength) ? 0.6 : 1
          }}
        >
          {verifying ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </div>
    </div>
  );
}
