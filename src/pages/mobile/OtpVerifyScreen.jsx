import React, { useState, useRef, useEffect } from 'react';
import { verifyPhoneOTP, verifyEmailOTP, sendPhoneOTP, sendEmailOTP } from '../../services/firebaseService';
import { ShieldCheck, Zap, CheckCircle2, ArrowLeft } from 'lucide-react';
import otpIllustration from '../../assets/images/splash-screen/otp_verification.png';
import otpVerifyImg from '../../assets/images/onboarding/03_verification.png';

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
          const defaultName = email.split('@')[0].split(/[._-]/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          
          // Check if profile already exists in localStorage or Cloud DB
          let existingProfile = null;
          try {
            const raw = localStorage.getItem('cabsy_user_profile');
            if (raw) existingProfile = JSON.parse(raw);
          } catch (e) {}

          const profile = {
            uid: existingProfile?.uid || 'email_' + Date.now(),
            email,
            name: existingProfile?.name || defaultName,
            phone: existingProfile?.phone || ''
          };

          try {
            localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
            localStorage.setItem('taxigo_profile_completed', 'true');
            localStorage.setItem('taxigo_onboarded', 'true');
            localStorage.setItem('cabsy_user_email_otp_target', '');
            window.dispatchEvent(new Event('storage'));
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
      <div className="white-header-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="header-back-arrow" onClick={onBack} style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F172A' }}>
          <ArrowLeft size={18} />
        </button>
        <h2 className="white-header-title">OTP Verification</h2>
      </div>
      <div className="verify-screen-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
          
          {/* OTP Verification Animated Vector Object */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '300px', height: '220px', margin: '0 auto' }}>
            <svg viewBox="0 0 320 230" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="otpMonitorBg" x1="0" y1="0" x2="320" y2="230" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FAFAFA" />
                  <stop offset="1" stopColor="#F1F5F9" />
                </linearGradient>
                <linearGradient id="goldShield" x1="230" y1="10" x2="300" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFB800" />
                  <stop offset="1" stopColor="#FF9500" />
                </linearGradient>
                <filter id="otpMonitorShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.14" />
                </filter>
                <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#FFB800" floodOpacity="0.4" />
                </filter>
              </defs>

              <rect width="320" height="230" rx="28" fill="url(#otpMonitorBg)" />

              {/* Background Plant */}
              <g transform="translate(240, 130)">
                <rect x="14" y="32" width="20" height="25" rx="4" fill="#334155" />
                <path d="M24 32 C10 20 2 0 24 -8 C46 0 38 20 24 32 Z" fill="#FF4D4D" />
                <path d="M24 28 C12 16 14 0 24 -8 Z" fill="#E11D48" />
              </g>

              {/* Verification Screen Monitor Window */}
              <g filter="url(#otpMonitorShadow)" transform="translate(30, 20)">
                <rect width="210" height="135" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                <rect x="0" y="0" width="210" height="22" rx="14" fill="#334155" />
                <circle cx="14" cy="11" r="3" fill="#FF4D4D" />
                <circle cx="24" cy="11" r="3" fill="#FFB800" />
                <circle cx="34" cy="11" r="3" fill="#10B981" />

                {/* Padlock Icon */}
                <g transform="translate(98, 30)">
                  <rect x="2" y="7" width="10" height="9" rx="2" fill="#FFB800" />
                  <path d="M4 7 V4 C4 2.5 5.5 1 7 1 C8.5 1 10 2.5 10 4 V7" stroke="#FF9500" strokeWidth="1.5" fill="none" />
                </g>

                {/* Verification Label */}
                <text x="105" y="55" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="12" fontWeight="800" fill="#0F172A">Verification</text>

                {/* 4 Input Slots */}
                <g transform="translate(68, 70)">
                  <rect x="0" y="0" width="16" height="20" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="20" y="0" width="16" height="20" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="40" y="0" width="16" height="20" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="60" y="0" width="16" height="20" rx="4" fill="#FFFBEB" stroke="#FFB800" strokeWidth="1" />
                </g>

                {/* Golden Submit Button */}
                <rect x="88" y="102" width="34" height="12" rx="4" fill="#FFAE00" />
              </g>

              {/* Animated Floating Golden Shield Badge */}
              <g filter="url(#shieldGlow)" transform="translate(230, 15)" className="ob-animate-float">
                <path d="M30 0 L60 15 V45 C60 68 30 85 30 85 C30 85 0 68 0 45 V15 L30 0 Z" fill="url(#goldShield)" />
                <circle cx="30" cy="38" r="15" fill="#1E293B" />
                <path d="M22 38 L27 43 L38 32" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Animated Character on Left */}
              <g transform="translate(5, 90)" className="ob-animate-float-slow">
                <path d="M10 50 L45 35 L75 80 L35 95 Z" fill="#334155" />
                <path d="M25 50 L10 100 H20 L35 50 Z" fill="#1E293B" />
                <path d="M28 25 C28 15 58 15 55 25 L45 75 H20 Z" fill="#10B981" />
                <circle cx="42" cy="10" r="10" fill="#FCA5A5" />
                <path d="M34 5 C34 -2 52 -2 50 5 C50 11 46 15 42 15 Z" fill="#1E293B" />
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
