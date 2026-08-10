import React, { useState } from 'react';

export default function OnboardingScreen({ onFinish }) {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSlides = [
    {
      title: "Request Ride",
      desc: "Request a ride gets picked up by a nearby community driver instantly.",
      img: "/assets/images/splash-screen/onboarding1.png"
    },
    {
      title: "Confirm Your Driver",
      desc: "Huge network of certified professional drivers with top ratings.",
      img: "/assets/images/splash-screen/onboarding2.png"
    },
    {
      title: "Track Your Ride",
      desc: "Real-time GPS movement tracking from pickup point straight to destination.",
      img: "/assets/images/splash-screen/onboarding3.png"
    }
  ];

  const currentSlide = onboardingSlides[onboardingStep];

  return (
    <div className="real-mobile-app">
      <div className="onboarding-screen-container">
        <div className="onboarding-image-box">
          <img src={currentSlide.img} alt={currentSlide.title} />
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
