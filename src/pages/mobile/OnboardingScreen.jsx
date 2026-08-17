import React, { useState } from 'react';

// Slide 1: Request a Ride Vector Graphic (MNC MNC Design with Animated Layers)
const GraphicRequestRide = () => (
  <svg viewBox="0 0 340 270" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="reqSky" x1="0" y1="0" x2="340" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="reqShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.14" />
      </filter>
    </defs>
    <rect width="340" height="270" rx="28" fill="url(#reqSky)" />

    {/* Bus/Transit Shelter Structure */}
    <g transform="translate(60, 35)">
      {/* Shelter Roof */}
      <rect x="0" y="0" width="180" height="18" rx="4" fill="#334155" />
      <rect x="5" y="18" width="170" height="6" fill="#FFAE00" />
      {/* Pillars */}
      <rect x="15" y="24" width="8" height="130" fill="#64748B" />
      <rect x="157" y="24" width="8" height="130" fill="#64748B" />
      {/* Bench */}
      <rect x="25" y="95" width="130" height="8" rx="2" fill="#FFAE00" />
      <rect x="35" y="103" width="6" height="45" fill="#475569" />
      <rect x="139" y="103" width="6" height="45" fill="#475569" />
      {/* Back Glass Panel Grid */}
      <path d="M25 24 V95 M70 24 V95 M115 24 V95 M150 24 V95" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
    </g>

    {/* Plant Pot on Left */}
    <g transform="translate(15, 155)">
      <rect x="16" y="38" width="24" height="32" rx="4" fill="#334155" />
      <path d="M28 38 C10 22 2 -2 28 -12 C54 -2 46 22 28 38 Z" fill="#FF4D4D" />
      <path d="M28 32 C14 18 16 -2 28 -12 Z" fill="#E11D48" />
    </g>

    {/* Floating Location Pin Marker */}
    <g transform="translate(160, 45)" className="ob-animate-float" filter="url(#reqShadow)">
      <path d="M20 0 C8.95 0 0 8.95 0 20 C0 35 20 52 20 52 C20 52 40 35 40 20 C40 8.95 31.05 0 20 0 Z" fill="#FFAE00" />
      <circle cx="20" cy="20" r="8" fill="#FFFFFF" />
    </g>

    {/* Passenger Character Standing on Right */}
    <g transform="translate(230, 80)" className="ob-animate-float-slow">
      <ellipse cx="30" cy="165" rx="26" ry="6" fill="#0F172A" opacity="0.12" />
      {/* Legs */}
      <path d="M16 95 L20 162 H34 L28 95 Z" fill="#334155" />
      <path d="M32 95 L40 162 H54 L44 95 Z" fill="#1E293B" />
      {/* Torso & Backpack */}
      <path d="M12 42 C12 32 46 32 46 42 L40 98 H18 Z" fill="#10B981" />
      <path d="M42 45 C48 45 54 55 54 75 C54 85 48 90 42 90 Z" fill="#047857" />
      {/* Smartphone */}
      <rect x="4" y="48" width="10" height="18" rx="2" fill="#0F172A" transform="rotate(-15 4 48)" />
      {/* Head */}
      <circle cx="28" cy="22" r="12" fill="#FCA5A5" />
      <path d="M20 16 C20 6 40 6 38 16 C38 22 34 26 28 26 C22 26 20 22 20 16 Z" fill="#1E293B" />
    </g>
  </svg>
);

