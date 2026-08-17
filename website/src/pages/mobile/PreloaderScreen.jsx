import React, { useEffect } from 'react';

export default function PreloaderScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="taxigo-preloader-container">
        <div className="loading-window">
          <svg viewBox="0 0 180 80" className="taxigo-exact-car-svg">
            {/* Speed Lines */}
            <g className="car-speed-lines">
              <rect className="dash dash1" x="2" y="38" width="12" height="2.5" rx="1.2" fill="#FFAA01" />
              <rect className="dash dash2" x="14" y="46" width="16" height="3" rx="1.5" fill="#FFAA01" />
              <rect className="dash dash3" x="6" y="54" width="10" height="2.5" rx="1.2" fill="#FFAA01" />
              <rect className="dash dash4" x="72" y="68" width="18" height="3" rx="1.5" fill="#FFAA01" />
            </g>

            {/* Exact Silhouette Taxi Body */}
            <g className="car-main-body">
              {/* Main Yellow Body Outer Path */}
              <path d="
                M 35 44
                L 35 28
                L 44 28
                C 47 28, 50 24, 55 19
                C 65 10, 88 10, 102 19
                L 122 28
                C 134 32, 146 39, 154 45
                C 157 48, 156 54, 150 56
                L 138 56
                A 12 12 0 0 0 114 56
                L 72 56
                A 12 12 0 0 0 48 56
                L 38 56
                C 35 56, 35 50, 35 44 Z
              " fill="#FFAA01" />

              {/* Exact White Glass Window */}
              <path d="
                M 73 19
                L 98 19
                C 106 19, 115 24, 121 29
                L 67 29
                C 67 24, 70 19, 73 19 Z
              " fill="#FFFFFF" />

              {/* Rear Wheel Assembly */}
              <g className="car-wheel rear-wheel" transform="translate(60, 56)">
                <circle cx="0" cy="0" r="11" fill="#2E3440" stroke="#FFAA01" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="#FFAA01" strokeWidth="1.5" strokeDasharray="5, 3" className="spinning-wheel-rim" />
                <circle cx="0" cy="0" r="3.5" fill="#FFAA01" />
              </g>

              {/* Front Wheel Assembly */}
              <g className="car-wheel front-wheel" transform="translate(126, 56)">
                <circle cx="0" cy="0" r="11" fill="#2E3440" stroke="#FFAA01" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="none" stroke="#FFAA01" strokeWidth="1.5" strokeDasharray="5, 3" className="spinning-wheel-rim" />
                <circle cx="0" cy="0" r="3.5" fill="#FFAA01" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
