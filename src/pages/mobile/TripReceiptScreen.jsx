import React from 'react';

export default function TripReceiptScreen({ onDone }) {
  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <h2 className="white-header-title">Trip Receipt</h2>
      </div>
      <div style={{ padding: '24px 20px', overflowY: 'auto' }}>
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '24px',
          padding: '24px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', color: '#22C55E', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
              ✓
            </div>
            <h3 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', margin: 0, color: '#1E293B' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0', fontFamily: 'Space Grotesk' }}>
              Taxigo Mobility Official E-Receipt
            </p>
          </div>

          <div style={{ borderTop: '1px dashed #CBD5E1', borderBottom: '1px dashed #CBD5E1', padding: '16px 0', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'Space Grotesk' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>Base Trip Fare</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>₹180.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>Distance & Highway Toll</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>₹70.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>GST & Platform Fee (5%)</span>
              <span style={{ fontWeight: '700', color: '#1E293B' }}>₹20.00</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#1E293B' }}>Total Amount Paid</span>
            <span style={{ fontFamily: 'League Spartan', fontSize: '24px', fontWeight: '800', color: '#22C55E' }}>₹270.00</span>
          </div>
        </div>

        <button className="taxigo-btn-primary" onClick={onDone}>
          Back to Home 🏠
        </button>
      </div>
    </div>
  );
}
