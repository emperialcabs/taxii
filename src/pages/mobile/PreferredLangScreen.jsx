import React from 'react';

export default function PreferredLangScreen({ selectedLang, setSelectedLang, onNext, onBack }) {
  const languagesList = ["English", "Hindi", "Spanish", "French", "German", "Arabic", "Chinese", "Japanese"];

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Preferred Language</h2>
      </div>
      <div className="verify-screen-body">
        <div>
          <p className="verify-desc-txt" style={{ textAlign: 'left', marginBottom: '16px' }}>Select your preferred language for the EMPERIAL CABS app navigation.</p>
          <div className="language-pills-grid">
            {languagesList.map((lang) => (
              <div 
                key={lang} 
                className={`lang-pill-item ${selectedLang === lang ? 'selected' : ''}`}
                onClick={() => setSelectedLang(lang)}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
        <button className="EMPERIAL CABS-btn-primary" onClick={onNext}>Save Language</button>
      </div>
    </div>
  );
}
