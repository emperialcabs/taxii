import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';

export default function SelectCarScreen({ userCoords, selectedSeat = 3, selectedCar, setSelectedCar, vehicleList, onNext, onBack }) {
  // Read owner-configured vehicles from Admin Portal (cabsy_vehicles in localStorage)
  const getAdminVehicles = () => {
    try {
      const saved = localStorage.getItem('cabsy_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((v, idx) => ({
            id: v.id || idx + 1,
            name: v.name,
            passengers: v.passengers || '1 - 4 Passenger',
            img: v.image || `/assets/images/map/car${(idx % 4) + 1}.png`,
            dist: "18.5 KM",
            time: "25 Min",
            price: `₹${Math.round(Number(v.rate || 15) * 18)}`
          }));
        }
      }
    } catch (e) {}
    return vehicleList;
  };

  const allVehicles = getAdminVehicles();

  // Filter cars based on selected seats (4-seater vs bigger 6/7 seater)
  const isBiggerCarNeeded = selectedSeat > 4;

  const filteredVehicles = allVehicles.filter(car => {
    const pStr = (car.passengers || '').toLowerCase();
    if (isBiggerCarNeeded) {
      // Show 6 or 7 seater SUV / XL vehicles
      return pStr.includes('6') || pStr.includes('7') || pStr.includes('xl') || car.name.toLowerCase().includes('xl') || car.name.toLowerCase().includes('suv');
    } else {
      // Show 4-seater cars (Sedan, Economy, Luxury, Electric)
      return pStr.includes('4') || !pStr.includes('6');
    }
  });

  const activeCars = filteredVehicles.length > 0 ? filteredVehicles : allVehicles;
  const currentCarObj = activeCars.find(c => c.id === selectedCar) || activeCars[0] || vehicleList[0];

  const pickupPos = (userCoords && typeof userCoords.lat === 'number') ? userCoords : { lat: 21.7645, lng: 72.1519, label: 'Pickup Location' };
  const destPos = { lat: pickupPos.lat - 0.008, lng: pickupPos.lng + 0.009, label: 'Dropoff Location' };
  const routePolyline = [
    pickupPos,
    { lat: (pickupPos.lat + destPos.lat) / 2 + 0.002, lng: (pickupPos.lng + destPos.lng) / 2 },
    destPos
  ];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={14}
            userLabel="Pickup Location"
            destination={destPos}
            routePolyline={routePolyline}
          />

          {/* Bottom Sheet for Car Selector */}
          <div className="homescreen-bottom-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onBack}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>‹</span>
                <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '700', color: '#212B46' }}>Back</span>
              </div>
              <div style={{ background: '#212B46', color: '#FFAA01', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                💺 {selectedSeat} Seats • {isBiggerCarNeeded ? 'Bigger SUV (6-7 Seater)' : '4-Seater Fleet'}
              </div>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '700', color: '#67696B', letterSpacing: '1px', margin: 0 }}>
              SELECT VEHICLE ({isBiggerCarNeeded ? '6-7 SEATER' : '4 SEATER'})
            </p>
            
            {/* Top View Vehicle Choice Row */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(activeCars.length, 4)}, 1fr)`, gap: '10px', margin: '14px 0' }}>
              {activeCars.map((car) => (
                <div 
                  key={car.id} 
                  style={{
                    background: (selectedCar === car.id || currentCarObj.id === car.id) ? '#212B46' : '#F1F5F9',
                    border: (selectedCar === car.id || currentCarObj.id === car.id) ? '2.5px solid #FFAA01' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '10px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedCar(car.id)}
                >
                  <img src={car.img} alt={car.name} style={{ height: '55px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '11px', fontWeight: '700', color: (selectedCar === car.id || currentCarObj.id === car.id) ? '#FFAA01' : '#212B46', marginTop: '4px', textAlign: 'center' }}>
                    {car.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected Car Details Badge */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#212B46' }}>{currentCarObj.name}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>Capacity: {currentCarObj.passengers}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: '800', color: '#22C55E' }}>
                {currentCarObj.price}
              </div>
            </div>

            {/* Trip Stats Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '8px', textAlign: 'center', fontFamily: 'League Spartan', fontWeight: '700', fontSize: '14px' }}>
                🚩 {currentCarObj.dist}
              </div>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '8px', textAlign: 'center', fontFamily: 'League Spartan', fontWeight: '700', fontSize: '14px' }}>
                🕒 {currentCarObj.time}
              </div>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '8px', textAlign: 'center', fontFamily: 'League Spartan', fontWeight: '700', fontSize: '14px', color: '#22C55E' }}>
                💲 {currentCarObj.price}
              </div>
            </div>

            <button className="taxigo-btn-primary" onClick={onNext}>Confirm Vehicle & Proceed →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
