import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, CheckCircle, ShieldCheck } from 'lucide-react';
import './Pages.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-contact">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card" style={{ borderRadius: '24px' }}>
            <div className="banner-overlay" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)' }}></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span style={{ color: '#FFAE00' }}>Contact</span>
              </div>
              <h1 className="banner-title" style={{ fontSize: '2.8rem', fontWeight: '800' }}>Connect with EMPERIAL CABS Global Concierge</h1>
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH & MESSAGE FORM */}
      <section className="section contact-main-section">
        <div className="container">
          <div className="grid-2-cols align-start">
            {/* Get In Touch Info */}
            <div className="contact-info-side">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>24/7 Corporate Concierge</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>We Are At Your Executive Service</h2>
              <p className="section-desc" style={{ color: '#475569', fontSize: '1.1rem' }}>
                Whether you require custom intercity fleet dispatching, corporate account setup, or assistance with an active trip, our team responds instantly.
              </p>

              <div className="grid-2-cols info-cards" style={{ margin: '2rem 0' }}>
                <div className="card info-mini-card">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><MapPin size={22} /></div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700' }}>Global Headquarters</h4>
                  <p className="small-text">Financial District Tower, Suite 1400, New York, NY 10005</p>
                </div>

                <div className="card info-mini-card">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}><Phone size={22} /></div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700' }}>24/7 Hotline</h4>
                  <p className="small-text">+1 (800) 555-EMPERIAL<br />executive@emperialcabs.com</p>
                </div>
              </div>

              <div className="social-links-block">
                <h4 style={{ color: '#0F172A', fontWeight: '700' }}>Official Social Networks :</h4>
                <div className="social-icons-list" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <a href="#social" className="social-btn" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '50%', color: '#0F172A' }}><Facebook size={18} /></a>
                  <a href="#social" className="social-btn" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '50%', color: '#0F172A' }}><Twitter size={18} /></a>
                  <a href="#social" className="social-btn" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '50%', color: '#0F172A' }}><Instagram size={18} /></a>
                  <a href="#social" className="social-btn" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '50%', color: '#0F172A' }}><Youtube size={18} /></a>
                </div>
              </div>
            </div>

            {/* Leave Us A Message Form */}
            <div className="contact-form-side">
              <div className="card contact-form-card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>Leave Us A Message</h3>
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                      <input type="text" placeholder="Full Name *" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }} />
                    </div>

                    <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group">
                        <input type="email" placeholder="Email Address *" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }} />
                      </div>
                      <div className="input-group">
                        <select required defaultValue="" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', background: '#FFFFFF' }}>
                          <option value="" disabled>Inquiry Type *</option>
                          <option value="booking">Executive Ride Inquiry</option>
                          <option value="corporate">Corporate Enterprise Account</option>
                          <option value="driver">Chauffeur Partnership</option>
                          <option value="other">General Concierge Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <textarea rows="4" placeholder="How can we assist your trip?" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px' }}></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #FFAE00 0%, #E09900 100%)', color: '#0F172A', fontWeight: '800', border: 'none', padding: '14px 32px', borderRadius: '9999px', alignSelf: 'flex-start', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255, 174, 0, 0.35)' }}>
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center" style={{ padding: '2rem 0', textAlign: 'center' }}>
                    <CheckCircle size={54} style={{ color: '#10B981', margin: '0 auto 1rem auto' }} />
                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>Message Received</h4>
                    <p style={{ color: '#64748B' }}>Thank you for reaching out to EMPERIAL CABS. Our corporate concierge team will contact you shortly.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
