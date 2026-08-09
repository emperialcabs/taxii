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
          <div className="car">
            <div className="strike"></div>
            <div className="strike strike2"></div>
            <div className="strike strike3"></div>
            <div className="strike strike4"></div>
            <div className="strike strike5"></div>
            <div className="car-detail spoiler"></div>
            <div className="car-detail back"></div>
            <div className="car-detail center"></div>
            <div className="car-detail center1"></div>
            <div className="car-detail front"></div>
            <div className="car-detail wheel"></div>
            <div className="car-detail wheel wheel2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
