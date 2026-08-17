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
      <div className="taxigo-splash-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px' }}>
        
        {/* Golden Sports Car Silhouette */}
        <div style={{ width: '100px', height: '100px', borderRadius: '28px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(15,23,42,0.25)', marginBottom: '20px', padding: '12px', boxSizing: 'border-box' }}>
          <svg viewBox="0 0 320 110" style={{ width: '100%', height: 'auto' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="
              M 38 72
              C 30 70 26 65 30 58
              C 38 48 52 40 70 34
              C 95 25 130 18 165 12
              C 200 6 240 7 280 14
              C 305 18 318 24 319 28
              C 320 30 318 34 312 36
              C 305 38 298 42 300 48
              C 302 54 300 62 292 70
              C 288 74 282 74 278 68
              C 268 50 242 50 232 68
              C 228 74 220 74 214 73
              C 170 71 130 71 88 73
              C 82 74 74 74 70 68
              C 60 50 34 50 24 68
              C 20 74 12 74 8 72 Z
            " fill="#F59E0B" />

            <path d="
              M 155 18
              C 185 13 230 14 268 20
              C 282 22 295 26 298 28
              C 260 32 210 34 165 35
              C 152 35 142 27 155 18 Z
            " fill="#FFFFFF" />

            <g transform="translate(47, 68)">
              <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
            </g>

            <g transform="translate(255, 68)">
              <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
              <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
            </g>
          </svg>
        </div>

        <h1 style={{ fontFamily: "'League Spartan', sans-serif", fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
          Empire Cab
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: '#64748B', margin: 0, fontWeight: '600' }}>
          Executive Ride Service
        </p>
      </div>
    </div>
  );
}
