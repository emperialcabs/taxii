import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function DriverFoundScreen({ userCoords, onStartRide }) {
  const pickupPos = (userCoords && typeof userCoords.lat === 'number') ? userCoords : { lat: 21.7645, lng: 72.1519, label: 'Pickup Point' };
  const driverPos = { lat: pickupPos.lat + 0.003, lng: pickupPos.lng + 0.004, label: 'Tom Hegde (Toyota Vios)' };
  const routePolyline = [driverPos, pickupPos];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={15}
            userLabel="Pickup Point"
            activeDriverPos={driverPos}
            routePolyline={routePolyline}
          />

          <div className="homescreen-bottom-card">
            <h2 style={{ fontFamily: 'League Spartan', fontSize: '24px', margin: 0, color: '#212B46' }}>We found a driver for you</h2>
            <p style={{ color: '#67696B', margin: '4px 0 16px 0' }}>Driver will pickup you in 02:35</p>

            <div className="driver-profile-card">
              <div className="driver-info-header">
                <div className="driver-avatar-circle">TH</div>
                <div>
                  <div className="driver-name-txt">Tom Hegde</div>
                  <div className="driver-rating-txt">★ 4.8 (980 rides)</div>
                  <div className="driver-car-num">Toyota Vios • CA3751</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}>📞 Call Driver</button>
                <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#212B46', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }} onClick={onStartRide}>Start Ride</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
