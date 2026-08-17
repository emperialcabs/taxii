import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Smartphone, ShieldCheck, Globe } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="cabsy-footer" style={{ background: '#0F172A', color: '#94A3B8', paddingTop: '3rem' }}>
      <div className="container">
        <div className="footer-box" style={{ background: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '3rem 2.5rem 2rem 2.5rem' }}>
          <div className="footer-grid" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="brand-logo footer-logo" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
                <img src="/assets/images/logo.svg" alt="EMPERIAL CABS" style={{ height: '70px', width: 'auto', borderRadius: '0px', padding: '2px 4px', background: '#FFFFFF', border: '1px solid #FFFFFF' }} />
              </Link>
              <p className="footer-desc" style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.7' }}>
                EMPERIAL CABS is a global executive transport platform delivering 24/7 premium chauffeur rides, intercity airport transfers, and corporate fleet management with real-time GPS telemetry.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: '#FFAE00', fontSize: '13px', fontWeight: '700' }}>
                <ShieldCheck size={16} /> ISO 9001:2025 Certified Chauffeur Service
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-title" style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Navigation</h4>
              <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><Link to="/" style={{ color: '#CBD5E1' }}>Home</Link></li>
                <li><Link to="/about" style={{ color: '#CBD5E1' }}>About Executive Fleet</Link></li>
                <li><Link to="/services" style={{ color: '#CBD5E1' }}>Chauffeur Services</Link></li>
                <li><Link to="/book-ride" style={{ color: '#CBD5E1' }}>Book Immediate Ride</Link></li>
                <li><Link to="/contact" style={{ color: '#CBD5E1' }}>Corporate Inquiries</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-col">
              <h4 className="footer-title" style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Support & Dispatch</h4>
              <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><Link to="/contact" style={{ color: '#CBD5E1' }}>24/7 Customer Care</Link></li>
                <li><Link to="/faq" style={{ color: '#CBD5E1' }}>Service Level Agreement</Link></li>
                <li><Link to="/faq" style={{ color: '#CBD5E1' }}>Frequently Asked Questions</Link></li>
                <li><Link to="/admin" style={{ color: '#FFAE00', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>⚡ Admin Dispatch Portal</Link></li>
              </ul>
            </div>

            {/* Global Offices */}
            <div className="footer-col">
              <h4 className="footer-title" style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Global HQ & Hubs</h4>
              <p className="office-text" style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Global HQ:</strong>
                Financial District Tower, Suite 1400<br />
                New York, NY 10005, USA
              </p>
              
              <h4 className="footer-title contact-title" style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: '700', marginTop: '1rem', marginBottom: '0.5rem' }}>24/7 Dispatch Hotline</h4>
              <p className="contact-item" style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Phone size={16} style={{ color: '#FFAE00' }} />
                <span>+1 (800) 555-EMPERIAL</span>
              </p>
              <p className="contact-item" style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: '#FFAE00' }} />
                <span>executive@emperialcabs.com</span>
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom" style={{ paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="footer-legal" style={{ display: 'flex', gap: '16px', color: '#94A3B8', fontSize: '0.85rem' }}>
              <Link to="/faq" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
              <span className="separator">|</span>
              <Link to="/faq" style={{ color: '#94A3B8' }}>Terms of Executive Service</Link>
              <span className="separator">|</span>
              <Link to="/faq" style={{ color: '#94A3B8' }}>Security & Telemetry Compliance</Link>
            </div>

            <div className="store-badges">
              <a href="#download" className="store-badge google-play" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div className="badge-icon">▶</div>
                <div className="badge-text">
                  <small>GET IT ON</small>
                  <span>Google Play</span>
                </div>
              </a>

              <a href="#download" className="store-badge app-store" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div className="badge-icon"></div>
                <div className="badge-text">
                  <small>Download on the</small>
                  <span>App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright" style={{ textAlign: 'center', padding: '2rem 0', color: '#64748B', fontSize: '0.85rem' }}>
          <p>© 2026 EMPERIAL CABS Global Inc. All Rights Reserved. Executive Transport & Chauffeur Services.</p>
        </div>
      </div>
    </footer>
  );
}
