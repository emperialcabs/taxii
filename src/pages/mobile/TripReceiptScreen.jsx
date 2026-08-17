import React from 'react';
import { CheckCircle2, ArrowRight, Home, Receipt, ShieldCheck } from 'lucide-react';

export default function TripReceiptScreen({ onDone }) {
  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <h2 className="white-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={20} color="#10B981" />
          <span>Trip E-Receipt</span>
        </h2>
      </div>
      <div className="mobile-screen-body" style={{ padding: '24px 20px' }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '28px 22px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px auto', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.35)'
            }}>
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '24px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              Payment Successful
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
              <ShieldCheck size={14} color="#10B981" />
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600' }}>
                Empire Cab Executive E-Receipt
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #CBD5E1', borderBottom: '1px dashed #CBD5E1', padding: '18px 0', margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>Base Ride Fare</span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>₹180.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>Distance & Toll Allowance</span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>₹70.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
              <span>GST & Mobility Service Fee (5%)</span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>₹20.00</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
            <span style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Total Paid</span>
            <span style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '26px', fontWeight: '800', color: '#10B981' }}>₹270.00</span>
          </div>
        </div>

        <button 
          className="taxigo-btn-primary" 
          onClick={onDone}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'League Spartan, sans-serif',
            fontSize: '17px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Home size={18} />
          <span>RETURN TO HOME</span>
        </button>
      </div>
    </div>
  );
}
