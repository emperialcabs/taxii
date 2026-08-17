import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Clock, Navigation, Briefcase, Calendar, Award, ShieldCheck, Wrench, Star } from 'lucide-react';
import './Pages.css';

export default function Services({ onOpenBooking }) {
  return (
    <div className="page-services">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card" style={{ borderRadius: '24px' }}>
            <div className="banner-overlay" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)' }}></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span style={{ color: '#FFAE00' }}>Services</span>
              </div>
              <h1 className="banner-title" style={{ fontSize: '2.8rem', fontWeight: '800' }}>Executive Mobility & Chauffeur Offerings</h1>
            </div>
          </div>
        </div>
      </section>

      {/* THE RIGHT VEHICLE FOR YOUR JOURNEY */}
      <section className="section vehicle-fleet-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Our Executive Fleet</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>The Ideal Vehicle for Every Trip</h2>
          </div>

          <div className="grid-4-cols">
            <div className="card fleet-card">
              <h3>Emperial Sedan</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹15 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Air-Conditioned Comfort</p>
              <Link to="/book-ride" className="fleet-link-btn" style={{ color: '#FFAE00' }}>Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Emperial Sedan Class" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Emperial XL SUV</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹22 / km</div>
              <p className="fleet-cap">1 - 6 Passengers • Extra Luggage Capacity</p>
              <Link to="/book-ride" className="fleet-link-btn" style={{ color: '#FFAE00' }}>Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" alt="Emperial XL SUV" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Emperial First Class</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹35 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Mercedes & BMW Fleet</p>
              <Link to="/book-ride" className="fleet-link-btn" style={{ color: '#FFAE00' }}>Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" alt="Emperial Luxury First Class" />
              </div>
            </div>

            <div className="card fleet-card">
              <h3>Emperial EV Express</h3>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', display: 'inline-block', marginBottom: '8px', border: '1px solid #FDE68A' }}>₹18 / km</div>
              <p className="fleet-cap">1 - 4 Passengers • Zero-Emission EV</p>
              <Link to="/book-ride" className="fleet-link-btn" style={{ color: '#FFAE00' }}>Book Now &gt;</Link>
              <div className="fleet-img-wrap">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" alt="Emperial Electric EV" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 ULTIMATE SERVICES GRID */}
      <section className="section services-grid-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Unmatched Versatility</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>Comprehensive Chauffeur Services</h2>
          </div>

          <div className="grid-3-cols">
            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Plane size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Airport Express Transfers</h3>
              <p style={{ color: '#475569' }}>Real-time flight tracking, gate side meet & greet, and baggage handling for international flights.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Clock size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Hourly Chauffeur Rental</h3>
              <p style={{ color: '#475569' }}>Dedicated vehicle and professional chauffeur at your disposal for flexible corporate itineraries.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Navigation size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Intercity Travel</h3>
              <p style={{ color: '#475569' }}>Seamless long-distance travel between commercial cities with guaranteed upfront rates.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Briefcase size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Corporate Account Management</h3>
              <p style={{ color: '#475569' }}>Custom corporate portal access, monthly expense invoicing, and priority executive dispatch.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Calendar size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Scheduled Advance Booking</h3>
              <p style={{ color: '#475569' }}>Schedule trips up to 30 days ahead with guaranteed chauffeur confirmation and SMS reminders.</p>
            </div>

            <div className="card service-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Award size={26} /></div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>VIP Event Fleet Logistics</h3>
              <p style={{ color: '#475569' }}>Multi-vehicle fleet management for corporate galas, delegations, and international summits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE STEPS TO BOOK YOUR RIDE */}
      <section className="section steps-section" style={{ background: '#F8FAFC', borderRadius: '24px', margin: '40px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Simple Booking Flow</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>Reserve Your Journey in 4 Easy Steps</h2>
          </div>

          <div className="grid-2-cols align-center">
            <div className="steps-list">
              <div className="step-card active" style={{ borderColor: '#FFAE00' }}>
                <span className="step-num" style={{ color: '#FFAE00' }}>1.</span>
                <div>
                  <h4>Select Locations</h4>
                  <p>Enter pickup address and destination or choose from popular airport hubs.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>2.</span>
                <div>
                  <h4>Choose Vehicle Class</h4>
                  <p>Select Sedan, XL SUV, First Class Luxury, or EV Express according to your party size.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>3.</span>
                <div>
                  <h4>Review Upfront Fare</h4>
                  <p>Get guaranteed fare pricing with zero hidden surcharges or peak multipliers.</p>
                </div>
              </div>

              <div className="step-card">
                <span className="step-num" style={{ color: '#FFAE00' }}>4.</span>
                <div>
                  <h4>Live Telemetry Tracking</h4>
                  <p>Track your driver's exact location in real time with automated arrival notifications.</p>
                </div>
              </div>
            </div>

            <div className="steps-graphic text-center">
              <div className="phone-screen-mockup">
                <img 
                  src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&auto=format&fit=crop&q=80" 
                  alt="EMPERIAL CABS mobile app interface" 
                  className="mockup-img"
                  style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(15,23,42,0.2)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
