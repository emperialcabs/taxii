import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function SelectPaymentScreen({ 
  userCoords,
  pickupLoc,
  dropoffLoc,
  selectedPayment, 
  setSelectedPayment, 
  promoCode, 
  setPromoCode, 
  onRequestRide, 
  onBack 
}) {
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={13}
            userLabel={pickupLoc || "Pickup Spot"}
            destination={destPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button 
                onClick={onBack}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px',
                  color: '#1E293B'
                }}
              >
                <span>←</span> Back
              </button>
              <div style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                ✓ Fare Locked ₹270
              </div>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.3px', margin: '0 0 10px 0' }}>
              SELECT PAYMENT METHOD
            </p>
            
            {/* Payment Option Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
              {[
                { id: 'wallet', label: 'Wallet', icon: '💳' },
                { id: 'gpay', label: 'UPI / GPay', icon: '🌐' },
                { id: 'cash', label: 'Cash', icon: '💵' },
                { id: 'card', label: 'Card', icon: '💳' }
              ].map((item) => {
                const isSelected = selectedPayment === item.id;
                return (
                  <div 
                    key={item.id}
                    style={{
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      border: isSelected ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '12px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(52, 211, 153, 0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedPayment(item.id)}
                  >
                    <span style={{ fontSize: '22px', marginBottom: '4px' }}>{item.icon}</span>
                    <span style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '13px', color: '#1E293B' }}>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.3px', margin: '14px 0 8px 0' }}>
              PROMO / COUPON CODE
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                style={{ flex: 1, background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: '14px', padding: '12px 16px', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: '600', color: '#1E293B' }}
                placeholder="Enter promo code (e.g. EMPIRE50)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>

            <button className="taxigo-btn-primary" onClick={onRequestRide}>
              Confirm Booking & Search Driver 🚕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
