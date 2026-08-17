import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function DriverFoundScreen({ pickupLoc, dropoffLoc, onNext }) {
  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={{ lat: 21.7645, lng: 72.1519 }}
            zoom={14}
            userLabel="Driver En Route"
          />

          <div className="homescreen-bottom-card">
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', color: '#047857', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>
                <span className="live-radar-pulse"></span> DRIVER ARRIVING IN 3 MINS
              </div>
              <h2 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0', color: '#0F172A' }}>
                Driver Found!
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
                Rajesh Sharma is heading to your pickup spot.
              </p>
            </div>

            {/* Driver Profile Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '16px', marginBottom: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F0FDF4', border: '2px solid #BBF7D0', color: '#059669', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                R
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '18px', color: '#0F172A' }}>
                  Rajesh Sharma (★ 4.9)
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontFamily: 'Space Grotesk', fontWeight: '600', marginTop: '2px' }}>
                  White Dzire • GJ-04-AX-8921
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#22C55E', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                  OTP: 4821
                </div>
              </div>
            </div>

            {/* Call / Message Driver Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', fontWeight: '700', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                📞 Call Driver
              </button>
              <button style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', fontWeight: '700', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                💬 Chat Message
              </button>
            </div>

            <button className="EMPERIAL CABS-btn-primary" onClick={onNext}>
              Start Live Trip Tracking →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
