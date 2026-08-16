import React, { useState } from 'react';

// Dynamic 3D Illustrated SVG Components for Onboarding Slides
const OnboardingGraphic1 = () => (
  <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="ob1Bg" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EFF6FF" />
        <stop offset="1" stopColor="#DBEAFE" />
      </linearGradient>
      <linearGradient id="carGrad1" x1="60" y1="120" x2="260" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="pinGrad" x1="160" y1="30" x2="160" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF4444" />
        <stop offset="1" stopColor="#DC2626" />
      </linearGradient>
      <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#F59E0B" floodOpacity="0.25" />
      </filter>
      <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#EF4444" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Card Container Background */}
    <rect width="320" height="260" rx="28" fill="url(#ob1Bg)" />
    {/* Animated Radar Pulse Rings */}
    <circle cx="160" cy="120" r="85" fill="#3B82F6" fillOpacity="0.06" />
    <circle cx="160" cy="120" r="60" fill="#3B82F6" fillOpacity="0.08" />
    {/* Map Path Line */}
    <path d="M50 190 Q120 150 160 110 T270 60" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
    {/* 3D Location Marker Pin */}
    <g filter="url(#pinShadow)">
      <path d="M160 40 C140 40 125 55 125 75 C125 100 160 130 160 130 C160 130 195 100 195 75 C195 55 180 40 160 40 Z" fill="url(#pinGrad)" />
      <circle cx="160" cy="72" r="12" fill="#FFFFFF" />
      <circle cx="160" cy="72" r="6" fill="#EF4444" />
    </g>
    {/* 3D Yellow Taxi Car */}
    <g filter="url(#glow1)">
      {/* Car Body Base */}
      <rect x="70" y="150" width="180" height="42" rx="16" fill="url(#carGrad1)" />
      {/* Cabin/Roof */}
      <path d="M110 150 L135 124 H185 L210 150 Z" fill="#1E293B" />
      {/* Taxi Roof Sign */}
      <rect x="145" y="114" width="30" height="10" rx="4" fill="#FBFB15" />
      <text x="160" y="122" textAnchor="middle" fontSize="7" fontWeight="900" fill="#000000">TAXI</text>
      {/* Windows */}
      <path d="M116 148 L137 128 H157 V148 Z" fill="#93C5FD" fillOpacity="0.8" />
      <path d="M163 148 V128 H183 L204 148 Z" fill="#93C5FD" fillOpacity="0.8" />
      {/* Headlight & Taillight */}
      <circle cx="242" cy="168" r="5" fill="#FEF08A" />
      <circle cx="78" cy="168" r="4" fill="#EF4444" />
      {/* Wheels */}
      <circle cx="105" cy="192" r="14" fill="#0F172A" />
      <circle cx="105" cy="192" r="6" fill="#94A3B8" />
      <circle cx="215" cy="192" r="14" fill="#0F172A" />
      <circle cx="215" cy="192" r="6" fill="#94A3B8" />
    </g>
  </svg>
);

const OnboardingGraphic2 = () => (
  <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="ob2Bg" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0FDF4" />
        <stop offset="1" stopColor="#DCFCE7" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="60" y1="50" x2="260" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F8FAFC" />
      </linearGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#166534" floodOpacity="0.12" />
      </filter>
    </defs>
    <rect width="320" height="260" rx="28" fill="url(#ob2Bg)" />
    {/* Driver Profile Card */}
    <g filter="url(#cardShadow)">
      <rect x="50" y="35" width="220" height="190" rx="24" fill="url(#cardGrad)" stroke="#22C55E" strokeWidth="2" strokeOpacity="0.3" />
      {/* Driver Avatar Circle */}
      <circle cx="160" cy="90" r="36" fill="#166534" />
      <circle cx="160" cy="80" r="14" fill="#FEF08A" />
      <path d="M136 114 C136 100 146 94 160 94 C174 94 184 100 184 114 Z" fill="#3B82F6" />
      {/* Verified Badge Icon */}
      <circle cx="186" cy="110" r="12" fill="#22C55E" />
      <path d="M181 110 L184 113 L191 106" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Driver Name & Taxi ID */}
      <text x="160" y="146" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0F172A">Rajesh Kumar</text>
      <text x="160" y="164" textAnchor="middle" fontSize="12" fontWeight="600" fill="#15803D">GJ-01 Swift Dzire • 4.9★</text>
      {/* Rating Stars Bar */}
      <g fill="#F59E0B" transform="translate(105, 178)">
        <text x="0" y="12" fontSize="14">★★★★★</text>
      </g>
    </g>
  </svg>
);

