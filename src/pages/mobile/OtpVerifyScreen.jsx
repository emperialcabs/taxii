import React, { useState, useRef, useEffect } from 'react';
import { verifyPhoneOTP, verifyEmailOTP } from '../../services/firebaseService';

export default function OtpVerifyScreen({ phoneNumber, otpCode, setOtpCode, onNext, onBack, authMethod, authEmail }) {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Use 6-digit OTP
  const codeLength = 6;
  const [code, setCode] = useState(Array(codeLength).fill(''));

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
          
          {/* OTP Icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            fontSize: '36px'
          }}>
            {authMethod === 'email' ? '✉️' : '📱'}
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
              background: '#FEF2F2', color: '#DC2626', padding: '10px 16px',
              borderRadius: '12px', fontSize: '13px', fontWeight: '600',
              fontFamily: 'Space Grotesk', width: '100%', textAlign: 'center'
            }}>⚠️ {error}</div>
          )}

          {/* Resend Timer */}
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            {countdown > 0 ? (
              <>Didn't receive code? <span style={{ color: '#64748B', fontWeight: '700' }}>Resend in 00:{String(countdown).padStart(2, '0')}</span></>
            ) : (
              <>Didn't receive code? <span style={{ color: '#10B981', fontWeight: '800', cursor: 'pointer' }} onClick={onBack}>Resend OTP</span></>
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
