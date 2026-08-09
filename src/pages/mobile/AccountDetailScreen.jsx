import React, { useState } from 'react';

export default function AccountDetailScreen({ googleAccount, onCompleteProfile, onBack }) {
  const [name, setName] = useState(googleAccount?.name || 'Spider Man');
  const [email, setEmail] = useState(googleAccount?.email || 'spiderman757506@gmail.com');
  const [age, setAge] = useState('24');
  const [area, setArea] = useState('Bhavnagar, Gujarat');
  const [profession, setProfession] = useState('Software Engineer');

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = {
      name,
      email,
      age,
      area,
      profession,
      photoURL: googleAccount?.photoURL || null,
      authMethod: 'Google',
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
    } catch (err) {}
    onCompleteProfile(profile);
  };

  return (
    <div className="real-mobile-app">
      {/* Clean Mobile Header */}
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>←</button>
        <h2 className="white-header-title">Account Details</h2>
      </div>

      <div style={{ padding: '24px 20px', overflowY: 'auto' }}>
        {/* Profile Avatar Card */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px auto' }}>
            {googleAccount?.photoURL ? (
              <img 
                src={googleAccount.photoURL} 
                alt="Profile" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #FFAA01', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #212B46 0%, #1A2238 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '36px', 
                color: '#FFAA01', 
                border: '3px solid #FFAA01',
                boxShadow: '0 6px 16px rgba(33,43,70,0.15)' 
              }}>
                👤
              </div>
            )}
            <span style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              background: '#4285F4', 
              color: '#FFFFFF',
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              border: '2px solid #FFFFFF' 
            }} title="Google Verified">
              ✓
            </span>
          </div>

          <h3 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', color: '#212B46', margin: 0 }}>
            Complete Your Profile
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Connected with <strong style={{ color: '#22C55E' }}>{email}</strong>
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
              FULL NAME
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Enter your full name" 
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '700',
                color: '#212B46',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Age */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
              AGE (YEARS)
            </label>
            <input 
              type="number" 
              value={age} 
              onChange={e => setAge(e.target.value)} 
              placeholder="e.g. 24" 
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '700',
                color: '#212B46',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Area / Address */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
              AREA / CITY LOCATION
            </label>
            <input 
              type="text" 
              value={area} 
              onChange={e => setArea(e.target.value)} 
              placeholder="e.g. Bhavnagar, Gujarat" 
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '700',
                color: '#212B46',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Profession */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
              PROFESSION / OCCUPATION
            </label>
            <input 
              type="text" 
              value={profession} 
              onChange={e => setProfession(e.target.value)} 
              placeholder="e.g. Software Engineer" 
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '700',
                color: '#212B46',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Save Profile Button */}
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #FFAA01 0%, #FF8C00 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              fontFamily: 'League Spartan',
              fontSize: '17px',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 16px rgba(255, 170, 1, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Save Profile & Shift to Home →
          </button>
        </form>
      </div>
    </div>
  );
}
