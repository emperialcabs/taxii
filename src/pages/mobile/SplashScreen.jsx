import React, { useEffect } from 'react';
import { EmperialCabsOfficialLogo } from './PreloaderScreen';

export default function SplashScreen({ onNext }) {
  useEffect(() => {
    // Show for exactly 2 seconds (2000ms) as requested
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div 
      className="emperial-cabs-preloader-container" 
      onClick={onNext}
      style={{ 
        cursor: 'pointer',
        background: '#FFFFFF', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
        padding: '24px',
        boxSizing: 'border-box',
        zIndex: 9999
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center',
          margin: 'auto',
          width: '100%',
          maxWidth: '420px'
        }}
      >
        {/* Official EMPERIAL CABS Company Logo */}
        <EmperialCabsOfficialLogo />

        {/* Tagline */}
        <p 
          style={{ 
            fontFamily: "'Space Grotesk', sans-serif", 
            fontSize: '17px', 
            color: '#64748B', 
            margin: '8px 0 0 0', 
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}
        >
          As comfortable as you are
        </p>
      </div>
    </div>
  );
}
