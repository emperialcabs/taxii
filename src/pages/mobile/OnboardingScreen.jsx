import React, { useState } from 'react';
import imgRequestRide from '../../assets/images/onboarding/06_request_a_ride.png';
import imgVehicleSelection from '../../assets/images/onboarding/05_vehicle_selection.png';
import imgLiveTracking from '../../assets/images/onboarding/04_live_ride_tracking.png';
import imgTripSharing from '../../assets/images/onboarding/07_trip_sharing.png';

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request a Ride",
      desc: "Request a ride get picked up by a nearby community driver.",
      image: imgRequestRide
    },
    {
      title: "Vehicle Selection",
      desc: "Users have the liberty to choose the type of vehicle as per their need.",
      image: imgVehicleSelection
    },
    {
      title: "Live Ride Tracking",
      desc: "Know your driver in advance and be able to view current location in real time on the map.",
      image: imgLiveTracking
    },
    {
      title: "Trip Sharing",
      desc: "Passengers can share their ride details with family and friends for safety reasons.",
      image: imgTripSharing
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app" style={{ background: '#FFFFFF' }}>
      <div className="onboarding-screen-container" style={{ padding: '20px 20px 28px 20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        
        {/* Exact Artwork Display Header */}
        <div className="onboarding-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '260px', padding: '10px 0' }}>
          <img 
            key={onboardingStep}
            src={currentSlide.image} 
            alt={currentSlide.title}
            className="onboarding-hero-img"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '290px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.06))',
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }} 
          />
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
