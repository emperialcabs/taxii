import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, CheckCircle } from 'lucide-react';
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
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span>Contact</span>
              </div>
              <h1 className="banner-title">Connect with Us for Any Questions or Concerns</h1>
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
              <h2>Get In Touch With Us</h2>
              <p className="section-desc">
                Fugit sed quia consequuntur magni dolores eos qui ration nesciunt. Excepteur sint occaecat cupidatat non proident sunt in qui.
              </p>

              <div className="grid-2-cols info-cards" style={{ margin: '2rem 0' }}>
                <div className="card info-mini-card">
                  <div className="icon-box"><MapPin size={22} /></div>
                  <h4>Our Office</h4>
                  <p className="small-text">Jl. Raya Sesetan No.210, Sesetan, Denpasar, Bali</p>
                </div>

                <div className="card info-mini-card">
                  <div className="icon-box"><Phone size={22} /></div>
                  <h4>Contact Info</h4>
                  <p className="small-text">+62 831-9929-86700<br />contact@domain.com</p>
                </div>
              </div>

              <div className="social-links-block">
                <h4>Our Social Media :</h4>
                <div className="social-icons-list">
                  <a href="#social" className="social-btn"><Facebook size={18} /></a>
                  <a href="#social" className="social-btn"><Twitter size={18} /></a>
                  <a href="#social" className="social-btn"><Instagram size={18} /></a>
                  <a href="#social" className="social-btn"><Youtube size={18} /></a>
                </div>
              </div>
            </div>

            {/* Leave Us A Message Form */}
            <div className="contact-form-side">
              <div className="card contact-form-card section-mint">
                <h3>Leave Us A Message</h3>
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="input-group">
                      <input type="text" placeholder="Your name here" required />
                    </div>

                    <div className="grid-2-cols">
                      <div className="input-group">
                        <input type="email" placeholder="Add email" required />
                      </div>
                      <div className="input-group">
                        <select required defaultValue="">
                          <option value="" disabled>How can we help you?</option>
                          <option value="booking">Taxi Booking Inquiry</option>
                          <option value="corporate">Corporate Account</option>
                          <option value="driver">Driver Partnership</option>
                          <option value="other">Other Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <textarea rows="5" placeholder="Comments" required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center" style={{ padding: '2rem 0' }}>
                    <CheckCircle size={48} className="text-green" style={{ marginBottom: '1rem' }} />
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for contacting Cabsy. Our team will get back to you shortly.</p>
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
