import React, { useState } from 'react';
import db from '../../services/dbService';
import { saveCustomerToMySQL } from '../../services/mysqlService';

export default function AccountDetailScreen({ onBack, onSave }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Rider',
        email: 'user@empirecab.in',
        phone: '+91 98765 43210',
        age: 26,
        profession: 'Rider',
        area: 'Bhavnagar, Gujarat',
        photoURL: null
      };
    } catch (e) {
      return {
        name: 'Rider',
        email: 'user@empirecab.in',
        phone: '+91 98765 43210',
        age: 26,
        profession: 'Rider',
        area: 'Bhavnagar, Gujarat',
        photoURL: null
      };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('cabsy_user_profile', JSON.stringify(profile));
      localStorage.setItem('taxigo_onboarded', 'true');
      db.saveCustomer(profile);
      saveCustomerToMySQL(profile).catch(() => {});
    } catch (err) {}
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSave) onSave(profile);
      else if (onBack) onBack();
    }, 1200);
  };

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <button className="header-back-arrow" onClick={onBack}>←</button>
        <h2 className="white-header-title">Edit Profile Details</h2>
      </div>

      <div className="mobile-screen-body" style={{ padding: '20px 20px 100px 20px' }}>
        {/* Photo Upload Section */}
        <div style={{ textCenter: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Avatar" 
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10B981', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }} 
              />
            ) : (
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', boxShadow: '0 6px 18px rgba(16,185,129,0.35)' }}>
                {profile.name ? profile.name.charAt(0) : 'R'}
              </div>
            )}
            <label 
              htmlFor="avatar-file-input"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#10B981',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              📷
            </label>
            <input 
              id="avatar-file-input" 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              style={{ display: 'none' }} 
            />
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
            Tap camera icon to change picture
          </p>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', color: '#15803D', padding: '14px', borderRadius: '16px', fontWeight: '800', textAlign: 'center', marginBottom: '20px', fontFamily: 'League Spartan', fontSize: '16px' }}>
            ✓ Profile Saved Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
            <input 
              type="text" 
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
            <input 
              type="tel" 
              required
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>AGE</label>
              <input 
                type="number" 
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>PROFESSION</label>
              <input 
                type="text" 
                value={profile.profession}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>CITY & REGION</label>
            <input 
              type="text" 
              value={profile.area}
              onChange={(e) => setProfile({ ...profile, area: e.target.value })}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', fontFamily: 'Space Grotesk', outline: 'none', background: '#FFFFFF', color: '#0F172A' }}
            />
          </div>

          <button 
            type="submit"
            className="taxigo-btn-primary"
            style={{ marginTop: '10px', width: '100%', padding: '16px', fontSize: '18px' }}
          >
            Save Profile Changes →
          </button>
        </form>
      </div>
    </div>
  );
}
