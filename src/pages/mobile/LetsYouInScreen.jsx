import React from 'react';

export default function LetsYouInScreen({ phoneNumber, setPhoneNumber, onNext, onBack }) {
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
          <button className="let-you-signin-btn" onClick={onNext} style={{ marginTop: '20px' }}>Sign In with OTP</button>
        </div>
        <p className="let-you-footer-txt">Don’t have an account? <span onClick={onNext}>Sign up</span></p>
      </div>
    </div>
  );
}
