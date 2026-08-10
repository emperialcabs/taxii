import React, { useState, useEffect } from 'react';

export default function AccountTabScreen({ activeTab, setActiveTab, onNavigate, onLogout, onBack }) {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      return saved ? JSON.parse(saved) : {
        name: 'Dhruvil Patel',
        email: 'dhruvil@taxigo.in',
        phone: '+91 98765 43210',
        age: 26,
        profession: 'Software Engineer',
        area: 'Bhavnagar, Gujarat',
        photoURL: null
      };
    } catch (e) {
      return {
        name: 'Dhruvil Patel',
        email: 'dhruvil@taxigo.in',
        phone: '+91 98765 43210',
        age: 26,
        profession: 'Software Engineer',
        area: 'Bhavnagar, Gujarat',
        photoURL: null
      };
    }
  });

  const [darkMode, setDarkMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('cabsy_user_profile');
        if (saved) setUserProfile(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        {onBack && <button className="header-back-arrow" onClick={onBack}>←</button>}
        <h2 className="white-header-title">My Account & Profile</h2>
      </div>

      <div className="app-scroll-content" style={{ padding: '20px 20px 100px 20px' }}>
        {/* Profile Card Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', 
          borderRadius: '24px', 
          padding: '20px', 
          color: '#FFFFFF',
          boxShadow: '0 12px 28px rgba(52, 211, 153, 0.35)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ position: 'relative' }}>
            {userProfile.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt="Profile" 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
              />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFFFFF', color: '#D97706', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '3px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                👤
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '20px', color: '#FFFFFF', margin: 0 }}>
              {userProfile.name}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', opacity: 0.9, fontFamily: 'Space Grotesk' }}>
              {userProfile.phone} • {userProfile.email}
            </p>
          </div>

          <button 
            onClick={() => onNavigate('accountDetail')}
            style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '14px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
          >
            Edit ✏️
          </button>
        </div>

        {/* Profile Attributes Quick Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>AGE</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{userProfile.age || '—'} yrs</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>ROLE</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.profession || '—'}</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>LOCATION</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{userProfile.area || '—'}</div>
          </div>
        </div>

        {/* Settings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'profile', icon: '👤', title: 'Personal Details & Photo', desc: 'Manage name, phone, age & picture' },
            { id: 'safety', icon: '🛡️', title: 'Safety & Emergency Contacts', desc: 'Share trip details with trusted contacts' },
            { id: 'notifications', icon: '🔔', title: 'Push Notifications', desc: 'Ride status alerts & offer updates' },
            { id: 'terms', icon: '📄', title: 'Terms of Service', desc: 'Taxigo legal guidelines and privacy' },
            { id: 'privacy', icon: '🔒', title: 'Privacy Policy', desc: 'How your data is protected' },
            { id: 'support', icon: '🎧', title: '24x7 Customer Support', desc: 'Call or chat with Taxigo help desk' }
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => {
                if (item.id === 'profile') onNavigate('accountDetail');
                else setShowInfoModal(item);
              }}
              style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '22px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{item.desc}</div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 'bold' }}>→</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          style={{ 
            width: '100%', 
            background: '#FEF2F2', 
            border: '1.5px solid #FECACA', 
            color: '#E11D48', 
            padding: '16px', 
            borderRadius: '18px', 
            fontFamily: 'League Spartan', 
            fontSize: '17px', 
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🚪</span> Logout Account
        </button>
      </div>

      {/* Info Modal Overlay */}
      {showInfoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', maxWidth: '340px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                {showInfoModal.icon} {showInfoModal.title}
              </h3>
              <button onClick={() => setShowInfoModal(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: '#0F172A' }}>✕</button>
            </div>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              {showInfoModal.desc}. This setting is fully active for your Taxigo rider profile in Gujarat, India.
            </p>
            <button 
              onClick={() => setShowInfoModal(null)}
              style={{ width: '100%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)' }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <div className="taxigo-bottom-nav">
        <button className={`nav-tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="nav-tab-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'rides' ? 'active' : ''}`} onClick={() => setActiveTab('rides')}>
          <span className="nav-tab-icon">🚘</span>
          <span>My Rides</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <span className="nav-tab-icon">💳</span>
          <span>Wallet</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
          <span className="nav-tab-icon">👤</span>
          <span>Account</span>
        </button>
      </div>
    </div>
  );
}
