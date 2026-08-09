import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function SelectPaymentScreen({ 
  selectedPayment, 
  setSelectedPayment, 
  promoCode, 
  setPromoCode, 
  onRequestRide, 
  onBack 
}) {
  const pickupPos = { lat: 47.6062, lng: -122.3321 };
  const destPos = { lat: 47.6101, lng: -122.3421, label: 'Spinka Inlet' };
  const routePolyline = [pickupPos, { lat: 47.6080, lng: -122.3360 }, destPos];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={14}
            userLabel="Pickup Point"
            destination={destPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }} onClick={onBack}>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>‹</span>
              <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '700', color: '#212B46' }}>Back</span>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '700', color: '#67696B', letterSpacing: '1px', margin: 0 }}>SELECT PAYMENT</p>
            
            {/* Payment Option Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '16px 0' }}>
              {[
                { id: 'wallet', label: 'Wallet', icon: '👛' },
                { id: 'apple', label: 'Apple Pay', icon: '🍎' },
                { id: 'gpay', label: 'G Pay', icon: '🌐' },
                { id: 'card', label: 'Card', icon: '💳' }
              ].map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: selectedPayment === item.id ? '#FFFFFF' : '#F8FAFC',
                    border: selectedPayment === item.id ? '2.5px solid #FFAA01' : '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '12px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedPayment(item.id)}
                >
                  <span style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'League Spartan', fontWeight: '700', fontSize: '13px', color: '#212B46' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '700', color: '#67696B', letterSpacing: '1px', margin: '16px 0 0 0' }}>PROMO CODE</p>
            <div style={{ display: 'flex', gap: '10px', margin: '12px 0 24px 0' }}>
              <input 
                style={{ flex: 1, background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '14px 16px', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '16px' }}
                placeholder="Add Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>

            <button className="taxigo-btn-primary" onClick={onRequestRide}>Request A Ride</button>
          </div>
        </div>
      </div>
    </div>
  );
}
