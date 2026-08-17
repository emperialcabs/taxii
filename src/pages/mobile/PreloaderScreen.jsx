import React, { useEffect } from 'react';

// Exact User Provided CarShape Component for Loading Screen
export function CarShape() {
  return (
    <div className="car-wrapper" style={{ width: '100%', maxWidth: '300px', margin: '0 auto 24px auto' }}>
      <svg
        viewBox="0 0 1259 414"
        xmlns="http://www.w3.org/2000/svg"
        className="car-svg ob-animate-car"
        aria-label="Yellow car"
        role="img"
        style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 12px 24px rgba(255, 184, 0, 0.3))' }}
      >
        {/* Main car body */}
        <path
          d="
            M 123 311
            C 138 294 148 278 146 256
            C 144 236 130 218 127 204
            C 125 193 137 181 158 171
            C 190 155 228 145 275 139
            C 338 131 405 140 462 131
            C 509 123 548 99 594 81
            C 658 56 725 43 788 48
            C 891 55 1014 80 1125 108
            C 1170 119 1207 130 1244 145

            C 1240 168 1232 190 1218 209
            C 1204 228 1185 242 1175 260
            C 1167 275 1166 292 1173 309

            L 1138 309

            C 1125 268 1087 239 1039 239
            C 990 239 950 267 938 309

            L 447 309

            C 435 268 398 239 350 239
            C 302 239 266 269 254 309

            L 158 309
            C 142 309 130 309 123 311
            Z
          "
          fill="#FFB800"
        />

        {/* Upper roof/window cutout */}
        <path
          d="
            M 465 130
            C 514 123 553 101 600 82
            C 659 58 726 47 789 52
            C 887 59 1005 82 1115 109
            C 1061 105 1007 101 950 99
            C 866 95 783 97 710 105
            C 617 114 535 130 465 130
            Z
          "
          fill="white"
        />

        {/* Lower side highlight */}
        <path
          d="
            M 651 278
            C 730 268 815 267 899 269
            L 899 285
            C 817 284 734 286 655 291
            Z
          "
          fill="white"
        />

        {/* Rear wheel */}
        <circle
          cx="350"
          cy="270"
          r="91"
          fill="#FFB800"
        />

        <circle
          cx="350"
          cy="270"
          r="73"
          fill="white"
        />

        <circle
          cx="350"
          cy="270"
          r="56"
          fill="#FFB800"
        />

        <circle
          cx="350"
          cy="270"
          r="43"
          fill="white"
        />

        {/* Rear wheel bottom detail */}
        <path
          d="M 307 317 C 321 331 339 338 358 338 C 378 338 394 330 407 318"
          fill="none"
          stroke="#FFB800"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Front wheel */}
        <circle
          cx="1039"
          cy="270"
          r="91"
          fill="#FFB800"
        />

        <circle
          cx="1039"
          cy="270"
          r="73"
          fill="white"
        />

        <circle
          cx="1039"
          cy="270"
          r="56"
          fill="#FFB800"
        />

        <circle
          cx="1039"
          cy="270"
          r="43"
          fill="white"
        />

        {/* Front wheel bottom detail */}
        <path
          d="M 996 317 C 1010 331 1028 338 1047 338 C 1067 338 1083 330 1096 318"
          fill="none"
          stroke="#FFB800"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function PreloaderScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="emperial-cabs-preloader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px' }}>
        
        {/* Exact User Provided CarShape Component */}
        <CarShape />

        <img src="/assets/images/logo.svg" alt="EMPERIAL CABS" style={{ height: '48px', width: 'auto', marginBottom: '12px' }} />
        
        <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
          EMPERIAL CABS
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#64748B', margin: 0, fontWeight: '600' }}>
          Loading Executive Experience...
        </p>
      </div>
    </div>
  );
}
