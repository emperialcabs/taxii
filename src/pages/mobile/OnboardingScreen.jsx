import React, { useState } from 'react';

// 2026 AI-Infused MNC Vector Graphic 1: Request a Ride (Bus Stop & Passenger)
const OnboardingGraphic1 = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="skyGrad1" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="shelterGold" x1="40" y1="40" x2="280" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB800" />
        <stop offset="1" stopColor="#FF9500" />
      </linearGradient>
      <linearGradient id="benchGold" x1="60" y1="120" x2="240" y2="150" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <filter id="shadowG1" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
      <filter id="goldGlow1" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#FF9500" floodOpacity="0.35" />
      </filter>
    </defs>
    
    {/* Clean Container Canvas */}
    <rect width="340" height="280" rx="32" fill="url(#skyGrad1)" />

    {/* Background City Skyline & Clouds */}
    <path d="M20 110 H40 V180 H20 Z M50 90 H80 V180 H50 Z M90 120 H115 V180 H90 Z M190 100 H220 V180 H190 Z M230 85 H260 V180 H230 Z M270 115 H295 V180 H270 Z" fill="#E2E8F0" opacity="0.6" />
    {/* Floating Animated Clouds */}
    <path className="ob-animate-float" d="M30 45 C35 38 50 38 55 45 C60 45 68 52 62 60 H25 C18 60 18 48 30 45 Z" fill="#FFFFFF" opacity="0.9" />
    <path className="ob-animate-float-delay" d="M250 55 C255 48 270 48 275 55 C280 55 288 62 282 70 H245 C238 70 238 58 250 55 Z" fill="#FFFFFF" opacity="0.85" />

    {/* Modern Bus Stop / Transit Shelter */}
    <g filter="url(#shadowG1)">
      {/* Roof Frame Structure */}
      <path d="M35 55 L50 42 H290 L305 55 V68 H35 Z" fill="url(#shelterGold)" filter="url(#goldGlow1)" />
      {/* Pillars */}
      <rect x="52" y="68" width="10" height="135" fill="#334155" rx="3" />
      <rect x="130" y="68" width="10" height="135" fill="#334155" rx="3" />
      <rect x="210" y="68" width="10" height="135" fill="#334155" rx="3" />
      <rect x="280" y="68" width="10" height="135" fill="#334155" rx="3" />
      {/* Back Glass Panel Grid */}
      <rect x="55" y="70" width="230" height="130" fill="#94A3B8" opacity="0.12" rx="4" />
      {/* Wooden Bench */}
      <rect x="65" y="140" width="160" height="12" rx="4" fill="url(#benchGold)" />
      <rect x="65" y="156" width="160" height="12" rx="4" fill="url(#benchGold)" />
    </g>

    {/* Red Decorative Plants & Planter Box */}
    <rect x="0" y="180" width="340" height="18" fill="#FF4D4D" opacity="0.85" />
    <g transform="translate(18, 140)">
      <rect x="8" y="32" width="16" height="24" rx="4" fill="#334155" />
      <path d="M16 32 C5 22 2 8 16 0 C30 8 27 22 16 32 Z" fill="#FF4D4D" />
      <path d="M16 28 C3 16 8 2 16 0 Z" fill="#E11D48" />
    </g>

    {/* 3D Standing Passenger Character leaning at shelter */}
    <g transform="translate(210, 85)" className="ob-animate-float-slow">
      {/* Shadow */}
      <ellipse cx="40" cy="118" rx="28" ry="7" fill="#0F172A" opacity="0.15" />
      {/* Legs (Trousers) */}
      <path d="M28 65 L22 116 H36 L40 65 Z" fill="#334155" />
      <path d="M42 65 L48 116 H62 L50 65 Z" fill="#1E293B" />
      {/* Shoes */}
      <ellipse cx="24" cy="116" rx="10" ry="4" fill="#0F172A" />
      <ellipse cx="56" cy="116" rx="10" ry="4" fill="#0F172A" />
      {/* Green Patterned Top */}
      <path d="M22 28 C22 20 58 20 58 28 L54 68 H26 Z" fill="#10B981" />
      <path d="M26 38 H54 M26 48 H54 M26 58 H54" stroke="#059669" strokeWidth="2.5" opacity="0.6" />
      {/* Arm holding phone */}
      <path d="M24 30 C12 40 10 52 24 55" stroke="#FCA5A5" strokeWidth="9" strokeLinecap="round" />
      {/* Smartphone with glowing screen */}
      <rect x="18" y="44" width="12" height="20" rx="3" fill="#0F172A" transform="rotate(-15 18 44)" />
      <rect x="20" y="46" width="8" height="16" rx="2" fill="#FFB800" transform="rotate(-15 18 44)" className="ob-animate-pulse" />
      {/* Head & Hair */}
      <circle cx="40" cy="14" r="12" fill="#FCA5A5" />
      <path d="M30 10 C30 0 52 0 50 10 C50 16 46 20 40 20 C34 20 30 16 30 10 Z" fill="#1E293B" />
      <circle cx="44" cy="0" r="6" fill="#1E293B" /> {/* Top hair bun */}
    </g>
  </svg>
);

