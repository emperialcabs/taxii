import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Wrench, ArrowRight, Star, MapPin, Navigation, Smartphone, Clock, Users, Package, Calendar, Briefcase, Plane } from 'lucide-react';
import './Pages.css';

export default function Home({ onOpenBooking }) {
  return (
    <div className="page-home">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="pill-badge dark-badge">
                <span className="dot"></span> The Perfect Ride Awaits
              </div>
              <h1 className="hero-title">
                Get Where You Need to Go, Safely and Affordably
              </h1>
              <p className="hero-subtitle">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              </p>

              <div className="hero-cta-group">
                <Link to="/book-ride" className="btn btn-primary">
                  Book Your Ride
                </Link>
                <Link to="/about" className="btn btn-outline-white">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Smartphone Graphics */}
            <div className="hero-graphic-wrap animate-float">
              <div className="mockup-phone-frame">
                <div className="phone-screen">
                  <div className="app-map-header">
                    <div className="app-search-bar">
                      <MapPin size={16} className="text-green" />
                      <span>Bhavnagar → Ahmedabad</span>
                    </div>
                  </div>
                  <div className="app-route-preview">
                    <div className="route-dot pickup-dot"></div>
                    <div className="route-line-svg"></div>
                    <div className="route-dot dropoff-dot"></div>
                  </div>
                  <div className="app-fare-bottom">
                    <div className="fare-info">
                      <small>TIME</small>
                      <strong>3 hr 15 min</strong>
                    </div>
                    <div className="fare-info">
                      <small>DISTANCE</small>
                      <strong>172.5 km</strong>
                    </div>
                    <div className="fare-price-tag">₹2,450.00</div>
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
          <div className="grid-4-cols">
            {/* Reguler */}
            <div className="card fleet-card">
              <h3>Empire Regular</h3>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '4px' }}>₹15 / km</div>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/services" className="fleet-link">Learn More &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Empire Regular Sedan" className="fleet-car-img" />
              </div>
            </div>

            {/* XL */}
            <div className="card fleet-card">
              <h3>Empire XL</h3>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '4px' }}>₹22 / km</div>
              <p className="fleet-cap">1 - 6 Passenger</p>
              <Link to="/services" className="fleet-link">Learn More &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" alt="Empire XL SUV" className="fleet-car-img" />
              </div>
            </div>

            {/* Luxury */}
            <div className="card fleet-card">
              <h3>Empire Luxury</h3>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '4px' }}>₹35 / km</div>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/services" className="fleet-link">Learn More &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" alt="Empire Luxury" className="fleet-car-img" />
              </div>
            </div>

            {/* Electric */}
            <div className="card fleet-card">
              <h3>Empire Electric</h3>
              <div style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '4px' }}>₹18 / km</div>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/services" className="fleet-link">Learn More &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" alt="Empire Electric EV" className="fleet-car-img" />
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
              <h2>Make your travel experience as easy and stress-free as possible</h2>
              <p className="section-desc">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum
              </p>

              <div className="grid-2-cols checklist-grid">
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Easy-to-use mobile app</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Clear and transparent prices</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Professional Drivers</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Diverse vehicles for your needs</span>
                </div>
              </div>
            </div>

            <div className="feature-media">
              <div className="feature-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80" 
                  alt="Passenger boarding taxi" 
                  className="rounded-img"
                />
                <div className="dashed-trail-decorator"></div>
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
                alt="Passengers inside taxi" 
                className="rounded-img"
              />
            </div>

            <div className="feature-text">
              <h2>Putting Your Safety in The Spotlight Quality Rides</h2>
              <p className="section-desc">
                Fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius modi tempora incident ut labore et
              </p>

              <div className="safety-cards-grid">
                <div className="safety-item">
                  <div className="icon-box">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h4>Safety Measures</h4>
                    <p className="small-text">Sed adipisci velit, sed quia non numquam eius modi tempora</p>
                  </div>
                </div>

                <div className="safety-item">
                  <div className="icon-box">
                    <Wrench size={26} />
                  </div>
                  <div>
                    <h4>Well-Maintained Vehicles</h4>
                    <p className="small-text">Sed adipisci velit, sed quia non numquam eius modi tempora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE STEPS SECTION */}
      <section className="section section-mint steps-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple Steps to Book Your Ride</h2>
            <p>Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et</p>
          </div>

          <div className="grid-2-cols align-center">
            <div className="steps-list">
              <div className="step-card active">
                <span className="step-num">1.</span>
                <div>
                  <h4>Type Your Destination</h4>
                  <p>Totam facilis laudantium cum accusamus ullam voluptatibus commodi numquam, error, est, Ea, consequatur.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num">2.</span>
                <div>
                  <h4>Confirm Pick-up Location</h4>
                  <p>Optio, neque qui velit. Magni dolorum quidem ipsum eligendi, totam, facilis laudantium cum accusamus ullam voluptatibus</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num">3.</span>
                <div>
                  <h4>Choose Payment Method</h4>
                  <p>Facilis laudantium cum accusamus ullam voluptatibus commodi numquam, error, est, Ea, consequatur.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num">4.</span>
                <div>
                  <h4>Driver On The Way To Pick-up</h4>
                  <p>Magni dolorum quidem ipsum eligendi, totam, facilis laudantium cum accusamus ullam voluptatibus commodi numquam</p>
                </div>
              </div>
            </div>

            <div className="steps-graphic text-center">
              <div className="phone-screen-mockup">
                <img 
                  src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&auto=format&fit=crop&q=80" 
                  alt="App interface mockup" 
                  className="mockup-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-SERVICES GRID SECTION */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <h2>The Ultimate Taxi Service Experience Awaits</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur</p>
          </div>

          <div className="grid-3-cols">
            <div className="card service-card">
              <div className="icon-box">
                <Plane size={26} />
              </div>
              <h3>Airport Transfers</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box">
                <Clock size={26} />
              </div>
              <h3>Hourly Rentals</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box">
                <Users size={26} />
              </div>
              <h3>Ride-Sharing</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box">
                <Package size={26} />
              </div>
              <h3>Package Delivery</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box">
                <Calendar size={26} />
              </div>
              <h3>Scheduled Rides</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box">
                <Briefcase size={26} />
              </div>
              <h3>Corporate Accounts</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP CTA BANNER */}
      <section className="section download-banner-section">
        <div className="container">
          <div className="download-card">
            <div className="download-content">
              <h2>The Easiest Way to Book Your Ride Download Our App for Instant Access</h2>
              <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam laboriosam, nisi ut aliquid ex ea commodi consequatur</p>

              <div className="store-badges dark-badges">
                <a href="#download" className="store-badge google-play">
                  <div className="badge-icon">▶</div>
                  <div className="badge-text">
                    <small>GET IT ON</small>
                    <span>Google Play</span>
                  </div>
                </a>

                <a href="#download" className="store-badge app-store">
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
                alt="Woman using smartphone to book taxi" 
                className="cta-person-img"
              />
            </div>
          </div>
        </div>
      </section>




    </div>
  );
}
