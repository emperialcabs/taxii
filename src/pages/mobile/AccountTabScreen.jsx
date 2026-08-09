import React, { useState } from 'react';

export default function AccountTabScreen({ activeTab, setActiveTab, onNavigateScreen }) {
  const [userName, setUserName] = useState('Leslie Alexander');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { title: "Edit Profile", icon: "👤", subtitle: "Name, email, phone number" },
    { title: "Saved Places", icon: "📍", subtitle: "Home, Work, Favorite spots" },
    { title: "Payment Methods", icon: "💳", subtitle: "Cards & Wallets" },
    { title: "Notifications", icon: "🔔", subtitle: "Ride updates & promos" },
    { title: "Security & PIN", icon: "🔒", subtitle: "Biometric login & 2FA" },
    { title: "Language", icon: "🌐", subtitle: "English (US)" },
    { title: "Help & Support", icon: "🎧", subtitle: "24/7 Customer Care" },
    { title: "About Taxigo", icon: "ℹ️", subtitle: "v2.4.0 (Build 3012)" }
  ];

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
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <img 
              src="/assets/images/account/profile-img.png" 
              alt="Profile" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFAA01' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
            />
            <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#22C55E', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '18px', color: '#212B46', margin: 0 }}>{userName}</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#67696B', fontFamily: 'Space Grotesk' }}>{phone}</p>
            <span style={{ display: 'inline-block', background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', marginTop: '4px' }}>
              ⭐ Platinum Member
            </span>
          </div>
          <button style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer' }}>
            ✏️
          </button>
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
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={(e) => setIsDarkMode(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: '#FFAA01', cursor: 'pointer' }}
          />
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
              onClick={() => {
                if (item.title === "Edit Profile") onNavigateScreen('letsyouin');
                if (item.title === "Language") onNavigateScreen('lang');
                if (item.title === "Notifications") onNavigateScreen('notification');
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#67696B' }}>{item.subtitle}</div>
                </div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 'bold' }}>➔</span>
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
            } catch (e) {}
            onNavigateScreen('letsyouin');
          }}
        >
          🚪 Sign Out of Account
        </button>
      </div>

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