// 2026 AI-Infused MNC Vector Graphic 2: Vehicle Selection (Phone & Car Options)
const OnboardingGraphic2 = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="skyGrad2" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="phoneBorder" x1="90" y1="20" x2="250" y2="250" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
      <filter id="phoneShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
    </defs>

    <rect width="340" height="280" rx="32" fill="url(#skyGrad2)" />

    {/* Background Wall Art Frames & Hanging Lights */}
    <g opacity="0.4">
      <rect x="25" y="35" width="32" height="42" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="25" y="85" width="32" height="42" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="25" y="135" width="32" height="42" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <line x1="285" y1="0" x2="285" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M275 40 L295 40 L288 60 H282 Z" fill="#CBD5E1" />
      <line x1="315" y1="0" x2="315" y2="60" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M305 60 L325 60 L318 80 H312 Z" fill="#CBD5E1" />
    </g>

    {/* Plant Pot on Left */}
    <g transform="translate(15, 180)">
      <rect x="10" y="40" width="24" height="32" rx="4" fill="#334155" />
      <path d="M22 40 C6 25 0 5 22 -5 C44 5 38 25 22 40 Z" fill="#FF4D4D" />
      <path d="M22 35 C10 20 12 0 22 -5 Z" fill="#E11D48" />
    </g>

    {/* Central 3D Smartphone displaying Vehicle Options */}
    <g filter="url(#phoneShadow)" transform="translate(95, 15)">
      {/* Phone Frame */}
      <rect width="150" height="245" rx="28" fill="url(#phoneBorder)" />
      {/* Inner Screen */}
      <rect x="6" y="6" width="138" height="233" rx="24" fill="#FFFFFF" />
      
      {/* Screen Notch & Camera */}
      <rect x="45" y="10" width="60" height="10" rx="5" fill="#0F172A" />

      {/* Map Header Preview inside Screen */}
      <rect x="12" y="26" width="126" height="70" rx="12" fill="#E2E8F0" />
      {/* GPS Route Line */}
      <path d="M25 75 Q60 40 85 65 T120 35" stroke="#FF9500" strokeWidth="3.5" fill="none" strokeDasharray="5 3" />
      <circle cx="25" cy="75" r="4" fill="#FF9500" />
      <circle cx="120" cy="35" r="4" fill="#EF4444" />

      {/* Vehicle Option Cards List */}
      {/* Card 1: Cab (Selected - Golden Highlight) */}
      <g transform="translate(12, 102)">
        <rect width="126" height="38" rx="10" fill="#FFFBEB" stroke="#FFB800" strokeWidth="2" />
        <path d="M16 26 L22 18 H36 L42 26 Z" fill="#FFB800" />
        <circle cx="22" cy="27" r="3" fill="#0F172A" />
        <circle cx="36" cy="27" r="3" fill="#0F172A" />
        <text x="50" y="22" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill="#0F172A">Cab</text>
        <text x="114" y="22" textAnchor="end" fontFamily="sans-serif" fontSize="11" fontWeight="900" fill="#0F172A">₹85</text>
      </g>
      {/* Card 2: Flash */}
      <g transform="translate(12, 145)">
        <rect width="126" height="36" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M16 24 L22 17 H36 L42 24 Z" fill="#94A3B8" />
        <circle cx="22" cy="25" r="3" fill="#0F172A" />
        <circle cx="36" cy="25" r="3" fill="#0F172A" />
        <text x="50" y="21" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="#475569">Flash</text>
        <text x="114" y="21" textAnchor="end" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill="#64748B">₹125</text>
      </g>
      {/* Card 3: Comfort */}
      <g transform="translate(12, 186)">
        <rect width="126" height="34" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M16 23 L22 16 H36 L42 23 Z" fill="#64748B" />
        <circle cx="22" cy="24" r="3" fill="#0F172A" />
        <circle cx="36" cy="24" r="3" fill="#0F172A" />
        <text x="50" y="20" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="#475569">Comfort</text>
        <text x="114" y="20" textAnchor="end" fontFamily="sans-serif" fontSize="11" fontWeight="800" fill="#64748B">₹170</text>
      </g>
    </g>

    {/* Standing Character looking at Phone on Right */}
    <g transform="translate(250, 90)" className="ob-animate-float-slow">
      <ellipse cx="30" cy="165" rx="28" ry="7" fill="#0F172A" opacity="0.15" />
      <path d="M18 100 L22 164 H36 L30 100 Z" fill="#334155" />
      <path d="M32 100 L40 164 H54 L44 100 Z" fill="#1E293B" />
      <rect x="18" y="162" width="18" height="6" rx="3" fill="#10B981" />
      <rect x="38" y="162" width="18" height="6" rx="3" fill="#10B981" />
      <path d="M14 45 C14 35 48 35 48 45 L42 102 H20 Z" fill="#10B981" />
      {/* Head */}
      <circle cx="30" cy="24" r="12" fill="#FCA5A5" />
      <path d="M22 18 C22 8 42 8 40 18 C40 24 36 28 30 28 C24 28 22 24 22 18 Z" fill="#1E293B" />
      <path d="M30 6 C35 6 38 1 34 0 C28 0 26 5 30 6 Z" fill="#1E293B" /> {/* Top hair knot */}
    </g>
  </svg>
);