// Slide 2: Vehicle Selection Vector Graphic
const GraphicVehicleSelection = () => (
  <svg viewBox="0 0 340 270" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="vehSky" x1="0" y1="0" x2="340" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="vehPhoneShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
    </defs>
    <rect width="340" height="270" rx="28" fill="url(#vehSky)" />

    {/* Background Wall Shelves */}
    <g opacity="0.35">
      <rect x="25" y="30" width="70" height="6" rx="2" fill="#94A3B8" />
      <rect x="35" y="15" width="8" height="15" fill="#CBD5E1" />
      <rect x="47" y="10" width="12" height="20" fill="#94A3B8" />
    </g>

    {/* Plant Pot on Left */}
    <g transform="translate(15, 155)">
      <rect x="16" y="38" width="24" height="32" rx="4" fill="#334155" />
      <path d="M28 38 C10 22 2 -2 28 -12 C54 -2 46 22 28 38 Z" fill="#FF4D4D" />
      <path d="M28 32 C14 18 16 -2 28 -12 Z" fill="#E11D48" />
    </g>

    {/* Central Smartphone with Map & Vehicle Selection */}
    <g filter="url(#vehPhoneShadow)" transform="translate(95, 12)">
      <rect width="150" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="138" height="233" rx="22" fill="#FFFFFF" />
      <rect x="44" y="10" width="52" height="8" rx="4" fill="#0F172A" />

      {/* Map Graphic at Top of Phone */}
      <rect x="6" y="24" width="138" height="105" fill="#F8FAFC" />
      {/* Map Roads */}
      <path d="M15 35 H135 M40 24 V125 M110 24 V125 M15 85 H135" stroke="#E2E8F0" strokeWidth="6" />
      <path d="M25 45 L70 45 L70 95 L125 95" stroke="#FFAE00" strokeWidth="3" strokeDasharray="4 2" />
      {/* Map Pins */}
      <circle cx="25" cy="45" r="4" fill="#FFAE00" className="ob-animate-pulse" />
      <circle cx="125" cy="95" r="4" fill="#10B981" />

      {/* Vehicle Selection List Panel */}
      <rect x="6" y="125" width="138" height="114" rx="16" fill="#F1F5F9" />
      <text x="75" y="140" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="8" fontWeight="700" fill="#64748B">Choose a ride</text>

      {/* Vehicle Option 1: Cab (Highlighted) */}
      <g transform="translate(12, 146)">
        <rect width="126" height="22" rx="6" fill="#FFFFFF" stroke="#FFAE00" strokeWidth="1.5" />
        <rect x="6" y="5" width="22" height="12" rx="3" fill="#FFAE00" />
        <text x="34" y="14" fontFamily="League Spartan, sans-serif" fontSize="9" fontWeight="800" fill="#0F172A">Cab</text>
        <text x="114" y="14" textAnchor="end" fontFamily="Space Grotesk, sans-serif" fontSize="8" fontWeight="700" fill="#0F172A">₹15</text>
      </g>

      {/* Vehicle Option 2: Flash */}
      <g transform="translate(12, 172)">
        <rect width="126" height="20" rx="6" fill="#FFFFFF" />
        <rect x="6" y="4" width="22" height="12" rx="3" fill="#94A3B8" />
        <text x="34" y="13" fontFamily="League Spartan, sans-serif" fontSize="9" fontWeight="800" fill="#64748B">Flash</text>
        <text x="114" y="13" textAnchor="end" fontFamily="Space Grotesk, sans-serif" fontSize="8" fontWeight="700" fill="#64748B">₹25</text>
      </g>

      {/* Vehicle Option 3: Comfort */}
      <g transform="translate(12, 196)">
        <rect width="126" height="20" rx="6" fill="#FFFFFF" />
        <rect x="6" y="4" width="22" height="12" rx="3" fill="#94A3B8" />
        <text x="34" y="13" fontFamily="League Spartan, sans-serif" fontSize="9" fontWeight="800" fill="#64748B">Comfort</text>
        <text x="114" y="13" textAnchor="end" fontFamily="Space Grotesk, sans-serif" fontSize="8" fontWeight="700" fill="#64748B">₹35</text>
      </g>

      {/* Confirm Ride Golden Button */}
      <rect x="12" y="220" width="126" height="15" rx="5" fill="#FFAE00" />
      <text x="75" y="230" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="8" fontWeight="900" fill="#FFFFFF">Confirm ride</text>
    </g>

    {/* Passenger Character Standing on Right */}
    <g transform="translate(248, 80)" className="ob-animate-float-slow">
      <ellipse cx="25" cy="165" rx="22" ry="6" fill="#0F172A" opacity="0.12" />
      <path d="M12 95 L16 162 H30 L24 95 Z" fill="#334155" />
      <path d="M28 95 L34 162 H48 L38 95 Z" fill="#1E293B" />
      <path d="M10 42 C10 32 42 32 42 42 L36 98 H14 Z" fill="#10B981" />
      <rect x="2" y="48" width="9" height="16" rx="2" fill="#0F172A" transform="rotate(-15 2 48)" />
      <circle cx="24" cy="22" r="11" fill="#FCA5A5" />
      <path d="M16 16 C16 6 34 6 32 16 C32 22 28 26 24 26 C18 26 16 22 16 16 Z" fill="#1E293B" />
    </g>
  </svg>
);

