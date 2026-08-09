import React, { useState } from 'react';

export default function RidesTabScreen({ activeTab, setActiveTab, onBookNewRide }) {
  const [filter, setFilter] = useState('ACTIVE'); // ACTIVE, COMPLETED, CANCELLED

  const ridesData = [
    {
      id: "TX-984712",
      date: "Today, 3:30 PM",
      pickup: "Current Location (Seattle)",
      dropoff: "856 Spinka Inlet Apt. 576",
      driver: "Tom Hegde",
      car: "Toyota Vios • CA3751",
      fare: "$25.00",
      status: "ACTIVE",
      badge: "In Progress"
    },
    {
      id: "TX-839210",
      date: " Yesterday, 5:15 PM",
      pickup: "Husky Metro Station",
      dropoff: "University of Washington",
      driver: "Sarah Jenkins",
      car: "Honda Civic • WA9082",
      fare: "$18.50",
      status: "COMPLETED",
      badge: "Completed"
    },
    {
      id: "TX-710294",
      date: "05 Nov, 11:20 AM",
      pickup: "Woodland Park Zoo",
      dropoff: "Parkview Garden Plaza",
      driver: "Michael Chang",
      car: "Hyundai Elantra • OR4412",
      fare: "$22.00",
      status: "COMPLETED",
      badge: "Completed"
    },
    {
      id: "TX-659102",
      date: "01 Nov, 08:45 AM",
      pickup: "Seattle Tacoma Airport",
      dropoff: "Downtown Hotel Plaza",
      driver: "Alex Rivera",
      car: "Chevrolet Suburban • CA1120",
      fare: "$45.00",
      status: "CANCELLED",
      badge: "Cancelled"
    }
  ];

  const filteredRides = ridesData.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div className="real-mobile-app">
      {/* Header */}
      <div className="white-header-nav">
        <h2 className="white-header-title">My Rides</h2>
      </div>

      <div style={{ padding: '16px 20px 90px 20px', overflowY: 'auto' }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['ACTIVE', 'COMPLETED', 'CANCELLED'].map((type) => (
            <button
              key={type}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '12px',
                border: filter === type ? '2px solid #FFAA01' : '1px solid #E2E8F0',
                background: filter === type ? '#212B46' : '#FFFFFF',
                color: filter === type ? '#FFFFFF' : '#212B46',
                fontFamily: 'League Spartan',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setFilter(type)}
            >
              {type === 'ACTIVE' ? '🚕 Active' : type === 'COMPLETED' ? '✅ Completed' : '❌ Cancelled'}
            </button>
          ))}
        </div>

        {/* Rides List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredRides.map((ride) => (
            <div
              key={ride.id}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'League Spartan', fontWeight: '800', color: '#212B46', fontSize: '15px' }}>{ride.id}</span>
                <span 
                  style={{
                    background: ride.status === 'ACTIVE' ? '#FEF3C7' : ride.status === 'COMPLETED' ? '#DCFCE7' : '#FEE2E2',
                    color: ride.status === 'ACTIVE' ? '#D97706' : ride.status === 'COMPLETED' ? '#15803D' : '#B91C1C',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    fontFamily: 'League Spartan'
                  }}
                >
                  {ride.badge}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#67696B', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>🕒 {ride.date}</div>

              {/* Route snippet */}
              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ color: '#22C55E' }}>●</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#212B46' }}>{ride.pickup}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#FB4945' }}>📍</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#212B46' }}>{ride.dropoff}</span>
                </div>
              </div>

              {/* Driver and Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#212B46', fontSize: '14px' }}>👤 {ride.driver}</div>
                  <div style={{ fontSize: '12px', color: '#67696B' }}>{ride.car}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '18px', color: '#212B46' }}>{ride.fare}</div>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#FFAA01', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                    onClick={onBookNewRide}
                  >
                    Rebook ➔
                  </button>
                </div>
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
