import React, { useState } from 'react';

import onboarding1 from '/assets/images/splash-screen/onboarding1.png';
import onboarding2 from '/assets/images/splash-screen/onboarding2.png';
import onboarding3 from '/assets/images/splash-screen/onboarding3.png';
import onboarding4 from '/assets/images/splash-screen/onboarding4.png';

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request Ride",
      desc: "Request a ride and get picked up by a nearby certified driver instantly.",
      img: onboarding1
    },
    {
      title: "Confirm Your Driver",
      desc: "Huge network of certified professional drivers with top ratings.",
      img: onboarding2
    },
    {
      title: "Track Your Ride",
      desc: "Real-time GPS movement tracking from pickup point straight to destination.",
      img: onboarding3
    },
    {
      title: "Choose Vehicle Class",
      desc: "Select your preferred ride class from Swift, Ertiga to Luxury Innova.",
      img: onboarding4
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app">
      <div className="onboarding-screen-container">
        <div className="onboarding-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px', padding: '16px' }}>
          <img 
            src={currentSlide.img} 
            alt={currentSlide.title} 
            style={{ maxWidth: '85%', maxHeight: '250px', objectFit: 'contain' }}
          />
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
