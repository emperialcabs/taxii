import React from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline } from '../../utils/locationCoords';

export default function SelectCarScreen({ userCoords, pickupLoc, dropoffLoc, selectedSeat = 3, selectedCar, setSelectedCar, vehicleList, onNext, onBack }) {
  // Compute real map start, end, and route polyline from selected locations
  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

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
            dist: "18.5 km",
            time: "25 min",
            price: `₹${Math.round(Number(v.rate || 15) * 18)}`
          }));
        }
      }
    } catch (e) {}
    return vehicleList;
  };

  const allVehicles = getAdminVehicles();
  const isBiggerCarNeeded = selectedSeat > 4;

  const filteredVehicles = allVehicles.filter(car => {
    const pStr = (car.passengers || '').toLowerCase();
    if (isBiggerCarNeeded) {
      return pStr.includes('6') || pStr.includes('7') || pStr.includes('xl') || car.name.toLowerCase().includes('xl') || car.name.toLowerCase().includes('suv');
    } else {
      return pStr.includes('4') || !pStr.includes('6');
    }
  });

  const activeCars = filteredVehicles.length > 0 ? filteredVehicles : allVehicles;
  const currentCarObj = activeCars.find(c => c.id === selectedCar) || activeCars[0] || vehicleList[0];

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          {/* Real Gujarat/India Interactive Map Route */}
          <InteractiveMap
            center={pickupPos}
            zoom={13}
            userLabel={pickupLoc || "Pickup Location"}
            destination={destPos}
            routePolyline={routePolyline}
          />

          {/* Bottom Sheet for Car Selector */}
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
              <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFAA01', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💺</span> {selectedSeat} Seats • {isBiggerCarNeeded ? '6-7 Seater SUV' : '4-Seater Fleet'}
              </div>
            </div>

            <p style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.3px', margin: '0 0 10px 0' }}>
              SELECT VEHICLE FLEET
            </p>
            
            {/* Scrollable Car Cards */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '16px', 
              overflowX: 'auto', 
              paddingBottom: '8px',
              WebkitOverflowScrolling: 'touch'
            }}>
              {allVehicles.map((car) => {
                const isSelected = (selectedCar === car.id || currentCarObj.id === car.id);
                return (
                  <div 
                    key={car.id} 
                    style={{
                      flex: '0 0 calc(28% - 8px)',
                      minWidth: '95px',
                      background: isSelected ? '#FFFBEB' : '#FFFFFF',
                      border: isSelected ? '2px solid #FFAA01' : '1.5px solid #E2E8F0',
                      borderRadius: '18px',
                      padding: '12px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(255,170,1,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedCar(car.id)}
                  >
                    <img src={car.img} alt={car.name} style={{ height: '52px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: isSelected ? '#1E293B' : '#64748B', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {car.name}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#22C55E', marginTop: '2px' }}>
                      {car.price}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Car Details Box */}
            <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1E293B', fontFamily: 'League Spartan' }}>{currentCarObj.name}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B', fontFamily: 'Space Grotesk' }}>Capacity: {currentCarObj.passengers}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '20px', fontWeight: '800', color: '#22C55E', fontFamily: 'League Spartan' }}>
                {currentCarObj.price}
              </div>
            </div>

            {/* Trip Stats Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '13px', color: '#1E293B' }}>
                🚩 {currentCarObj.dist}
              </div>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '13px', color: '#1E293B' }}>
                ⏱️ {currentCarObj.time}
              </div>
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '13px', color: '#22C55E' }}>
                🏷️ {currentCarObj.price}
              </div>
            </div>

            <button className="taxigo-btn-primary" onClick={onNext}>Confirm Vehicle & Proceed →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
