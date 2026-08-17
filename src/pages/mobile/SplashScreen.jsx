import React, { useEffect } from 'react';

export default function SplashScreen({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="real-mobile-app" onClick={onNext} style={{ cursor: 'pointer', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="emperial-cabs-splash-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px' }}>
        
        {/* Official EMPERIAL CABS Detailed Logo */}
        <div style={{ width: '100%', maxWidth: '280px', marginBottom: '24px' }}>
          <img src="/assets/images/logo.svg" alt="EMPERIAL CABS" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.12))' }} />
        </div>

        <h1 style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
          EMPERIAL CABS
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#64748B', margin: 0, fontWeight: '600' }}>
          Executive Ride Service
        </p>
      </div>
    </div>
  );
}
