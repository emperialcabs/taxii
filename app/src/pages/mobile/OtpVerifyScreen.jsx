import React from 'react';

export default function OtpVerifyScreen({ phoneNumber, otpCode, setOtpCode, onNext, onBack }) {
  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">OTP Verification</h2>
      </div>
      <div className="verify-screen-body">
        <div>
          <img className="verify-hero-img" src="/assets/images/verify-number/verify-img.png" alt="Verify" />
          <p className="verify-desc-txt">Enter the 4-digit code sent to<br/><strong>+91 {phoneNumber}</strong></p>
          <div className="otp-inputs-grid">
            {otpCode.map((val, idx) => (
              <input 
                key={idx} 
                className="otp-circle-input" 
                type="text" 
                maxLength={1} 
                value={val}
                onChange={(e) => {
                  const newOtp = [...otpCode];
                  newOtp[idx] = e.target.value;
                  setOtpCode(newOtp);
                }}
              />
            ))}
          </div>
          <p className="otp-resend-row">Didn't receive code? <span>Resend in 00:45</span></p>
        </div>
        <button className="taxigo-btn-primary" onClick={onNext}>Verify & Continue</button>
      </div>
    </div>
  );
}
