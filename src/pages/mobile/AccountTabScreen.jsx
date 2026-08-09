import React, { useState, useEffect } from 'react';

export default function AccountTabScreen({ activeTab, setActiveTab, onNavigateScreen }) {
  const [userProfile, setUserProfile] = useState({
    name: 'Spider Man',
    email: 'user@gmail.com',
    age: '24',
    area: 'Bhavnagar, Gujarat',
    profession: 'Software Engineer',
    authMethod: 'Google'
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(null);

  // Always read fresh profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      if (saved) setUserProfile(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const menuItems = [
    { title: "Edit Account Details", icon: "👤", subtitle: "Name, Age, Area & Profession", action: "accountdetail" },
    { title: "Saved Places", icon: "📍", subtitle: "Home, Work, Favorite spots", action: "info", detail: "Feature coming soon — you can save Home and Work locations here." },
    { title: "Payment Methods", icon: "💳", subtitle: "Cards & UPI Wallets", action: "info", detail: "Currently supporting Cash & Wallet payment. UPI & Card integration coming soon." },
    { title: "Notifications", icon: "🔔", subtitle: "Ride updates & promos", action: "notification" },
    { title: "Security & PIN", icon: "🔒", subtitle: "Biometric login & 2FA", action: "info", detail: "PIN & biometric lock feature is in development. Available in the next release." },
    { title: "Language", icon: "🌐", subtitle: "English (IN)", action: "lang" },
    { title: "Help & Support", icon: "🎧", subtitle: "24/7 Customer Care", action: "info", detail: "For support, email us at support@taxigo.in or call 1800-XXX-XXXX (toll-free)." },
    { title: "About Taxigo", icon: "ℹ️", subtitle: "v2.4.0 (Build 3012)", action: "info", detail: "Taxigo Mobility Platform v2.4.0\nBuilt for India's fastest growing mobility needs.\n© 2026 Taxigo Inc. All rights reserved." }
  ];

  const handleMenuClick = (item) => {
    if (item.action === "accountdetail") {
      onNavigateScreen('accountdetail');
    } else if (item.action === "notification") {
      onNavigateScreen('notification');
    } else if (item.action === "lang") {
      onNavigateScreen('lang');
    } else if (item.action === "info") {
      setShowInfoModal(item);
    }
  };

  return (
    <div className="real-mobile-app">
      {/* Header */}
      <div className="white-header-nav">
        <h2 className="white-header-title">My Account</h2>
      </div>

      <div style={{ padding: '16px 20px 90px 20px', overflowY: 'auto' }}>
        {/* Profile Card */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              {userProfile.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFAA01' }}
                />
              ) : (
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #212B46 0%, #1A2238 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: '#FFAA01',
                    border: '3px solid #FFAA01'
                  }}
                >
                  👤
                </div>
              )}
              <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#22C55E', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '18px', color: '#212B46', margin: 0 }}>
                  {userProfile.name}
                </h3>
                {userProfile.authMethod === 'Google' && (
                  <span style={{ color: '#4285F4', fontSize: '14px', fontWeight: 'bold' }} title="Google Verified">✓</span>
                )}
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
                {userProfile.email}
              </p>
              <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', marginTop: '6px' }}>
                ⭐ Gold Member
              </span>
            </div>
            <button 
              onClick={() => onNavigateScreen('accountdetail')}
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer' }}
            >
              ✏️
            </button>
          </div>

          {/* Profile Extra Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px', 
            background: '#F8FAFC', 
            padding: '12px', 
            borderRadius: '14px',
            border: '1px solid #E2E8F0'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '800', letterSpacing: '0.5px' }}>🎂 AGE</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#212B46' }}>{userProfile.age || '—'} yrs</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '800', letterSpacing: '0.5px' }}>💼 PROFESSION</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#212B46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile.profession || '—'}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '800', letterSpacing: '0.5px' }}>📍 AREA LOCATION</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#212B46' }}>{userProfile.area || '—'}</div>
            </div>
          </div>
        </div>

        {/* Quick Dark Mode Toggle */}
        <div 
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🌙</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>Dark Theme Mode</div>
              <div style={{ fontSize: '12px', color: '#67696B' }}>Switch app color theme</div>
            </div>
          </div>
          <div
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              background: isDarkMode ? '#FFAA01' : '#CBD5E1',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: isDarkMode ? '22px' : '2px',
              transition: 'left 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }} />
          </div>
        </div>

        {/* Account Menu Items */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
          {menuItems.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: index === menuItems.length - 1 ? 'none' : '1px solid #F1F5F9',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onClick={() => handleMenuClick(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#67696B' }}>{item.subtitle}</div>
                </div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '16px' }}>›</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          style={{
            width: '100%',
            padding: '14px',
            background: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            borderRadius: '16px',
            fontFamily: 'League Spartan',
            fontWeight: '800',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => {
            try {
              localStorage.removeItem('taxigo_onboarded');
              localStorage.removeItem('cabsy_user_profile');
            } catch (e) {}
            onNavigateScreen('letsyouin');
          }}
        >
          🚪 Sign Out of Account
        </button>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <div style={{
            width: '100%',
            background: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px 20px 36px 20px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{showInfoModal.icon}</span>
                <h3 style={{ margin: 0, fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#212B46' }}>
                  {showInfoModal.title}
                </h3>
              </div>
              <button onClick={() => setShowInfoModal(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: '#212B46' }}>✕</button>
            </div>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'Space Grotesk' }}>
              {showInfoModal.detail}
            </p>
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
          <span className="nav-tab-icon">🚗</span>
          <span>My Rides</span>
        </button>
        <button className={`nav-tab-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <span className="nav-tab-icon">👛</span>
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
