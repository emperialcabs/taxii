import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function DriverFoundScreen({ userCoords, pickupLoc, dropoffLoc, onStartRide }) {
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const driverPos = { lat: pickupPos.lat + 0.003, lng: pickupPos.lng + 0.004, label: 'Ramesh Patel (Sedan)' };
  const routePolyline = generateRoutePolyline(driverPos, pickupPos);

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={15}
            userLabel={pickupLoc || "Pickup Point"}
            activeDriverPos={driverPos}
            destination={destPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                ● Driver Assigned
              </span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                Arriving in 3 mins
              </span>
            </div>

            <h2 style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
              Your Taxi is En Route 🚕
            </h2>
            <p style={{ color: '#64748B', margin: '0 0 16px 0', fontSize: '13px', fontFamily: 'Space Grotesk' }}>
              Driver Ramesh is arriving at {pickupLoc || 'Pickup location'}
            </p>

            <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '18px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFAA01', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  RP
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'League Spartan', fontWeight: '800', fontSize: '17px', color: '#1E293B' }}>
                    Ramesh Patel
                  </div>
                  <div style={{ fontSize: '12px', color: '#EAB308', fontWeight: '700' }}>
                    ★ 4.9 (1,240 completed rides)
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>
                    White Swift Dzire • GJ04-AB-9821
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: '800', color: '#22C55E', fontFamily: 'League Spartan' }}>
                  ₹270
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', fontWeight: '700', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '14px', color: '#1E293B' }}>
                  📞 Call Driver
                </button>
                <button className="taxigo-btn-primary" style={{ flex: 1, padding: '12px', fontSize: '15px' }} onClick={onStartRide}>
                  Start Ride →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