// Slide 3: Live Ride Tracking Vector Graphic
const GraphicLiveTracking = () => (
  <svg viewBox="0 0 340 270" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="trackSky" x1="0" y1="0" x2="340" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="trackShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
    </defs>
    <rect width="340" height="270" rx="28" fill="url(#trackSky)" />

    {/* Plant Pot on Left */}
    <g transform="translate(15, 155)">
      <rect x="16" y="38" width="24" height="32" rx="4" fill="#334155" />
      <path d="M28 38 C10 22 2 -2 28 -12 C54 -2 46 22 28 38 Z" fill="#FF4D4D" />
      <path d="M28 32 C14 18 16 -2 28 -12 Z" fill="#E11D48" />
    </g>

    {/* Central Smartphone displaying Live GPS Map */}
    <g filter="url(#trackShadow)" transform="translate(95, 12)">
      <rect width="150" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="138" height="233" rx="22" fill="#FFFFFF" />
      <rect x="44" y="10" width="52" height="8" rx="4" fill="#0F172A" />

      {/* Live Map Display */}
      <rect x="6" y="24" width="138" height="215" rx="16" fill="#F8FAFC" />
      <path d="M20 40 H130 M45 24 V230 M105 24 V230 M20 120 H130 M20 180 H130" stroke="#E2E8F0" strokeWidth="6" />
      <path d="M30 50 L75 50 L75 140 L115 140" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Animated Taxi Icon moving on Map */}
      <g transform="translate(62, 75)" className="ob-animate-car">
        <rect width="26" height="14" rx="4" fill="#FFAE00" />
        <rect x="4" y="2" width="18" height="6" rx="2" fill="#0F172A" />
        <circle cx="6" cy="14" r="3" fill="#1E293B" />
        <circle cx="20" cy="14" r="3" fill="#1E293B" />
      </g>

      {/* Driver Card at Bottom of Phone */}
      <g transform="translate(12, 170)">
        <rect width="126" height="58" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="24" cy="24" r="14" fill="#CBD5E1" />
        <text x="46" y="22" fontFamily="League Spartan, sans-serif" fontSize="10" fontWeight="800" fill="#0F172A">John Driver</text>
        <text x="46" y="32" fontFamily="Space Grotesk, sans-serif" fontSize="7" fontWeight="600" fill="#64748B">Toyota Camry • 4.9 ★</text>
        <rect x="12" y="44" width="102" height="8" rx="4" fill="#10B981" />
        <text x="63" y="51" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="6" fontWeight="800" fill="#FFFFFF">Arriving in 3 mins</text>
      </g>
    </g>

    {/* Passenger Character Standing on Right */}
    <g transform="translate(248, 80)" className="ob-animate-float-slow">
      <ellipse cx="25" cy="165" rx="22" ry="6" fill="#0F172A" opacity="0.12" />
      <path d="M12 95 L16 162 H30 L24 95 Z" fill="#334155" />
      <path d="M28 95 L34 162 H48 L38 95 Z" fill="#1E293B" />
      <path d="M10 42 C10 32 42 32 42 42 L36 98 H14 Z" fill="#10B981" />
      <rect x="2" y="48" width="9" height="16" rx="2" fill="#0F172A" transform="rotate(-15 2 48)" />
      <circle cx="24" cy="22" r="11" fill="#FCA5A5" />
      <path d="M16 16 C16 6 34 6 32 16 C32 22 28 26 24 26 C18 26 16 22 16 16 Z" fill="#1E293B" />
    </g>
  </svg>
);

