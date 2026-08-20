import React, { useState, useEffect, useRef } from 'react';
import InteractiveMap from '../../components/InteractiveMap';
import { getCoordsForPlace, generateRoutePolyline, calculateDistanceKm } from '../../utils/locationCoords';
import { INITIAL_VEHICLES } from '../AdminPortal';
import { db } from '../../services/dbService';
import { Gift, ArrowLeft, Sparkles, CheckCircle2, ChevronRight, Check } from 'lucide-react';

function SwipeToConfirmButton({ onConfirm, buttonText }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const trackRef = useRef(null);
  const startXRef = useRef(0);

  const handleStart = (clientX) => {
    if (isConfirmed) return;
    setIsDragging(true);
    startXRef.current = clientX - dragX;
  };

  const handleMove = (clientX) => {
    if (!isDragging || isConfirmed || !trackRef.current) return;
    const trackWidth = trackRef.current.clientWidth;
    const handleWidth = 52;
    const maxDrag = trackWidth - handleWidth - 8;
    let newX = clientX - startXRef.current;
    if (newX < 0) newX = 0;
    if (newX > maxDrag) newX = maxDrag;
    setDragX(newX);

    if (newX >= maxDrag * 0.85) {
      setIsConfirmed(true);
      setIsDragging(false);
      setDragX(maxDrag);
      setTimeout(() => {
        onConfirm();
      }, 250);
    }
  };

  const handleEnd = () => {
    if (isConfirmed) return;
    if (isDragging) {
      setIsDragging(false);
      setDragX(0);
    }
  };

  useEffect(() => {
    const onWindowMouseMove = (e) => handleMove(e.clientX);
    const onWindowMouseUp = () => handleEnd();
    const onWindowTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onWindowTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onWindowMouseMove);
      window.addEventListener('mouseup', onWindowMouseUp);
      window.addEventListener('touchmove', onWindowTouchMove);
      window.addEventListener('touchend', onWindowTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  }, [isDragging]);

  const trackWidth = trackRef.current ? trackRef.current.clientWidth : 300;
  const maxDrag = Math.max(trackWidth - 52 - 8, 1);
  const dragRatio = dragX / maxDrag;

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '58px',
        background: isConfirmed ? '#0F172A' : '#F1F5F9',
        border: '1.5px solid #CBD5E1',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        transition: isDragging ? 'none' : 'background 0.3s ease'
      }}
    >
      {/* Dynamic Drag Fill */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${dragX + 52}px`,
          background: isConfirmed ? '#0F172A' : 'linear-gradient(90deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '20px',
          transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      />

      {/* Label Text */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'League Spartan, sans-serif',
          fontSize: '15px',
          fontWeight: '800',
          color: dragRatio > 0.45 ? '#FFFFFF' : '#475569',
          letterSpacing: '0.5px',
          pointerEvents: 'none',
          textTransform: 'uppercase',
          opacity: isConfirmed ? 0.95 : Math.max(0.2, 1 - dragRatio * 1.5),
          transition: 'opacity 0.2s ease, color 0.2s ease'
        }}
      >
        {isConfirmed ? 'Booking Confirmed ✓' : (buttonText || 'Swipe Right to Confirm →')}
      </span>

      {/* Handle */}
      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => e.touches && e.touches[0] && handleStart(e.touches[0].clientX)}
        style={{
          position: 'absolute',
          left: '4px',
          transform: `translateX(${dragX}px)`,
          width: '50px',
          height: '50px',
          borderRadius: '16px',
          background: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isConfirmed ? 'default' : 'grab',
          zIndex: 3,
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          touchAction: 'none'
        }}
      >
        {isConfirmed ? (
          <Check size={22} color="#34D399" />
        ) : (
          <ChevronRight size={24} color="#FFFFFF" />
        )}
      </div>
    </div>
  );
}

export default function SeatScheduleScreen({ 
  userCoords,
  pickupLoc,
  dropoffLoc,
  pickupCity,
  dropoffCity,
  noOfDays = 1,
  isCustom = false,
  tripType = 'one-way',
  setTripType,
  scheduledDate, 
  setScheduledDate, 
  scheduledTime, 
  setScheduledTime,
  returnDate,
  setReturnDate,
  selectedCar,
  setSelectedCar,
  onNext, 
  onBack 
}) {
  const isCustomMode = isCustom || tripType === 'custom-trip';

  const pickupPos = getCoordsForPlace(pickupLoc || "Bhavnagar, Gujarat", userCoords);
  const destPos = getCoordsForPlace(dropoffLoc || "Ahmedabad Airport (AMD)", userCoords);
  const routePolyline = generateRoutePolyline(pickupPos, destPos);

  // Compute distance & Avg KM/day dynamically
  const getRouteDistanceKm = () => {
    try {
      const savedDest = localStorage.getItem('cabsy_destinations') || localStorage.getItem('cabsy_routes');
      if (savedDest) {
        const parsedD = JSON.parse(savedDest);
        if (Array.isArray(parsedD) && parsedD.length > 0) {
          const matched = parsedD.find(r => 
            (pickupLoc && r.pickup && (r.pickup.toLowerCase().includes(pickupLoc.toLowerCase()) || pickupLoc.toLowerCase().includes(r.pickup.toLowerCase()))) &&
            (dropoffLoc && r.dropoff && (r.dropoff.toLowerCase().includes(dropoffLoc.toLowerCase()) || dropoffLoc.toLowerCase().includes(r.dropoff.toLowerCase())))
          );
          if (matched && matched.distanceKm) return Number(matched.distanceKm);
        }
      }
    } catch (e) {}

    const rawRoadKm = Math.round(calculateDistanceKm(pickupPos.lat, pickupPos.lng, destPos.lat, destPos.lng));
    return rawRoadKm > 10 ? rawRoadKm : 175;
  };

  const baseDistance = getRouteDistanceKm();
  const effectiveDistance = tripType === 'round-trip' ? baseDistance * 2 : baseDistance;
  const estTotalKm = isCustomMode 
    ? Math.max(baseDistance, 300 * (noOfDays || 1))
    : effectiveDistance;
  const avgKmPerDay = isCustomMode ? Math.round(estTotalKm / (noOfDays || 1)) : estTotalKm;

  // Load configured vehicles from Admin Portal
  const getFleetVehicles = () => {
    let rawList = [];
    try {
      const savedV = localStorage.getItem('cabsy_vehicles');
      if (savedV) {
        const parsed = JSON.parse(savedV);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawList = parsed;
        }
      }
    } catch (e) {}

    if (rawList.length === 0) {
      rawList = INITIAL_VEHICLES;
    }

    return rawList
      .filter(v => (v.status || 'Active').toLowerCase() === 'active')
      .map((v, idx) => {
        const r = Number(v.ratePerKm || v.pricePerKm || v.rate) || 5;
        const fare = isCustomMode 
          ? Math.round(r * estTotalKm)
          : Math.round(r * effectiveDistance);
        return {
          id: v.id || `CAR-${101 + idx}`,
          name: v.name,
          type: v.passengers || v.type || '4 Persons',
          ratePerKm: r,
          totalFareNum: fare,
          price: `₹${fare.toLocaleString('en-IN')}`,
          tag: v.status || 'Active'
        };
      });
  };

  const fleet = getFleetVehicles();
  const [currentCarId, setCurrentCarId] = useState(selectedCar || fleet[0]?.id);
  const activeCarObj = fleet.find(c => c.id === currentCarId) || fleet[0];

  // Wallet Reward Redemption State
  const [useWalletDiscount, setUseWalletDiscount] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);

  // Exact Pickup & Drop-off Address Details (Entered manually by customer)
  const [pickupAddressDetail, setPickupAddressDetail] = useState('');
  const [dropoffAddressDetail, setDropoffAddressDetail] = useState('');

  const userProfile = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('cabsy_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  }, []);

  const userPhone = userProfile?.phone || '+91 98765 43210';

  useEffect(() => {
    const w = db.getCustomerWallet(userPhone);
    setWalletBalance(w.balance || 0);
  }, [userPhone]);

  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const baseFare = activeCarObj ? activeCarObj.totalFareNum : 770;
  const discountAmount = (useWalletDiscount && walletBalance > 0) ? Math.min(walletBalance, baseFare) : 0;
  const netFare = Math.max(0, baseFare - discountAmount);

  return (
    <div className="real-mobile-app">
      <div className="full-homescreen-map-wrapper">
        <div className="live-map-viewport">
          <InteractiveMap
            center={pickupPos}
            zoom={13}
            userLabel={pickupLoc || "Pickup Point"}
            destination={destPos}
            routePolyline={routePolyline}
          />

          {/* Bottom Card for Trip Type, Schedule & Vehicle Selection */}
          <div className={`homescreen-bottom-card ${isSheetCollapsed ? 'collapsed' : ''}`} style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            {/* Top Center Line Handle Bar */}
            <div 
              className="drag-handle-toggle-area"
              onClick={() => setIsSheetCollapsed(prev => !prev)}
              style={{ cursor: 'pointer', padding: '2px 0 6px 0', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', userSelect: 'none' }}
              title="Click top center line to collapse/expand"
            >
              <svg width="40" height="10" viewBox="0 0 40 10" style={{ display: 'block' }}>
                <path 
                  d={isSheetCollapsed ? "M 8 8 L 20 2 L 32 8" : "M 8 2 L 20 8 L 32 2"} 
                  stroke="#64748B" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="none" 
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </svg>
            </div>

            {/* Back Button & Header Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <button 
                type="button"
                onClick={onBack}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: '#0F172A'
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#0F172A' }}>●</span> {isCustomMode ? `Custom Outstation (${noOfDays || 1} Day${(noOfDays || 1) > 1 ? 's' : ''})` : (tripType === 'round-trip' ? `${effectiveDistance} KM (${baseDistance} KM × 2)` : `${baseDistance} KM`)}
              </div>
            </div>

            {/* CUSTOM TRIP SUMMARY HEADER (SHOWN ONLY WHEN IS_CUSTOM IS TRUE) */}
            {isCustomMode && (
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '18px',
                padding: '14px 16px',
                marginBottom: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#0F172A" />
                  <span style={{ fontFamily: 'League Spartan', fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                    Custom Rental: {pickupCity || 'Bhavnagar'} ➔ {dropoffCity || 'Ahmedabad'} ({noOfDays || 1} Day{(noOfDays || 1) > 1 ? 's' : ''})
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontWeight: '600', fontFamily: 'Space Grotesk', marginBottom: '2px' }}>
                  <strong>Pickup:</strong> {pickupLoc}
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontWeight: '600', fontFamily: 'Space Grotesk' }}>
                  <strong>Dropoff:</strong> {dropoffLoc}
                </div>
              </div>
            )}

            {/* STANDARD MODE OPTIONS: 1. SELECT TRIP TYPE & 2. SCHEDULE PICKUP DATE & TIME (HIDDEN IF IS_CUSTOM IS TRUE) */}
            {!isCustomMode && (
              <>
                {/* 1. TRIP TYPE SELECTOR */}
                <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  1. SELECT TRIP TYPE
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '14px',
                      border: tripType === 'one-way' ? '2px solid #0F172A' : '1.5px solid #E2E8F0',
                      background: tripType === 'one-way' ? '#F8FAFC' : '#FFFFFF',
                      color: tripType === 'one-way' ? '#0F172A' : '#64748B',
                      fontFamily: 'League Spartan, sans-serif',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: tripType === 'one-way' ? '0 4px 14px rgba(15,23,42,0.08)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>One-Way</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: tripType === 'one-way' ? '#334155' : '#94A3B8' }}>{baseDistance} KM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '14px',
                      border: tripType === 'round-trip' ? '2px solid #0F172A' : '1.5px solid #E2E8F0',
                      background: tripType === 'round-trip' ? '#F8FAFC' : '#FFFFFF',
                      color: tripType === 'round-trip' ? '#0F172A' : '#64748B',
                      fontFamily: 'League Spartan, sans-serif',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: tripType === 'round-trip' ? '0 4px 14px rgba(15,23,42,0.08)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>Round Trip</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: tripType === 'round-trip' ? '#334155' : '#94A3B8' }}>{baseDistance * 2} KM</span>
                  </button>
                </div>

                {/* 2. SCHEDULE DATE & TIME */}
                <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  2. SCHEDULE PICKUP DATE & TIME
                </p>

                <div className="schedule-inputs-row" style={{ marginBottom: tripType === 'round-trip' ? '10px' : '16px' }}>
                  <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <select 
                      value={scheduledDate} 
                      onChange={(e) => setScheduledDate(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                    >
                      <option value="Today, 10 Aug 2026">Today, 10 Aug 2026</option>
                      <option value="Tomorrow, 11 Aug 2026">Tomorrow, 11 Aug 2026</option>
                      <option value="Wed, 12 Aug 2026">Wed, 12 Aug 2026</option>
                      <option value="Thu, 13 Aug 2026">Thu, 13 Aug 2026</option>
                      <option value="Fri, 14 Aug 2026">Fri, 14 Aug 2026</option>
                      <option value="Sat, 15 Aug 2026">Sat, 15 Aug 2026</option>
                    </select>
                  </div>

                  <div className="schedule-input-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <select 
                      value={scheduledTime} 
                      onChange={(e) => setScheduledTime(e.target.value)} 
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                    >
                      {[
                        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
                        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Return Date if Round Trip */}
                {tripType === 'round-trip' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      RETURN DATE (OPTIONAL)
                    </label>
                    <div className="schedule-input-box">
                      <select 
                        value={returnDate || 'Tomorrow, 11 Aug 2026'} 
                        onChange={(e) => setReturnDate && setReturnDate(e.target.value)}
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}
                      >
                        <option value="Tomorrow, 11 Aug 2026">Tomorrow, 11 Aug 2026</option>
                        <option value="Wed, 12 Aug 2026">Wed, 12 Aug 2026</option>
                        <option value="Thu, 13 Aug 2026">Thu, 13 Aug 2026</option>
                        <option value="Fri, 14 Aug 2026">Fri, 14 Aug 2026</option>
                        <option value="Sat, 15 Aug 2026">Sat, 15 Aug 2026</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* EXACT PICKUP & DROP-OFF ADDRESS DETAILS (CUSTOMER MANUAL ENTRY) */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              {isCustomMode ? 'EXACT PICKUP & DROP-OFF ADDRESS' : '3. EXACT PICKUP & DROP-OFF ADDRESS'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {/* Pickup Address Input Box */}
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F172A', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', fontFamily: 'League Spartan', letterSpacing: '0.5px' }}>
                    Enter Exact Pickup Address ({pickupCity || pickupLoc || 'Pickup City'})
                  </span>
                </div>
                <input 
                  type="text"
                  value={pickupAddressDetail}
                  onChange={(e) => setPickupAddressDetail(e.target.value)}
                  placeholder="Type exact house no, street, landmark..."
                  style={{
                    width: '100%',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    outline: 'none',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Drop-off Address Input Box */}
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', fontFamily: 'League Spartan', letterSpacing: '0.5px' }}>
                    Enter Exact Drop-Off Address ({dropoffCity || dropoffLoc || 'Destination City'})
                  </span>
                </div>
                <input 
                  type="text"
                  value={dropoffAddressDetail}
                  onChange={(e) => setDropoffAddressDetail(e.target.value)}
                  placeholder="Type exact hotel name, terminal no, office..."
                  style={{
                    width: '100%',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    outline: 'none',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* SELECT FLEET CAR ON THIS SCREEN */}
            <p style={{ fontFamily: 'League Spartan', fontSize: '14px', fontWeight: '800', color: '#0F172A', letterSpacing: '0.3px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              {isCustomMode ? 'SELECT FLEET CAR (PRICE PER KM)' : '4. SELECT FLEET CAR (PRICE PER KM)'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {fleet.map((car) => {
                const isSelected = currentCarId === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      setCurrentCarId(car.id);
                      if (setSelectedCar) setSelectedCar(car.id);
                    }}
                    style={{
                      background: isSelected ? '#F8FAFC' : '#FFFFFF',
                      border: isSelected ? '2px solid #0F172A' : '1.5px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '12px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(15, 23, 42, 0.08)' : 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'League Spartan', fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{car.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: '800', background: isSelected ? '#0F172A' : '#F1F5F9', color: isSelected ? '#FFFFFF' : '#475569', padding: '4px 10px', borderRadius: '10px' }}>
                        ₹{car.ratePerKm}/km
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{car.type}</span>
                      {!isCustomMode && (
                        <span style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>{car.price}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WALLET REWARD DISCOUNT CARD */}
            {walletBalance > 0 && (
              <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '12px 16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontFamily: 'League Spartan, sans-serif', fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={18} color="#0F172A" />
                    <span>Apply Wallet Reward Balance</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                    <input 
                      type="checkbox" 
                      checked={useWalletDiscount} 
                      onChange={(e) => setUseWalletDiscount(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#0F172A', cursor: 'pointer' }}
                    />
                    Use Reward
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', fontWeight: '700' }}>
                  <span>Available Wallet: ₹{walletBalance.toLocaleString('en-IN')}</span>
                  {useWalletDiscount && discountAmount > 0 && (
                    <span style={{ color: '#0F172A', fontWeight: '800' }}>-₹{discountAmount} Discount Applied</span>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Swipe to Confirm Booking Slider */}
            <SwipeToConfirmButton
              buttonText={isCustomMode ? 'Swipe Right to Confirm Booking →' : `Swipe Right to Confirm (${discountAmount > 0 ? `₹${netFare}` : activeCarObj.price}) →`}
              onConfirm={() => {
                const payload = {
                  ...activeCarObj,
                  tripType: isCustomMode ? 'Custom Trip' : (tripType === 'round-trip' ? 'Round Trip (Return)' : 'One-Way'),
                  isCustom: isCustomMode,
                  pickupCity: isCustomMode ? (pickupCity || pickupLoc) : null,
                  dropoffCity: isCustomMode ? (dropoffCity || dropoffLoc) : null,
                  pickup: pickupAddressDetail || pickupLoc,
                  dropoff: dropoffAddressDetail || dropoffLoc,
                  exactPickupAddress: pickupAddressDetail || pickupLoc,
                  exactDropoffAddress: dropoffAddressDetail || dropoffLoc,
                  noOfDays: isCustomMode ? noOfDays : 1,
                  totalDistanceKm: estTotalKm,
                  avgKmPerDay: avgKmPerDay,
                  totalFareNum: netFare,
                  originalFare: baseFare,
                  walletDiscountUsed: discountAmount,
                  couponUsed: discountAmount > 0 ? `Wallet Reward (-₹${discountAmount})` : null
                };
                onNext && onNext(payload);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
