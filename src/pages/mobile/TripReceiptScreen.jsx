import React from 'react';

export default function TripReceiptScreen({ onDone }) {
  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <h2 className="white-header-title">Trip Receipt</h2>
      </div>
      <div style={{ padding: '20px' }}>
        <div className="receipt-card">
          <h3 style={{ fontFamily: 'League Spartan', fontSize: '22px', marginTop: 0, color: '#212B46' }}>Taxigo Official Receipt</h3>
          <div className="receipt-line"><span>Base Fare</span><span>$15.00</span></div>
          <div className="receipt-line"><span>Distance (4.5 KM)</span><span>$7.50</span></div>
          <div className="receipt-line"><span>Time (15 Mins)</span><span>$2.50</span></div>
          <div className="receipt-line grand-total"><span>Total Paid</span><span>$25.00</span></div>
        </div>
        <button className="taxigo-btn-primary" onClick={onDone}>Back to Home</button>
      </div>
    </div>
  );
}
