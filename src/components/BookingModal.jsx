import React, { useState } from 'react';
import { X, MapPin, Navigation, Car, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import './BookingModal.css';

export default function BookingModal({ isOpen, onClose }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicle, setVehicle] = useState('Reguler');
  const [passengerCount, setPassengerCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const vehicles = [
    { id: 'Reguler', name: 'Cabsy Reguler', capacity: '1-4 Passenger', ratePerKm: 2.2, icon: '🚕' },
    { id: 'XL', name: 'Cabsy XL', capacity: '1-6 Passenger', ratePerKm: 3.5, icon: '🚙' },
    { id: 'Luxury', name: 'Cabsy Luxury', capacity: '1-4 Passenger', ratePerKm: 4.8, icon: '🚘' },
    { id: 'Electric', name: 'Cabsy Electric', capacity: '1-4 Passenger', ratePerKm: 2.5, icon: '⚡' },
  ];

  const selectedVeh = vehicles.find(v => v.id === vehicle) || vehicles[0];
  const estimatedDist = pickup && dropoff ? 12.5 : 8.0; // km
  const estimatedFare = (estimatedDist * selectedVeh.ratePerKm + 5.0).toFixed(2);
  const estimatedTime = Math.round(estimatedDist * 2.2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div className="modal-header">
              <span className="pill-badge">
                <span className="dot"></span> Online Booking Studio
              </span>
              <h2>Book Your Cabsy Ride</h2>
              <p>Experience safe, reliable, and premium transportation at your fingertips.</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              {/* Route Input Group */}
              <div className="input-group">
                <label><MapPin size={16} className="text-green" /> Pick-up Location</label>
                <input 
                  type="text" 
                  placeholder="Enter pick-up address or airport terminal..." 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label><Navigation size={16} className="text-green" /> Destination Location</label>
                <input 
                  type="text" 
                  placeholder="Enter drop-off destination..." 
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  required
                />
              </div>

              {/* Vehicle Selection */}
              <div className="vehicle-selector">
                <label><Car size={16} className="text-green" /> Choose Vehicle Class</label>
                <div className="vehicle-grid">
                  {vehicles.map((v) => (
                    <div 
                      key={v.id}
                      className={`vehicle-card ${vehicle === v.id ? 'selected' : ''}`}
                      onClick={() => setVehicle(v.id)}
                    >
                      <span className="veh-emoji">{v.icon}</span>
                      <span className="veh-name">{v.name}</span>
                      <small className="veh-cap">{v.capacity}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Fare Estimation Summary */}
              <div className="fare-estimate-box">
                <div className="fare-detail">
                  <span className="fare-label">Estimated Distance</span>
                  <span className="fare-val">{estimatedDist} km</span>
                </div>
                <div className="fare-detail">
                  <span className="fare-label">Estimated Time</span>
                  <span className="fare-val">{estimatedTime} min</span>
                </div>
                <div className="fare-detail total">
                  <span className="fare-label">Estimated Fare</span>
                  <span className="fare-price">${estimatedFare}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Confirm & Request Ride Now
              </button>
            </form>
          </div>
        ) : (
          <div className="success-modal-state text-center">
            <div className="success-icon-wrap">
              <CheckCircle size={64} className="text-green" />
            </div>
            <h2>Ride Requested Successfully!</h2>
            <p>Your driver is being assigned. Live tracking details have been sent to your mobile phone.</p>
            
            <div className="booking-summary-card">
              <div className="summary-row">
                <span>Vehicle:</span> <strong>{selectedVeh.name}</strong>
              </div>
              <div className="summary-row">
                <span>Est. Fare:</span> <strong>${estimatedFare}</strong>
              </div>
              <div className="summary-row">
                <span>ETA:</span> <strong>{estimatedTime} mins</strong>
              </div>
            </div>

            <button onClick={handleReset} className="btn btn-primary">
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
