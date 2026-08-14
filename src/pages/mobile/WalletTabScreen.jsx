import React, { useState, useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar';
import { db } from '../../services/dbService';

export default function WalletTabScreen({ activeTab, setActiveTab, onBack }) {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

  const userProfile = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  }, []);

  const userPhone = userProfile?.phone || '+91 98765 43210';

  useEffect(() => {
    const fetchWallet = () => {
      const w = db.getCustomerWallet(userPhone);
      setWallet(w);
    };

    fetchWallet();

    window.addEventListener('storage', fetchWallet);
    window.addEventListener('taxigo_wallet_updated', fetchWallet);
    return () => {
      window.removeEventListener('storage', fetchWallet);
      window.removeEventListener('taxigo_wallet_updated', fetchWallet);
    };
  }, [userPhone]);

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        {onBack && <button className="header-back-arrow" onClick={onBack}>←</button>}
        <h2 className="white-header-title">My Wallet & Balance</h2>
      </div>

      <div className="app-scroll-content" style={{ padding: '20px 20px 100px 20px' }}>
        {/* Wallet Balance Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', 
          borderRadius: '24px', 
          padding: '24px', 
          color: '#FFFFFF',
          boxShadow: '0 12px 28px rgba(52, 211, 153, 0.35)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '100px', opacity: 0.15, pointerEvents: 'none' }}>💳</div>
          <div style={{ fontSize: '12px', fontWeight: '800', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>Available Taxi Wallet Balance</div>
          <div style={{ fontFamily: 'League Spartan', fontSize: '38px', fontWeight: '800', margin: '8px 0 0 0' }}>
            ₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Saved Payment Methods */}
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#0F172A', marginBottom: '12px', fontWeight: '800' }}>Saved Payment Options</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {[
            { name: 'UPI / Google Pay / PhonePe', icon: '📱', desc: 'Instant 1-Click Payment' },
            { name: 'Taxi Wallet Rewards Balance', icon: '💳', desc: 'Auto-apply discount on booking' },
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
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#0F172A', marginBottom: '12px', fontWeight: '800' }}>Recent Wallet Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {wallet.transactions.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', textOverflow: 'ellipsis', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
              No transactions recorded yet. Completed trips & admin rewards will appear here.
            </div>
          ) : (
            wallet.transactions.map((txn, idx) => (
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
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation Toolbar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
