import React from 'react';

export default function WalletTabScreen({ activeTab, setActiveTab, onBack }) {
  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        {onBack && <button className="header-back-arrow" onClick={onBack}>←</button>}
        <h2 className="white-header-title">My Wallet & Balance</h2>
      </div>

      <div style={{ padding: '20px 20px 100px 20px', overflowY: 'auto' }}>
        {/* Wallet Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FFAA01 0%, #FF8C00 100%)', 
          borderRadius: '24px', 
          padding: '24px', 
          color: '#FFFFFF',
          boxShadow: '0 12px 28px rgba(255, 170, 1, 0.35)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '100px', opacity: 0.15, pointerEvents: 'none' }}>💳</div>
          <div style={{ fontSize: '12px', fontWeight: '800', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Available Taxi Wallet Balance</div>
          <div style={{ fontFamily: 'League Spartan', fontSize: '38px', fontWeight: '800', margin: '8px 0 16px 0' }}>₹1,450.00</div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ 
              flex: 1, 
              background: '#FFFFFF', 
              color: '#D97706', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '16px', 
              fontFamily: 'League Spartan', 
              fontWeight: '800', 
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              + Add Funds
            </button>
            <button style={{ 
              flex: 1, 
              background: 'rgba(255, 255, 255, 0.25)', 
              color: '#FFFFFF', 
              border: '1.5px solid rgba(255, 255, 255, 0.5)', 
              padding: '12px', 
              borderRadius: '16px', 
              fontFamily: 'League Spartan', 
              fontWeight: '800', 
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              🎁 Rewards
            </button>
          </div>
        </div>

        {/* Saved Payment Methods */}
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#0F172A', marginBottom: '12px', fontWeight: '800' }}>Saved Payment Options</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {[
            { name: 'UPI / Google Pay / PhonePe', icon: '📱', desc: 'Instant 1-Click Payment' },
            { name: 'Credit / Debit Cards', icon: '💳', desc: 'HDFC, ICICI, SBI Cards' },
            { name: 'Cash on Arrival', icon: '💵', desc: 'Pay Driver directly after trip' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{item.desc}</div>
              </div>
              <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '800' }}>Active ✓</span>
            </div>
          ))}
        </div>

        {/* Recent Wallet Activity */}
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#0F172A', marginBottom: '12px', fontWeight: '800' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { title: 'Trip Payment - Bhavnagar Railway Station', date: 'Today, 10:15 AM', amount: '-₹270.00', type: 'debit' },
            { title: 'Wallet Top Up via UPI', date: 'Yesterday, 04:30 PM', amount: '+₹1,000.00', type: 'credit' },
            { title: 'Trip Payment - Ahmedabad Airport', date: '08 Aug 2026', amount: '-₹2,625.00', type: 'debit' }
          ].map((txn, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{txn.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{txn.date}</div>
              </div>
              <div style={{ 
                fontFamily: 'League Spartan', 
                fontWeight: '800', 
                fontSize: '16px', 
                color: txn.type === 'credit' ? '#22C55E' : '#E11D48' 
              }}>
                {txn.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

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