// 2026 AI-Infused MNC Vector Graphic 3: Live Ride Tracking (Taxi & Map Tracking)
const OnboardingGraphic3 = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="skyGrad3" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAFAFA" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="carGoldGrad" x1="20" y1="140" x2="220" y2="210" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB800" />
        <stop offset="1" stopColor="#FF9500" />
      </linearGradient>
      <filter id="carShadow3" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#FF9500" floodOpacity="0.3" />
      </filter>
    </defs>

    <rect width="340" height="280" rx="32" fill="url(#skyGrad3)" />

    {/* Background Map View Graphic Card with Route */}
    <g transform="translate(170, 20)">
      <rect width="150" height="200" rx="20" fill="#FF4D4D" opacity="0.85" />
      {/* Map Roads Overlay */}
      <path d="M20 20 H130 V180 H20 Z" fill="#FFFFFF" opacity="0.2" />
      <path d="M40 30 Q80 80 110 160" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeDasharray="8 4" />
      {/* Pins on Phone Map */}
      <circle cx="40" cy="30" r="8" fill="#FFB800" />
      <circle cx="110" cy="160" r="8" fill="#334155" />
    </g>

    {/* Yellow Supercab Taxi Driving */}
    <g filter="url(#carShadow3)" transform="translate(15, 115)">
      {/* Car Base Body */}
      <path d="M15 45 C25 25 60 12 110 12 C160 12 190 28 215 45 L225 62 C225 68 220 75 210 75 H10 C0 75 -2 65 5 58 Z" fill="url(#carGoldGrad)" />
      {/* Roof Cabin & Windows */}
      <path d="M65 16 L85 2 H145 L170 16 Z" fill="#0F172A" />
      <path d="M72 16 L88 5 H112 V16 Z" fill="#BAE6FD" opacity="0.85" />
      <path d="M118 16 V5 H142 L162 16 Z" fill="#BAE6FD" opacity="0.85" />
      {/* Driver Silhouette in Window */}
      <circle cx="98" cy="12" r="5" fill="#334155" />
      {/* Wheels with Hubcaps */}
      <circle cx="48" cy="72" r="18" fill="#0F172A" />
      <circle cx="48" cy="72" r="8" fill="#CBD5E1" />
      <circle cx="178" cy="72" r="18" fill="#0F172A" />
      <circle cx="178" cy="72" r="8" fill="#CBD5E1" />
      {/* Headlight Beam */}
      <path d="M222 55 L255 48 V68 Z" fill="#FEF08A" opacity="0.7" />
    </g>

    {/* Location Pin Marker */}
    <g transform="translate(110, 50)" className="ob-animate-float">
      <circle cx="20" cy="20" r="16" fill="#FFB800" />
      <circle cx="20" cy="20" r="7" fill="#FFFFFF" />
    </g>

    {/* Passenger Character Walking on Right */}
    <g transform="translate(225, 110)" className="ob-animate-float-slow">
      <ellipse cx="30" cy="140" rx="24" ry="6" fill="#0F172A" opacity="0.15" />
      <path d="M15 80 L35 138 H48 L30 80 Z" fill="#334155" />
      <path d="M30 80 L15 138 H26 L38 80 Z" fill="#1E293B" />
      <path d="M10 38 C10 28 45 28 45 38 L40 85 H15 Z" fill="#10B981" />
      {/* Smartphone */}
      <rect x="36" y="45" width="10" height="18" rx="2" fill="#0F172A" transform="rotate(20 36 45)" />
      {/* Head */}
      <circle cx="26" cy="18" r="11" fill="#FCA5A5" />
      <path d="M18 12 C18 4 36 4 34 12 C34 18 30 22 26 22 C20 22 18 18 18 12 Z" fill="#1E293B" />
    </g>
  </svg>
);

