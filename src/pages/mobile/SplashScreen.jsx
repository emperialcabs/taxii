import React, { useEffect } from 'react';

export default function SplashScreen({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onNext) onNext();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="real-mobile-app" onClick={onNext} style={{ cursor: 'pointer' }}>
      <div className="taxigo-splash-container">
        <div style={{ width: '84px', height: '84px', borderRadius: '24px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', marginBottom: '16px' }}>
          🚖
        </div>
        <h1 style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
          Empire Cab
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#64748B', margin: 0 }}>
          Executive Ride Service
        </p>
      </div>
    </div>
  );
}
