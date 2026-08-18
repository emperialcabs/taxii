import React from 'react';
import preferredLangImg from '../../assets/images/preferred_lang.png';

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
          <div style={{ textAlign: 'center', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={preferredLangImg} 
              alt="Preferred Language" 
              style={{ 
                width: '100%', 
                maxWidth: '260px', 
                maxHeight: '260px', 
                objectFit: 'contain',
                imageRendering: 'crisp-edges',
                WebkitFontSmoothing: 'antialiased'
              }} 
            />
          </div>
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
