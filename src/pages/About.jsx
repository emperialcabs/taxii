import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Eye, Target, ShieldCheck } from 'lucide-react';
import './Pages.css';

export default function About({ onOpenBooking }) {
  const [openAccordion, setOpenAccordion] = useState(0);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  const safetyItems = [
    {
      title: "Rigorous Chauffeur Certification & Background Verification",
      content: "All EMPERIAL CABS drivers undergo mandatory background checks, zero-tolerance substance screening, and advanced defensive driving certifications before operating within our executive fleet."
    },
    {
      title: "Real-time Telemetry & Live GPS Tracking",
      content: "Every ride is actively monitored by our 24/7 central dispatch control room with instant SOS response protocols and live trip sharing for complete passenger security."
    },
    {
      title: "Multinational Fleet Maintenance Standards",
      content: "Our vehicles undergo daily multi-point mechanical inspections, tire pressure checks, and complete interior UV sanitization prior to every dispatch."
    },
    {
      title: "24/7 Priority Executive Concierge Support",
      content: "Our dedicated corporate support team is available around the clock via hotline, in-app messaging, and email to assist with route modifications or immediate dispatch."
    }
  ];

  return (
    <div className="page-about">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card" style={{ borderRadius: '24px' }}>
            <div className="banner-overlay" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)' }}></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span style={{ color: '#FFAE00' }}>About</span>
              </div>
              <h1 className="banner-title" style={{ fontSize: '2.8rem', fontWeight: '800' }}>Pioneering World-Class Chauffeur & Mobility Solutions</h1>
            </div>
          </div>
        </div>
      </section>

      {/* STORY BEHIND EMPERIAL CABS */}
      <section className="section story-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="story-text">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>The Legacy</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>Setting The Standard in Global Executive Transport</h2>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7' }}>
                Founded with a commitment to reliability, punctuality, and understated luxury, EMPERIAL CABS connects discerning passengers and corporate enterprises with premier chauffeur transport.
              </p>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7' }}>
                Our proprietary fleet management ecosystem integrates cutting-edge GPS telemetry, automated fare transparency, and real-time dispatcher dispatching across major metropolitan corridors.
              </p>

              <div className="stats-counters flex-counters">
                <div className="stat-box">
                  <div className="stat-num" style={{ color: '#FFAE00' }}>15 +</div>
                  <div className="stat-lbl">Years of Excellence</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num" style={{ color: '#0F172A' }}>2,500 +</div>
                  <div className="stat-lbl">Certified Chauffeurs</div>
                </div>
              </div>
            </div>

            <div className="story-media">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                alt="Chauffeur with EMPERIAL CABS Executive Sedan" 
                className="rounded-img"
                style={{ borderRadius: '24px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* REDEFINING TRANSPORTATION - VISION, MISSION & METRICS */}
      <section className="section vision-section" style={{ background: '#F8FAFC', borderRadius: '24px', margin: '40px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Our Core Pillars</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', marginTop: '6px' }}>Redefining Corporate Mobility</h2>
          </div>

          <div className="grid-3-cols vision-grid">
            <div className="card vision-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Eye size={26} />
              </div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Our Vision</h3>
              <p style={{ color: '#475569' }}>To be the gold standard in multinational executive ground transportation, delivering zero-friction journeys with zero compromise on safety.</p>
            </div>

            <div className="card vision-card">
              <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                <Target size={26} />
              </div>
              <h3 style={{ color: '#0F172A', fontWeight: '700' }}>Our Mission</h3>
              <p style={{ color: '#475569' }}>To empower corporate leaders and everyday travelers with seamless booking, certified drivers, and transparent pricing on every trip.</p>
            </div>

            <div className="card progress-metrics-card">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Passenger Safety Protocol</span>
                  <span style={{ color: '#FFAE00' }}>99.8%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '99.8%', background: '#FFAE00' }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>On-Time Arrival Rate</span>
                  <span style={{ color: '#FFAE00' }}>98.5%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '98.5%', background: '#FFAE00' }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Executive Fleet Satisfaction</span>
                  <span style={{ color: '#FFAE00' }}>99.2%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '99.2%', background: '#FFAE00' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRINGENT SAFETY MEASURES ACCORDION */}
      <section className="section safety-accordion-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="safety-acc-media">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80" 
                alt="Executive passenger relaxing inside ride" 
                className="rounded-img"
                style={{ borderRadius: '24px' }}
              />
            </div>

            <div className="safety-acc-content">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Uncompromising Standards</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px 0' }}>Comprehensive Safety Protocols for Total Peace of Mind</h2>

              <div className="accordion-list">
                {safetyItems.map((item, index) => (
                  <div key={index} className={`accordion-item ${openAccordion === index ? 'active' : ''}`} style={{ borderColor: openAccordion === index ? '#FFAE00' : '#E2E8F0' }}>
                    <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                      <span>{item.title}</span>
                      {openAccordion === index ? <ChevronUp size={20} style={{ color: '#FFAE00' }} /> : <ChevronDown size={20} />}
                    </div>
                    {openAccordion === index && (
                      <div className="accordion-body">
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW SECTION */}
      <section className="section contact-preview-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="contact-prev-text">
              <span style={{ color: '#FFAE00', fontWeight: '800', textTransform: 'uppercase', fontSize: '13px' }}>Reach Out</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px 0' }}>Contact Our Global Corporate Concierge</h2>
              <p className="section-desc" style={{ color: '#475569', fontSize: '1.1rem' }}>
                Our dispatch control center operates 24/7/365 to handle reservations, special event fleets, and enterprise inquiries.
              </p>

              <div className="grid-2-cols info-cards">
                <div className="card info-mini-card">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                    <MapPin size={22} />
                  </div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700' }}>Global HQ</h4>
                  <p className="small-text">Financial District Tower, Suite 1400, New York, NY 10005</p>
                </div>

                <div className="card info-mini-card">
                  <div className="icon-box" style={{ background: '#FFFBEB', color: '#FFAE00' }}>
                    <Phone size={22} />
                  </div>
                  <h4 style={{ color: '#0F172A', fontWeight: '700' }}>24/7 Hotline</h4>
                  <p className="small-text">+1 (800) 555-EMPERIAL<br />executive@emperialcabs.com</p>
                </div>
              </div>
            </div>

            <div className="contact-prev-media">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                alt="Contact EMPERIAL CABS executive support" 
                className="rounded-img"
                style={{ borderRadius: '24px' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