// 2026 AI-Infused MNC Vector Graphic 4: Trip Sharing (Safety & Friends)
const OnboardingGraphic4 = () => (
  <svg viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxHeight: '270px' }}>
    <defs>
      <linearGradient id="skyGrad4" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="phoneShadow4" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.16" />
      </filter>
      <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#EF4444" floodOpacity="0.3" />
      </filter>
    </defs>

    <rect width="340" height="280" rx="32" fill="url(#skyGrad4)" />

    {/* Background Decorative Wall Frames */}
    <g opacity="0.35">
      <rect x="25" y="25" width="40" height="50" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="65" y="80" width="35" height="45" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
    </g>

    {/* Red Decorative Plant on Right */}
    <g transform="translate(255, 175)">
      <rect x="18" y="42" width="26" height="35" rx="4" fill="#334155" />
      <path d="M31 42 C12 25 5 0 31 -10 C57 0 50 25 31 42 Z" fill="#FF4D4D" />
      <path d="M31 36 C18 20 20 0 31 -10 Z" fill="#E11D48" />
    </g>

    {/* Central 3D Smartphone displaying Trip Sharing */}
    <g filter="url(#phoneShadow4)" transform="translate(100, 15)">
      <rect width="145" height="245" rx="26" fill="#1E293B" />
      <rect x="6" y="6" width="133" height="233" rx="22" fill="#FFFFFF" />
      
      {/* Screen Notch */}
      <rect x="42" y="10" width="50" height="8" rx="4" fill="#0F172A" />

      {/* Map View Background inside Screen */}
      <rect x="12" y="26" width="121" height="195" rx="14" fill="#E2E8F0" />
      <path d="M25 180 Q60 100 105 45" stroke="#FF9500" strokeWidth="4" fill="none" strokeDasharray="6 4" />
      <circle cx="25" cy="180" r="6" fill="#FF9500" />
      <circle cx="105" cy="45" r="6" fill="#334155" />

      {/* Shared Driver Badge Floating Card */}
      <g transform="translate(55, 90)" filter="url(#badgeGlow)">
        <rect width="70" height="34" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* Location Pin */}
        <circle cx="16" cy="17" r="6" fill="#EF4444" />
        <circle cx="16" cy="17" r="2.5" fill="#FFFFFF" />
        {/* Driver Avatar */}
        <circle cx="48" cy="17" r="11" fill="#FF4D4D" />
        <circle cx="48" cy="14" r="4.5" fill="#FDE047" />
        <path d="M42 24 C42 20 54 20 54 24 Z" fill="#FFFFFF" />
      </g>
    </g>

    {/* Standing Female Passenger Character Sharing Trip on Left */}
    <g transform="translate(38, 85)" className="ob-animate-float-slow">
      <ellipse cx="30" cy="165" rx="26" ry="7" fill="#0F172A" opacity="0.15" />
      <path d="M18 100 L22 164 H36 L30 100 Z" fill="#334155" />
      <path d="M32 100 L40 164 H54 L44 100 Z" fill="#1E293B" />
      <path d="M14 45 C14 35 48 35 48 45 L42 102 H20 Z" fill="#10B981" />
      {/* Smartphone */}
      <rect x="28" y="50" width="10" height="18" rx="2" fill="#0F172A" />
      {/* Head */}
      <circle cx="30" cy="24" r="12" fill="#FCA5A5" />
      <path d="M22 18 C22 8 42 8 40 18 C40 24 36 28 30 28 C24 28 22 24 22 18 Z" fill="#1E293B" />
    </g>
  </svg>
);

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request a Ride",
      desc: "Request a ride get picked up by a nearby community driver.",
      graphic: <OnboardingGraphic1 />
    },
    {
      title: "Vehicle Selection",
      desc: "Users have the liberty to choose the type of vehicle as per their need.",
      graphic: <OnboardingGraphic2 />
    },
    {
      title: "Live Ride Tracking",
      desc: "Know your driver in advance and be able to view current location in real time on the map.",
      graphic: <OnboardingGraphic3 />
    },
    {
      title: "Trip Sharing",
      desc: "Passengers can share their ride details with family and friends for safety reasons.",
      graphic: <OnboardingGraphic4 />
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="onboarding-screen-container" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Dynamic Graphic Header */}
        <div className="onboarding-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '270px', padding: '8px 0' }}>
          {currentSlide.graphic}
        </div>

        {/* Text & Content */}
        <div className="onboarding-text-box" style={{ textAlign: 'center', padding: '0 10px' }}>
          <h2 style={{ 
            fontFamily: 'League Spartan, sans-serif', 
            fontSize: '32px', 
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
            maxWidth: '310px'
          }}>
            {currentSlide.desc}
          </p>

          {/* Golden Active Step Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {onboardingSlides.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  height: '8px',
                  width: idx === onboardingStep ? '28px' : '8px',
                  borderRadius: '4px',
                  background: idx === onboardingStep ? 'linear-gradient(135deg, #FFB800 0%, #FF9500 100%)' : '#CBD5E1',
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
              background: 'linear-gradient(135deg, #FFB800 0%, #FF9500 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 32px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 149, 0, 0.35)',
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
