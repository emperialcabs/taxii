import React, { useState } from 'react';

export default function WalletTabScreen({ activeTab, setActiveTab }) {
  const [balance, setBalance] = useState(240.50);
  const [transactions, setTransactions] = useState([
    { id: "TXN-8812", title: "Trip Fare Paid", date: "Today, 3:30 PM", amount: "-$25.00", type: "debit" },
    { id: "TXN-7734", title: "Added Money via GPay", date: "07 Nov, 10:00 AM", amount: "+$100.00", type: "credit" },
    { id: "TXN-6612", title: "Trip Fare Paid", date: "05 Nov, 5:15 PM", amount: "-$18.50", type: "debit" },
    { id: "TXN-5501", title: "Promo Reward Added", date: "01 Nov, 12:00 PM", amount: "+$10.00", type: "credit" }
  ]);

  const handleAddFunds = () => {
    setBalance(prev => prev + 50.00);
    setTransactions(prev => [
      { id: "TXN-" + Math.floor(1000 + Math.random() * 9000), title: "Top-up Added", date: "Just now", amount: "+$50.00", type: "credit" },
      ...prev
    ]);
  };

  return (
    <div className="real-mobile-app">
      {/* Header */}
      <div className="white-header-nav">
        <h2 className="white-header-title">Wallet & Payment</h2>
      </div>

      <div style={{ padding: '16px 20px 90px 20px', overflowY: 'auto' }}>
        {/* Wallet Balance Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #212B46 0%, #1A2238 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(33,43,70,0.25)',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '100px', opacity: 0.1, pointerEvents: 'none' }}>👛</div>
          <div style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'League Spartan', fontWeight: '700', letterSpacing: '1px' }}>TOTAL BALANCE</div>
          <div style={{ fontFamily: 'League Spartan', fontSize: '38px', fontWeight: '800', margin: '6px 0 16px 0', color: '#FFAA01' }}>
            ${balance.toFixed(2)}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              style={{
                flex: 1,
                background: '#FFAA01',
                color: '#212B46',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '800',
                fontFamily: 'League Spartan',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={handleAddFunds}
            >
              + Add $50 Money
            </button>
            <button 
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '700',
                fontFamily: 'League Spartan',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              💳 Manage Cards
            </button>
          </div>
        </div>

        {/* Payment Methods Section */}
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#212B46', marginBottom: '12px' }}>Saved Payment Options</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { name: "Taxigo Pay Wallet", type: "Default", icon: "👛" },
            { name: "Google Pay", type: "Linked", icon: "🌐" },
            { name: "Apple Pay", type: "Linked", icon: "🍎" },
            { name: "Visa **** 4920", type: "Card", icon: "💳" }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#212B46' }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '600' }}>{item.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions List */}
        <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', color: '#212B46', marginBottom: '12px' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {transactions.map((txn) => (
            <div 
              key={txn.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: txn.type === 'credit' ? '#DCFCE7' : '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  {txn.type === 'credit' ? '⬇️' : '⬆️'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#212B46' }}>{txn.title}</div>
                  <div style={{ fontSize: '12px', color: '#67696B' }}>{txn.date}</div>
                </div>
              </div>
              <div 
                style={{
                  fontFamily: 'League Spartan',
                  fontWeight: '800',
                  fontSize: '16px',
                  color: txn.type === 'credit' ? '#22C55E' : '#212B46'
                }}
              >
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
