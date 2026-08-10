import React, { useEffect } from 'react';

export default function PreloaderScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="real-mobile-app">
      <div className="taxigo-preloader-container">
        <div className="loading-window">
          <svg viewBox="0 0 160 70" className="preloader-car-svg">
            <defs>
              <linearGradient id="taxiBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFAA01" />
                <stop offset="100%" stopColor="#FF9100" />
              </linearGradient>
            </defs>
            
            {/* Animated Speed Lines */}
            <line className="svg-strike s1" x1="0" y1="28" x2="18" y2="28" stroke="#FFAA01" strokeWidth="2.5" strokeLinecap="round" />
            <line className="svg-strike s2" x1="5" y1="38" x2="25" y2="38" stroke="#FFAA01" strokeWidth="2" strokeLinecap="round" />
            <line className="svg-strike s3" x1="0" y1="48" x2="15" y2="48" stroke="#FFAA01" strokeWidth="2" strokeLinecap="round" />
            <line className="svg-strike s4" x1="60" y1="58" x2="80" y2="58" stroke="#FFAA01" strokeWidth="2" strokeLinecap="round" />

            {/* Main Car Body Group */}
            <g className="svg-car-body">
              {/* Rear Spoiler */}
              <path d="M 22 28 L 30 22 L 34 28 Z" fill="#FFAA01" />

              {/* Sleek Aerodynamic Body */}
              <path d="M 24 35 C 24 35, 34 18, 52 18 L 94 18 C 108 18, 120 28, 134 35 L 142 37 C 146 39, 146 44, 140 46 L 26 46 C 22 46, 22 38, 24 35 Z" fill="url(#taxiBodyGrad)" />

              {/* White Glass Window Cutout */}
              <path d="M 52 21 L 88 21 C 98 21, 106 28, 114 34 L 52 34 Z" fill="#FFFFFF" />

              {/* Window Pillar Divider */}
              <line x1="73" y1="21" x2="73" y2="34" stroke="#FFAA01" strokeWidth="2.5" />

              {/* Rear Wheel Assembly */}
              <g className="svg-wheel-group" transform="translate(42, 46)">
                <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#FFAA01" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#FFAA01" />
                <path d="M -8 0 L 8 0 M 0 -8 L 0 8 M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#FFAA01" strokeWidth="1.5" className="spinning-spokes" />
              </g>

              {/* Front Wheel Assembly */}
              <g className="svg-wheel-group" transform="translate(110, 46)">
                <circle cx="0" cy="0" r="10" fill="#1E293B" stroke="#FFAA01" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#FFAA01" />
                <path d="M -8 0 L 8 0 M 0 -8 L 0 8 M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#FFAA01" strokeWidth="1.5" className="spinning-spokes" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
