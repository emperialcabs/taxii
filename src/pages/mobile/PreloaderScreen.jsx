import React, { useEffect } from 'react';

export default function PreloaderScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="taxigo-preloader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
        
        {/* Golden Sports Car Silhouette (Exact Custom Shape matching user requirement) */}
        <div className="loading-window" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '280px', margin: '0 auto 20px auto' }}>
          <svg viewBox="0 0 320 110" style={{ width: '100%', height: 'auto' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="carGoldGrad" x1="0" y1="0" x2="320" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
              <filter id="carGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#F59E0B" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Speed Lines */}
            <g opacity="0.6">
              <rect x="10" y="45" width="20" height="3" rx="1.5" fill="#F59E0B" />
              <rect x="2" y="58" width="14" height="3" rx="1.5" fill="#F59E0B" />
              <rect x="18" y="70" width="24" height="3" rx="1.5" fill="#F59E0B" />
            </g>

            {/* Main Sports Car Body Path */}
            <g filter="url(#carGlow)">
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
              " fill="url(#carGoldGrad)" />

              {/* Sleek Side Glass Cutout */}
              <path d="
                M 155 18
                C 185 13 230 14 268 20
                C 282 22 295 26 298 28
                C 260 32 210 34 165 35
                C 152 35 142 27 155 18 Z
              " fill="#FFFFFF" />

              {/* Rear Wheel */}
              <g transform="translate(47, 68)">
                <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
                <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                <circle cx="0" cy="0" r="4" fill="#D97706" />
              </g>

              {/* Front Wheel */}
              <g transform="translate(255, 68)">
                <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="4" />
                <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                <circle cx="0" cy="0" r="4" fill="#D97706" />
              </g>
            </g>
          </svg>
        </div>

        <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
          EMPIRE CAB
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', color: '#64748B', margin: 0, fontWeight: '600' }}>
          Loading Executive Experience...
        </p>
      </div>
    </div>
  );
}
