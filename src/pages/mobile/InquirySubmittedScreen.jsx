import React from 'react';

export default function InquirySubmittedScreen({ inquiry, onGoHome, onViewRides }) {
  const inqData = inquiry || {
    id: 'INQ-4821',
    customerName: 'Dhruvil Patel',
    customerPhone: '+91 98765 43210',
    pickup: 'Bhavnagar, Gujarat',
    dropoff: 'Ahmedabad Airport (AMD)',
    vehicle: 'SWIFT',
    fare: 770,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Pending'
  };

  return (
    <div className="real-mobile-app" style={{ background: '#F8FAFC', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header */}
      <div className="white-header-nav" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <h2 className="white-header-title">Booking Confirmation</h2>
      </div>

      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Checkmark Icon Badge */}
        <div style={{ 
          width: '84px', 
          height: '84px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#FFFFFF', 
          fontSize: '42px', 
          fontWeight: 'bold',
          boxShadow: '0 10px 28px rgba(34, 197, 94, 0.35)',
          marginBottom: '20px'
        }}>
          ✓
        </div>

        <h2 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', textAlign: 'center' }}>
          Booking Inquiry Submitted!
        </h2>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', color: '#64748B', margin: '0 0 24px 0', textAlign: 'center', maxWidth: '320px', lineHeight: '1.5' }}>
          Your ride booking request has been registered in our Admin Dispatcher Portal.
        </p>

        {/* Inquiry Card Details */}
        <div style={{ 
          width: '100%', 
          background: '#FFFFFF', 
          borderRadius: '20px', 
          border: '1.5px solid #E2E8F0', 
          padding: '20px', 
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)', 
          marginBottom: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px', display: 'block' }}>INQUIRY REFERENCE ID</span>
              <span style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{inqData.id}</span>
            </div>
            <span style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#059669', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '800' }}>
              ● {inqData.status} Confirmation
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '2px' }}>CUSTOMER DETAILS</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{inqData.customerName} ({inqData.customerPhone})</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#F8FAFC', padding: '12px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></span>
                <div style={{ width: '2px', height: '14px', background: '#CBD5E1' }}></div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{inqData.pickup}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{inqData.dropoff}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>SELECTED FLEET CAR</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', fontFamily: 'League Spartan' }}>{inqData.vehicle}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>ESTIMATED FARE</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#10B981', fontFamily: 'League Spartan' }}>₹{inqData.fare}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatcher Notice Box */}
        <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '14px 16px', marginBottom: '28px', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontFamily: 'Space Grotesk', fontWeight: '600', lineHeight: '1.4' }}>
            ℹ️ <strong>Dispatcher Action:</strong> Our admin dispatch team has received this inquiry in the Admin Panel and will call you at <strong>{inqData.customerPhone}</strong> to confirm vehicle availability and driver assignment.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="EMPERIAL CABS-btn-primary" 
            onClick={onViewRides}
            style={{ width: '100%', padding: '16px', fontSize: '17px' }}
          >
            View My Booking Inquiries →
          </button>

          <button 
            onClick={onGoHome}
            style={{
              width: '100%',
              background: '#F1F5F9',
              border: '1.5px solid #CBD5E1',
              color: '#0F172A',
              padding: '14px',
              borderRadius: '16px',
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