const OnboardingGraphic3 = () => (
  <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="ob3Bg" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAF5FF" />
        <stop offset="1" stopColor="#F3E8FF" />
      </linearGradient>
      <filter id="gpsShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7E22CE" floodOpacity="0.2" />
      </filter>
    </defs>
    <rect width="320" height="260" rx="28" fill="url(#ob3Bg)" />
    {/* Map Grid Pattern Background */}
    <path d="M40 40 H280 M40 90 H280 M40 140 H280 M40 190 H280 M40 240 H280" stroke="#E9D5FF" strokeWidth="1.5" />
    <path d="M80 20 V240 M140 20 V240 M200 20 V240 M260 20 V240" stroke="#E9D5FF" strokeWidth="1.5" />
    {/* Active GPS Route Highlighting */}
    <path d="M70 200 C110 200 110 110 160 110 C210 110 210 50 250 50" stroke="#9333EA" strokeWidth="6" strokeLinecap="round" />
    {/* Start Location Pin */}
    <circle cx="70" cy="200" r="10" fill="#9333EA" />
    <circle cx="70" cy="200" r="4" fill="#FFFFFF" />
    {/* Destination Pin */}
    <g filter="url(#gpsShadow)">
      <path d="M250 25 C240 25 232 33 232 43 C232 58 250 75 250 75 C250 75 268 58 268 43 C268 33 260 25 250 25 Z" fill="#EC4899" />
      <circle cx="250" cy="41" r="6" fill="#FFFFFF" />
    </g>
    {/* Animated Live Taxi Icon Moving on Route */}
    <g filter="url(#gpsShadow)" transform="translate(142, 92)">
      <rect x="0" y="0" width="36" height="36" rx="10" fill="#F59E0B" />
      <path d="M8 22 H28 M12 14 L16 10 H20 L24 14 Z" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="25" r="3" fill="#0F172A" />
      <circle cx="23" cy="25" r="3" fill="#0F172A" />
    </g>
  </svg>
);

const OnboardingGraphic4 = () => (
  <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '250px' }}>
    <defs>
      <linearGradient id="ob4Bg" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
      <filter id="fleetShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#B45309" floodOpacity="0.18" />
      </filter>
    </defs>
    <rect width="320" height="260" rx="28" fill="url(#ob4Bg)" />
    {/* Vehicle Cards Stack */}
    {/* Card 1: Sedan */}
    <g filter="url(#fleetShadow)">
      <rect x="40" y="30" width="240" height="60" rx="16" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
      <rect x="52" y="42" width="36" height="36" rx="10" fill="#FEF3C7" />
      <text x="70" y="65" textAnchor="middle" fontSize="18">🚕</text>
      <text x="102" y="55" fontSize="15" fontWeight="800" fill="#0F172A">Sedan (Swift / Dzire)</text>
      <text x="102" y="74" fontSize="12" fontWeight="600" fill="#D97706">4 Seats • Most Popular</text>
      <text x="256" y="64" textAnchor="end" fontSize="15" fontWeight="900" fill="#15803D">₹11/km</text>
    </g>
    {/* Card 2: SUV */}
    <g filter="url(#fleetShadow)">
      <rect x="40" y="102" width="240" height="60" rx="16" fill="#FFFFFF" />
      <rect x="52" y="114" width="36" height="36" rx="10" fill="#EFF6FF" />
      <text x="70" y="137" textAnchor="middle" fontSize="18">🚙</text>
      <text x="102" y="127" fontSize="15" fontWeight="800" fill="#0F172A">SUV (Ertiga / XL6)</text>
      <text x="102" y="146" fontSize="12" fontWeight="600" fill="#2563EB">6 Seats • Family & Outstation</text>
      <text x="256" y="136" textAnchor="end" fontSize="15" fontWeight="900" fill="#15803D">₹14/km</text>
    </g>
    {/* Card 3: Premium Innova */}
    <g filter="url(#fleetShadow)">
      <rect x="40" y="174" width="240" height="60" rx="16" fill="#FFFFFF" />
      <rect x="52" y="186" width="36" height="36" rx="10" fill="#F0FDF4" />
      <text x="70" y="209" textAnchor="middle" fontSize="18">🚘</text>
      <text x="102" y="199" fontSize="15" fontWeight="800" fill="#0F172A">Luxury (Innova Crysta)</text>
      <text x="102" y="218" fontSize="12" fontWeight="600" fill="#166534">7 Seats • Premium Executive</text>
      <text x="256" y="208" textAnchor="end" fontSize="15" fontWeight="900" fill="#15803D">₹18/km</text>
    </g>
  </svg>
);

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request Ride",
      desc: "Request a ride and get picked up by a nearby certified driver instantly.",
      graphic: <OnboardingGraphic1 />
    },
    {
      title: "Confirm Your Driver",
      desc: "Huge network of certified professional drivers with top ratings.",
      graphic: <OnboardingGraphic2 />
    },
    {
      title: "Track Your Ride",
      desc: "Real-time GPS movement tracking from pickup point straight to destination.",
      graphic: <OnboardingGraphic3 />
    },
    {
      title: "Choose Vehicle Class",
      desc: "Select your preferred ride class from Swift, Ertiga to Luxury Innova.",
      graphic: <OnboardingGraphic4 />
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app">
      <div className="onboarding-screen-container">
        <div className="onboarding-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px', padding: '16px' }}>
          {currentSlide.graphic}
        </div>
        <div className="onboarding-text-box">
          <h2 className="onboarding-title">{currentSlide.title}</h2>
          <p className="onboarding-desc">{currentSlide.desc}</p>
          <div className="onboarding-dots">
            {onboardingSlides.map((_, idx) => (
              <div key={idx} className={`dot-item ${idx === onboardingStep ? 'active' : ''}`} />
            ))}
          </div>
        </div>
        <div className="onboarding-action-bar">
          <button className="btn-skip" onClick={onFinish}>Skip</button>
          <button 
            className="btn-next-finish"
            onClick={() => {
              if (onboardingStep < onboardingSlides.length - 1) {
                setOnboardingStep(prev => prev + 1);
              } else {
                onFinish();
              }
            }}
          >
            {onboardingStep === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
