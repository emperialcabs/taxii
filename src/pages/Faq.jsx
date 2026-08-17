import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MessageSquare, Star } from 'lucide-react';
import './Pages.css';

export default function Faq({ onOpenBooking }) {
  const [activePopular, setActivePopular] = useState(0);
  const [activePayments, setActivePayments] = useState(0);
  const [activeSafety, setActiveSafety] = useState(0);

  const popularFaqs = [
    {
      q: "Do you offer executive airport transportation services?",
      a: "Yes, EMPERIAL CABS provides 24/7 dedicated airport transfers with automated flight telemetry tracking, terminal meet-and-greet services, and guaranteed luggage assistance."
    },
    {
      q: "How can I estimate the fare for my executive ride?",
      a: "You can easily calculate your fare using our online Booking Studio or via the EMPERIAL CABS mobile app. Simply input your pickup and drop-off locations for transparent, upfront pricing."
    },
    {
      q: "Can I schedule a ride in advance?",
      a: "Yes! EMPERIAL CABS allows you to schedule chauffeur rides up to 30 days in advance. Select your preferred date and vehicle class, and your driver will arrive 5 minutes prior to pickup."
    }
  ];

  const paymentFaqs = [
    {
      q: "What payment options are accepted?",
      a: "We accept all major corporate credit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), and monthly invoicing for corporate accounts."
    },
    {
      q: "Are there any hidden fees or surge multipliers?",
      a: "No. EMPERIAL CABS guarantees upfront transparent pricing with zero hidden surcharges or peak multipliers."
    },
    {
      q: "How do corporate account billings work?",
      a: "Corporate accounts receive automated monthly statements with detailed trip receipts, employee logs, and dedicated account management support."
    }
  ];

  const safetyFaqs = [
    {
      q: "Are your chauffeurs background checked and licensed?",
      a: "Yes, 100% of EMPERIAL CABS chauffeurs undergo criminal background screening, DMV record audits, and professional hospitality training."
    },
    {
      q: "How can I contact 24/7 emergency dispatch support?",
      a: "Our dispatch control center is available around the clock via our 24/7 hotline (+1 800 555-EMPERIAL) or directly via the in-app SOS alert button."
    },
    {
      q: "What vehicle sanitation standards are followed?",
      a: "Every vehicle undergoes daily multi-point mechanical checks, tire inspections, and interior UV sanitization before every dispatch."
    }
  ];

  return (
    <div className="page-faq">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card" style={{ borderRadius: '24px' }}>
            <div className="banner-overlay" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)' }}></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span style={{ color: '#FFAE00' }}>FAQ</span>
              </div>
              <h1 className="banner-title" style={{ fontSize: '2.8rem', fontWeight: '800' }}>Frequently Asked Questions</h1>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CONTENT GRID */}
      <section className="section faq-main-section">
        <div className="container">
          <div className="grid-faq-layout">
            <div className="faq-acc-column">
              {/* Popular Questions */}
              <div className="faq-category-block" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>Popular Questions</h2>
                <div className="accordion-list">
                  {popularFaqs.map((item, idx) => (
                    <div key={idx} className={`accordion-item ${activePopular === idx ? 'active' : ''}`} style={{ borderColor: activePopular === idx ? '#FFAE00' : '#E2E8F0' }}>
                      <div className="accordion-header" onClick={() => setActivePopular(activePopular === idx ? -1 : idx)}>
                        <span style={{ fontWeight: '700' }}>{item.q}</span>
                        {activePopular === idx ? <ChevronUp size={20} style={{ color: '#FFAE00' }} /> : <ChevronDown size={20} />}
                      </div>
                      {activePopular === idx && (
                        <div className="accordion-body"><p style={{ color: '#475569', lineHeight: '1.6' }}>{item.a}</p></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments Questions */}
              <div className="faq-category-block" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>Payments & Billing</h2>
                <div className="accordion-list">
                  {paymentFaqs.map((item, idx) => (
                    <div key={idx} className={`accordion-item ${activePayments === idx ? 'active' : ''}`} style={{ borderColor: activePayments === idx ? '#FFAE00' : '#E2E8F0' }}>
                      <div className="accordion-header" onClick={() => setActivePayments(activePayments === idx ? -1 : idx)}>
                        <span style={{ fontWeight: '700' }}>{item.q}</span>
                        {activePayments === idx ? <ChevronUp size={20} style={{ color: '#FFAE00' }} /> : <ChevronDown size={20} />}
                      </div>
                      {activePayments === idx && (
                        <div className="accordion-body"><p style={{ color: '#475569', lineHeight: '1.6' }}>{item.a}</p></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Security */}
              <div className="faq-category-block">
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>Safety & Security</h2>
                <div className="accordion-list">
                  {safetyFaqs.map((item, idx) => (
                    <div key={idx} className={`accordion-item ${activeSafety === idx ? 'active' : ''}`} style={{ borderColor: activeSafety === idx ? '#FFAE00' : '#E2E8F0' }}>
                      <div className="accordion-header" onClick={() => setActiveSafety(activeSafety === idx ? -1 : idx)}>
                        <span style={{ fontWeight: '700' }}>{item.q}</span>
                        {activeSafety === idx ? <ChevronUp size={20} style={{ color: '#FFAE00' }} /> : <ChevronDown size={20} />}
                      </div>
                      {activeSafety === idx && (
                        <div className="accordion-body"><p style={{ color: '#475569', lineHeight: '1.6' }}>{item.a}</p></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Support Box */}
            <div className="faq-sidebar-column">
              <div className="card faq-support-card" style={{ background: '#0F172A', color: '#FFFFFF', borderRadius: '24px', padding: '2rem' }}>
                <div className="icon-box" style={{ background: 'rgba(255, 174, 0, 0.15)', color: '#FFAE00', margin: '0 0 16px 0' }}>
                  <MessageSquare size={26} />
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: '800' }}>Have a specific request?</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '8px 0 20px 0' }}>Contact our 24/7 concierge team for immediate assistance with custom bookings.</p>
                <Link to="/contact" className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #FFAE00 0%, #E09900 100%)', color: '#0F172A', fontWeight: '800', border: 'none', borderRadius: '9999px', textAlign: 'center', padding: '12px 20px' }}>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD BANNER */}
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
                alt="Executive using EMPERIAL CABS mobile app" 
                className="cta-person-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
