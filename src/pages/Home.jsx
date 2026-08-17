import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Wrench, ArrowRight, Star, MapPin, Navigation, Smartphone, Clock, Users, Package, Calendar, Briefcase, Plane, Award, Sparkles } from 'lucide-react';
import './Pages.css';

export default function Home({ onOpenBooking }) {
  return (
    <div className="page-home">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card" style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.35)' }}>
            <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.75) 100%)' }}></div>
            <div className="hero-content">
              <div className="pill-badge dark-badge" style={{ background: 'rgba(255, 174, 0, 0.15)', color: '#FFAE00', border: '1px solid rgba(255, 174, 0, 0.3)', fontWeight: '700' }}>
                <Sparkles size={14} style={{ marginRight: '6px' }} /> World-Class Executive Mobility
              </div>
              <h1 className="hero-title" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.1' }}>
                Elevate Every Journey with EMPERIAL CABS
              </h1>
              <p className="hero-subtitle" style={{ color: '#E2E8F0', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '720px' }}>
                Experience premium airport transfers, intercity luxury travel, and professional on-demand chauffeur services. Unmatched comfort, real-time GPS telemetry, and guaranteed transparent pricing.
              </p>

              <div className="hero-cta-group">
                <Link to="/book-ride" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #FFAE00 0%, #E09900 100%)', color: '#0F172A', fontWeight: '800', border: 'none', boxShadow: '0 8px 24px rgba(255, 174, 0, 0.4)' }}>
                  Book Executive Ride <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn btn-outline-white" style={{ borderRadius: '9999px', fontWeight: '600' }}>
                  Explore Executive Fleet
                </Link>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '20px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#FFFFFF', fontWeight: '800' }}>100,000+</strong>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Rides Completed</span>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
                <div>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#FFAE00', fontWeight: '800' }}>4.9 ★★★★★</strong>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Global Passenger Rating</span>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
                <div>
                  <strong style={{ display: 'block', fontSize: '20px', color: '#FFFFFF', fontWeight: '800' }}>24/7</strong>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Live Chauffeur Support</span>
                </div>
              </div>
            </div>

            {/* Hero Smartphone Graphics */}
            <div className="hero-graphic-wrap animate-float">
              <div className="mockup-phone-frame">
                <div className="phone-screen">
                  <div className="app-map-header">
                    <div className="app-search-bar" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <MapPin size={16} color="#FFAE00" />
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>Executive Airport Express</span>
                    </div>
                  </div>
                  <div className="app-route-preview" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <div className="route-dot pickup-dot" style={{ background: '#FFAE00' }}></div>
                    <div className="route-line-svg"></div>
                    <div className="route-dot dropoff-dot" style={{ background: '#0F172A' }}></div>
                  </div>
                  <div className="app-fare-bottom" style={{ background: '#0F172A' }}>
                    <div className="fare-info">
                      <small>EST. TIME</small>
                      <strong>35 min</strong>
                    </div>
                    <div className="fare-info">
                      <small>DISTANCE</small>
                      <strong>24.5 km</strong>
                    </div>
                    <div className="fare-price-tag" style={{ background: '#FFAE00', color: '#0F172A', fontWeight: '800' }}>₹850.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET CARDS SECTION */}
      <section className="section fleet-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '13px' }}>Our Executive Fleet</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>Tailored Vehicles for Every Distinction</h2>
          </div>

          <div className="grid-4-cols">
            {/* Regular */}
            <div className="card fleet-card">
              <h3>Emperial Sedan</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹15 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Air-Conditioned Comfort</p>
              <Link to="/book-ride" className="fleet-link" style={{ color: '#FFAE00' }}>Book Sedan Class &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Emperial Regular Sedan" className="fleet-car-img" />
              </div>
            </div>

            {/* XL */}
            <div className="card fleet-card">
              <h3>Emperial XL SUV</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹22 / km</div>
              <p className="fleet-cap">1 - 6 Passengers • Extra Luggage Capacity</p>
              <Link to="/book-ride" className="fleet-link" style={{ color: '#FFAE00' }}>Book XL Class &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" alt="Emperial XL SUV" className="fleet-car-img" />
              </div>
            </div>

            {/* Luxury */}
            <div className="card fleet-card">
              <h3>Emperial First Class</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹35 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Mercedes & BMW Chauffeur</p>
              <Link to="/book-ride" className="fleet-link" style={{ color: '#FFAE00' }}>Book First Class &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" alt="Emperial Luxury First Class" className="fleet-car-img" />
              </div>
            </div>

            {/* Electric */}
            <div className="card fleet-card">
              <h3>Emperial EV Express</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹18 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Zero-Emission Electric</p>
              <Link to="/book-ride" className="fleet-link" style={{ color: '#FFAE00' }}>Book EV Class &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" alt="Emperial Electric EV" className="fleet-car-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION 1 */}
      <section className="section feature-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="feature-text">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Unmatched Service</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px 0' }}>Smarter, Punctual, and Luxurious Mobility for Every Occasion</h2>
              <p className="section-desc" style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7' }}>
                Whether traveling for high-level business conferences, intercity trips, or luxury airport pick-ups, EMPERIAL CABS delivers precision timing, executive comfort, and transparent digital billing.
              </p>

              <div className="grid-2-cols checklist-grid">
                <div className="check-item">
                  <CheckCircle2 size={20} style={{ color: '#FFAE00' }} />
                  <span>Real-time GPS Tracking</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} style={{ color: '#FFAE00' }} />
                  <span>Transparent All-Inclusive Fares</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} style={{ color: '#FFAE00' }} />
                  <span>Certified Executive Chauffeurs</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} style={{ color: '#FFAE00' }} />
                  <span>24/7 Priority Customer Support</span>
                </div>
              </div>
            </div>

            <div className="feature-media">
              <div className="feature-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80" 
                  alt="Passenger boarding EMPERIAL CABS executive sedan" 
                  className="rounded-img"
                  style={{ borderRadius: '24px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION 2 - SAFETY */}
      <section className="section safety-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="feature-media">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                alt="Chauffeur steering EMPERIAL CABS luxury ride" 
                className="rounded-img"
                style={{ borderRadius: '24px' }}
              />
            </div>

            <div className="feature-text">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Safety & Reliability</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px 0' }}>Uncompromising Safety Standards & Fleet Maintenance</h2>
              <p className="section-desc" style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7' }}>
                Every vehicle in the EMPERIAL CABS ecosystem undergoes mandatory daily technical protocols and interior sanitization. All drivers undergo background verification, zero-tolerance drug screening, and executive hospitality training.
              </p>

              <div className="safety-cards-grid">
                <div className="safety-item">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: '#0F172A', fontWeight: '700' }}>Certified Security Protocols</h4>
                    <p className="small-text">SOS emergency dispatch button, live location sharing, and 24/7 telemetry monitoring on every ride.</p>
                  </div>
                </div>

                <div className="safety-item">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                    <Wrench size={26} />
                  </div>
                  <div>
                    <h4 style={{ color: '#0F172A', fontWeight: '700' }}>Rigorous Vehicle Maintenance</h4>
                    <p className="small-text">Complete multi-point vehicle health checks prior to every long-distance and intercity dispatch.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE STEPS SECTION */}
      <section className="section steps-section" style={{ background: '#F8FAFC', borderRadius: '24px', margin: '40px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>4 Simple Steps</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>How to Book Your Executive Cab</h2>
          </div>

          <div className="grid-2-cols align-center">
            <div className="steps-list">
              <div className="step-card active" style={{ borderColor: '#FFAE00' }}>
                <span className="step-num" style={{ color: '#FFAE00' }}>1.</span>
                <div>
                  <h4>Select Locations</h4>
                  <p>Enter your pickup address and desired destination. Choose immediate dispatch or schedule in advance.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>2.</span>
                <div>
                  <h4>Choose Vehicle Class</h4>
                  <p>Select from Executive Sedan, XL SUV, First Class Luxury, or Zero-Emission EV depending on your preference.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>3.</span>
                <div>
                  <h4>Instant Fare Confirmation</h4>
                  <p>Review your guaranteed fare quote with zero hidden surcharges or peak multipliers.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>4.</span>
                <div>
                  <h4>Live Chauffeur Tracking</h4>
                  <p>Track your assigned chauffeur in real time on the live map telemetry interface with instant SMS alerts.</p>
                </div>
              </div>
            </div>

            <div className="steps-graphic text-center">
              <div className="phone-screen-mockup">
                <img 
                  src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&auto=format&fit=crop&q=80" 
                  alt="EMPERIAL CABS mobile application interface" 
                  className="mockup-img"
                  style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(15,23,42,0.2)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-SERVICES GRID SECTION */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Comprehensive Mobility Solutions</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>The Ultimate Chauffeur Experience</h2>
          </div>

          <div className="grid-3-cols">
            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Plane size={26} />
              </div>
              <h3>Airport Express Transfers</h3>
              <p>Automated flight tracking with guaranteed gate pickup and luggage assistance for stress-free travel.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Clock size={26} />
              </div>
              <h3>Hourly Chauffeur Rental</h3>
              <p>Reserve an executive vehicle and driver by the hour for business meetings, shopping, or city tours.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Navigation size={26} />
              </div>
              <h3>Intercity Transfers</h3>
              <p>Comfortable long-distance rides between major economic hubs with fixed transparent pricing.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Briefcase size={26} />
              </div>
              <h3>Corporate Accounts</h3>
              <p>Streamlined corporate billing, monthly invoicing, and priority dispatch for executive teams.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Calendar size={26} />
              </div>
              <h3>Scheduled Travel</h3>
              <p>Book rides up to 30 days in advance with guaranteed chauffeur assignment and SMS reminders.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Award size={26} />
              </div>
              <h3>VIP Event Fleet</h3>
              <p>Custom fleet coordination for corporate galas, weddings, and high-profile international summits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP CTA BANNER */}
      <section className="section download-banner-section">
        <div className="container">
          <div className="download-card" style={{ background: '#0F172A', color: '#FFFFFF', borderRadius: '28px', padding: '3rem 3rem 0 3rem' }}>
            <div className="download-content">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Seamless Access</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 16px 0' }}>Download The EMPERIAL CABS App for Instant Booking</h2>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '24px' }}>
                Access live GPS driver tracking, instant fare estimates, digital wallet rewards, and one-tap booking across all mobile platforms.
              </p>

              <div className="store-badges dark-badges">
                <a href="#download" className="store-badge google-play" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div className="badge-icon">▶</div>
                  <div className="badge-text">
                    <small>GET IT ON</small>
                    <span>Google Play</span>
                  </div>
                </a>

                <a href="#download" className="store-badge app-store" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div className="badge-icon"></div>
                  <div className="badge-text">
                    <small>Download on the</small>
                    <span>App Store</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="download-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80" 
                alt="Executive using EMPERIAL CABS app on mobile device" 
                className="cta-person-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
