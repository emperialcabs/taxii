import React from 'react';

export default function SplashScreen({ onNext }) {
  return (
    <div className="real-mobile-app">
      <div className="taxigo-splash-container" onClick={onNext}>
        <img className="taxigo-splash-logo" src="/assets/images/favicon/icon.png" alt="Empire Cab Logo" />
        <h1 className="taxigo-splash-title">Empire Cab</h1>
        <p className="taxigo-splash-subtitle">Tap anywhere to get started</p>
      </div>
    </div>
  );
}
