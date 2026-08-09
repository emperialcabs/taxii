import React, { useState } from 'react';

export default function AccountDetailScreen({ googleAccount, onCompleteProfile, onBack }) {
  const [name, setName] = useState(googleAccount?.name || 'Dhruvil Patel');
  const [email, setEmail] = useState(googleAccount?.email || 'dhruvil.patel@gmail.com');
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
      <div className="white-header-nav">
        <button className="back-arrow-btn" onClick={onBack}>←</button>
        <h2 className="white-header-title">Account Details</h2>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', margin: '10px 0 20px 0' }}>
          <div style={{ 
            width: '70px', 
            height: '70px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #212B46 0%, #1A2238 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '32px', 
            color: '#FFAA01', 
            margin: '0 auto 10px auto',
            boxShadow: '0 6px 16px rgba(33,43,70,0.2)' 
          }}>
            👤
          </div>
          <h3 style={{ fontFamily: 'League Spartan', fontSize: '20px', color: '#212B46', margin: 0 }}>
            Complete Your Profile
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            Connected with <strong style={{ color: '#22C55E' }}>Google ({email})</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#212B46', marginBottom: '6px', display: 'block' }}>
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
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Age */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#212B46', marginBottom: '6px', display: 'block' }}>
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
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Area / Address */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#212B46', marginBottom: '6px', display: 'block' }}>
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
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Profession */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#212B46', marginBottom: '6px', display: 'block' }}>
              PROFESSION / OCCUPATION
            </label>
            <input 
              type="text" 
              value={profession} 
              onChange={e => setProfession(e.target.value)} 
              placeholder="e.g. Business / Software Engineer" 
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid #CBD5E1',
                fontSize: '15px',
                fontFamily: 'League Spartan',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="taxigo-btn-primary" 
            style={{ marginTop: '10px' }}
          >
            Save Profile & Shift to Home →
          </button>
        </form>
      </div>
    </div>
  );
}
