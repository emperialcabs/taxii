import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone, Car, ShieldCheck, Globe } from 'lucide-react';
import './Header.css';

export default function Header({ onOpenBooking }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Executive Multinational Info Bar */}
      <div className="top-exec-bar" style={{ background: '#0F172A', color: '#94A3B8', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontWeight: '500' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFAE00' }}>
              <Globe size={14} /> 24/7 Global Executive Dispatch
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10B981" /> 100% Punctuality & Chauffeur Safety Guaranteed
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="tel:+18005553673" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: '600', textDecoration: 'none' }}>
              <Phone size={13} color="#FFAE00" /> +1 (800) 555-EMPERIAL
            </a>
            <Link to="/admin" style={{ color: '#FFAE00', fontWeight: '700', fontSize: '12px', background: 'rgba(255, 174, 0, 0.12)', padding: '2px 10px', borderRadius: '12px', border: '1px solid rgba(255, 174, 0, 0.3)' }}>
              ⚡ Dispatcher Portal
            </Link>
          </div>
        </div>
      </div>

      <header className={`cabsy-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          {/* Logo */}
          <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/images/logo.svg" alt="EMPERIAL CABS" style={{ height: '70px', width: 'auto', borderRadius: '0px', padding: '2px 4px', background: '#FFFFFF', border: '1px solid #0F172A' }} />
          </Link>

          {/* Navigation Menu */}
          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  to="/about" 
                  className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                >
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  to="/services" 
                  className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                >
                  Services
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  to="/book-ride" 
                  className={`nav-link ${location.pathname === '/book-ride' ? 'active' : ''}`}
                >
                  Book Ride
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  to="/contact" 
                  className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="header-actions">
            <Link to="/book-ride" className="btn btn-primary header-cta-btn" style={{ background: 'linear-gradient(135deg, #FFAE00 0%, #E09900 100%)', color: '#0F172A', fontWeight: '800', border: 'none', boxShadow: '0 6px 20px rgba(255, 174, 0, 0.35)' }}>
              <Car size={18} />
              <span>Book Ride</span>
            </Link>
            
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