// Slide 4: Trip Sharing Vector Graphic
const GraphicTripSharing = () => (
  <svg viewBox="0 0 340 270" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="shareSky" x1="0" y1="0" x2="340" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="shareShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
    </defs>
    <rect width="340" height="270" rx="28" fill="url(#shareSky)" />

    {/* Plant Pot on Left */}
    <g transform="translate(15, 155)">
      <rect x="16" y="38" width="24" height="32" rx="4" fill="#334155" />
      <path d="M28 38 C10 22 2 -2 28 -12 C54 -2 46 22 28 38 Z" fill="#FF4D4D" />
      <path d="M28 32 C14 18 16 -2 28 -12 Z" fill="#E11D48" />
    </g>

    {/* Central Smartphone with Safety Shield & Trip Share Card */}
    <g filter="url(#shareShadow)" transform="translate(95, 12)">
      <rect width="150" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="138" height="233" rx="22" fill="#FFFFFF" />
      <rect x="44" y="10" width="52" height="8" rx="4" fill="#0F172A" />

      {/* Safety Badge Floating inside Phone */}
      <g transform="translate(45, 30)">
        <path d="M30 0 L60 14 V40 C60 62 30 78 30 78 C30 78 0 62 0 40 V14 L30 0 Z" fill="#10B981" />
        <path d="M22 38 L27 43 L38 32" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <text x="75" y="125" textAnchor="middle" fontFamily="League Spartan, sans-serif" fontSize="12" fontWeight="800" fill="#0F172A">Safety First</text>
      <text x="75" y="138" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="7" fontWeight="600" fill="#64748B">Share ride status with contacts</text>

      {/* Contact Sharing List Card */}
      <g transform="translate(14, 150)">
        <rect width="122" height="75" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="20" cy="20" r="10" fill="#FFAE00" />
        <text x="36" y="18" fontFamily="League Spartan, sans-serif" fontSize="9" fontWeight="800" fill="#0F172A">Family Contact</text>
        <text x="36" y="26" fontFamily="Space Grotesk, sans-serif" fontSize="7" stroke="none" fill="#10B981" fontWeight="700">Connected ✓</text>

        <circle cx="20" cy="48" r="10" fill="#334155" />
        <text x="36" y="46" fontFamily="League Spartan, sans-serif" fontSize="9" fontWeight="800" fill="#0F172A">Emergency SOS</text>
        <text x="36" y="54" fontFamily="Space Grotesk, sans-serif" fontSize="7" stroke="none" fill="#64748B" fontWeight="600">Active 24/7</text>
      </g>
    </g>

    {/* Passenger Character Standing on Right */}
    <g transform="translate(248, 80)" className="ob-animate-float-slow">
      <ellipse cx="25" cy="165" rx="22" ry="6" fill="#0F172A" opacity="0.12" />
      <path d="M12 95 L16 162 H30 L24 95 Z" fill="#334155" />
      <path d="M28 95 L34 162 H48 L38 95 Z" fill="#1E293B" />
      <path d="M10 42 C10 32 42 32 42 42 L36 98 H14 Z" fill="#10B981" />
      <rect x="2" y="48" width="9" height="16" rx="2" fill="#0F172A" transform="rotate(-15 2 48)" />
      <circle cx="24" cy="22" r="11" fill="#FCA5A5" />
      <path d="M16 16 C16 6 34 6 32 16 C32 22 28 26 24 26 C18 26 16 22 16 16 Z" fill="#1E293B" />
    </g>
  </svg>
);

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request a Ride",
      desc: "Request a ride get picked up by a nearby community driver.",
      graphic: <GraphicRequestRide />
    },
    {
      title: "Vehicle Selection",
      desc: "Users have the liberty to choose the type of vehicle as per their need.",
      graphic: <GraphicVehicleSelection />
    },
    {
      title: "Live Ride Tracking",
      desc: "Know your driver in advance and be able to view current location in real time on the map.",
      graphic: <GraphicLiveTracking />
    },
    {
      title: "Trip Sharing",
      desc: "Passengers can share their ride details with family and friends for safety reasons.",
      graphic: <GraphicTripSharing />
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="onboarding-screen-container" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        
        {/* Vector Object Artwork Header */}
        <div className="onboarding-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '260px', padding: '10px 0' }}>
          <div key={onboardingStep} style={{ width: '100%', maxWidth: '340px', height: '270px', animation: 'heroSlideIn 0.3s ease' }}>
            {currentSlide.graphic}
          </div>
        </div>

        {/* Text & Content */}
        <div className="onboarding-text-box" style={{ textAlign: 'center', padding: '0 10px' }}>
          <h2 style={{ 
            fontFamily: 'League Spartan, sans-serif', 
            fontSize: '30px', 
            fontWeight: '800', 
            color: '#0F172A', 
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px'
          }}>
            {currentSlide.title}
          </h2>
          
          <p style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: '15px', 
            color: '#64748B', 
            lineHeight: '1.6', 
            margin: '0 auto 24px auto',
            maxWidth: '320px'
          }}>
            {currentSlide.desc}
          </p>

          {/* Active Step Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {onboardingSlides.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  height: '8px',
                  width: idx === onboardingStep ? '28px' : '8px',
                  borderRadius: '4px',
                  background: idx === onboardingStep ? '#1E293B' : '#CBD5E1',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <button 
            type="button"
            onClick={onFinish}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '700',
              color: '#0F172A',
              cursor: 'pointer',
              padding: '10px 16px'
            }}
          >
            Skip
          </button>

          <button 
            type="button"
            onClick={() => {
              if (onboardingStep < onboardingSlides.length - 1) {
                setOnboardingStep(prev => prev + 1);
              } else {
                onFinish();
              }
            }}
            style={{
              background: '#FFAE00',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 36px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255, 174, 0, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            {onboardingStep === onboardingSlides.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>

      </div>
    </div>
  );
}
