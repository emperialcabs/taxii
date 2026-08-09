import React from 'react';

export default function SelectLocationScreen({ pickupLoc, setPickupLoc, dropoffLoc, setDropoffLoc, onSelectLocation, onBack }) {
  // Read Owner/Admin-configured destinations & distance from localStorage (Admin Portal sync)
  const defaultOwnerDestinations = [
    { title: "Bhavnagar Railway Station", sub: "Station Road, Bhavnagar, Gujarat", distance: "18 km", duration: "25 mins" },
    { title: "Ahmedabad Airport (AMD)", sub: "Hansol, Ahmedabad, Gujarat", distance: "175 km", duration: "2 hr 45 min" },
    { title: "Vadodara Central Railway Station", sub: "Sayajiganj, Vadodara, Gujarat", distance: "110 km", duration: "1 hr 50 min" },
    { title: "SG Highway IT Park", sub: "Sarkhej - Gandhinagar Hwy, Ahmedabad", distance: "180 km", duration: "2 hr 55 min" },
    { title: "Alkapuri Commercial Hub", sub: "Alkapuri, Vadodara, Gujarat", distance: "112 km", duration: "1 hr 55 min" },
    { title: "Ghogha Circle & Beach", sub: "Ghogha Road, Bhavnagar, Gujarat", distance: "12 km", duration: "18 mins" },
    { title: "Mumbai Central Airport (BOM)", sub: "Vile Parle East, Mumbai, Maharashtra", distance: "540 km", duration: "8 hrs" }
  ];

  const getOwnerConfiguredLocations = () => {
    try {
      const saved = localStorage.getItem('cabsy_destinations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(d => ({
            title: d.dropoff || d.name,
            sub: `Pickup: ${d.pickup || 'Bhavnagar'}`,
            distance: `${d.distanceKm || 15} km`,
            duration: `~${Math.max(12, Math.round((d.distanceKm || 15) * 1.5))} mins`
          }));
        }
      }
    } catch (e) {}
    return defaultOwnerDestinations;
  };

  const locationList = getOwnerConfiguredLocations();

  // Selected item distance matching
  const matchedItem = locationList.find(i => dropoffLoc && (dropoffLoc.toLowerCase().includes(i.title.toLowerCase().split(' ')[0]) || i.title.toLowerCase().includes(dropoffLoc.toLowerCase())));
  const currentDistanceDisplay = matchedItem ? matchedItem.distance : (dropoffLoc ? '18 km' : '');

  const handleChooseDestination = (title) => {
    if (!pickupLoc || pickupLoc.trim() === '') {
      setPickupLoc("Current Location, Bhavnagar");
    }
    setDropoffLoc(title);
  };

  const isBothLocationsEntered = pickupLoc && pickupLoc.trim() !== '' && dropoffLoc && dropoffLoc.trim() !== '';

  return (
    <div className="real-mobile-app">
      <div className="white-header-nav">
        <button className="header-back-arrow" onClick={onBack}>‹</button>
        <h2 className="white-header-title">Select Destination</h2>
      </div>
      <div style={{ padding: '16px 20px', paddingBottom: '100px' }}>
        {/* Pickup & Dropoff Fields */}
        <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '1.5px solid #E2E8F0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ color: '#22C55E', fontWeight: '700', fontSize: '18px' }}>●</span>
            <input 
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: '600', color: '#212B46' }} 
              value={pickupLoc} 
              onChange={(e) => setPickupLoc(e.target.value)} 
              placeholder="Enter Pickup Location"
            />
          </div>
          <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <span style={{ color: '#FB4945', fontWeight: '700', fontSize: '18px' }}>📍</span>
              <input 
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: '600', color: '#212B46' }} 
                value={dropoffLoc} 
                onChange={(e) => setDropoffLoc(e.target.value)} 
                placeholder="Enter Dropoff Destination"
              />
            </div>
            {currentDistanceDisplay && (
              <span style={{ background: '#212B46', color: '#FFAA01', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                🛣️ {currentDistanceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Validation Warning Alert */}
        {!isBothLocationsEntered && (
          <div style={{ background: '#FEF3C7', color: '#92400E', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Please fill both Pickup & Dropoff locations to proceed.
          </div>
        )}

        {/* Quick Location Chips */}
        <div className="location-chips-bar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '12px' }}>
          <button className="location-chip-btn active" onClick={() => handleChooseDestination("Bhavnagar Railway Station, Gujarat")}>🌊 Bhavnagar (18 km)</button>
          <button className="location-chip-btn" onClick={() => handleChooseDestination("Ahmedabad Airport (AMD), Gujarat")}>🏙️ Ahmedabad (175 km)</button>
          <button className="location-chip-btn" onClick={() => handleChooseDestination("Vadodara Central Railway Station, Gujarat")}>🏢 Vadodara (110 km)</button>
          <button className="location-chip-btn" onClick={() => handleChooseDestination("Mumbai Airport (BOM), Maharashtra")}>🌆 Mumbai (540 km)</button>
        </div>

        {/* Nearby Suggestions List with Distance (KM) */}
        <div className="nearby-suggestions-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {locationList
            .filter(item => !dropoffLoc || item.title.toLowerCase().includes(dropoffLoc.toLowerCase()) || item.sub.toLowerCase().includes(dropoffLoc.toLowerCase()) || dropoffLoc === '856 Spinka Inlet Apt. 576')
            .map((item, idx) => (
              <div 
                key={idx} 
                className="suggestion-item-row"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer' }}
                onClick={() => handleChooseDestination(item.title)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="suggestion-pin-box">📍</div>
                  <div>
                    <h4 className="suggestion-title" style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#212B46' }}>{item.title}</h4>
                    <p className="suggestion-subtitle" style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>{item.sub}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#212B46' }}>🛣️ {item.distance}</div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#22C55E' }}>⏱️ {item.duration}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', zIndex: 100 }}>
        <button 
          style={{
            width: '100%',
            background: isBothLocationsEntered ? '#212B46' : '#94A3B8',
            color: isBothLocationsEntered ? '#FFAA01' : '#FFFFFF',
            border: 'none',
            padding: '14px',
            borderRadius: '16px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            cursor: isBothLocationsEntered ? 'pointer' : 'not-allowed',
            boxShadow: isBothLocationsEntered ? '0 4px 14px rgba(33,43,70,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          disabled={!isBothLocationsEntered}
          onClick={() => {
            if (isBothLocationsEntered) {
              onSelectLocation();
            }
          }}
        >
          {isBothLocationsEntered ? 'Confirm Route & Proceed →' : 'Enter Both Locations to Continue'}
        </button>
      </div>
    </div>
  );
}
