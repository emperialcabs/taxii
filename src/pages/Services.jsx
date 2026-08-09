import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Clock, Users, Package, Calendar, Briefcase, ShieldCheck, Wrench, Star } from 'lucide-react';
import './Pages.css';

export default function Services({ onOpenBooking }) {
  return (
    <div className="page-services">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span>Services</span>
              </div>
              <h1 className="banner-title">Experience Convenience Our Service Offerings</h1>
            </div>
          </div>
        </div>
      </section>

      {/* THE RIGHT VEHICLE FOR YOUR JOURNEY */}
      <section className="section vehicle-fleet-section">
        <div className="container">
          <div className="section-header">
            <h2>The Right Vehicle for Your Journey</h2>
            <p>Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et</p>
          </div>

          <div className="grid-4-cols">
            <div className="card fleet-card">
              <h3>Cabsy Reguler</h3>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/book-ride" className="fleet-link-btn">Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Cabsy Reguler" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Cabsy XL</h3>
              <p className="fleet-cap">1 - 6 Passenger</p>
              <Link to="/book-ride" className="fleet-link-btn">Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" alt="Cabsy XL" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Cabsy Luxury</h3>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/book-ride" className="fleet-link-btn">Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" alt="Cabsy Luxury" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Cabsy Electric</h3>
              <p className="fleet-cap">1 - 4 Passenger</p>
              <Link to="/book-ride" className="fleet-link-btn">Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" alt="Cabsy Electric" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 ULTIMATE SERVICES GRID */}
      <section className="section services-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>The Ultimate Taxi Service Experience Awaits</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur</p>
          </div>

          <div className="grid-3-cols">
            <div className="card service-card">
              <div className="icon-box"><Plane size={26} /></div>
              <h3>Airport Transfers</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box"><Clock size={26} /></div>
              <h3>Hourly Rentals</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box"><Users size={26} /></div>
              <h3>Ride-Sharing</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box"><Package size={26} /></div>
              <h3>Package Delivery</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box"><Calendar size={26} /></div>
              <h3>Scheduled Rides</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>

            <div className="card service-card">
              <div className="icon-box"><Briefcase size={26} /></div>
              <h3>Corporate Accounts</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora</p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE STEPS TO BOOK YOUR RIDE */}
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


    </div>
  );
}
