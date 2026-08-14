import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import BookRide from './pages/BookRide';
import AdminPortal from './pages/AdminPortal';
import MobileAppView from './pages/MobileAppView';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ handleOpenBooking, isBookingOpen, handleCloseBooking }) {
  const location = useLocation();
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

  const isAdmin = location.pathname === '/admin';
  const isWebSite = location.pathname === '/web';
  const isMobilePath = location.pathname === '/app' || location.pathname === '/mobile';
  
  // Detect if running on mobile Vercel URL (androidapp-omega.vercel.app) or Capacitor Native App
  const isMobileDomain = hostname.includes('androidapp') || hostname.includes('mobile');
  const isCapacitorNative = typeof window !== 'undefined' && (window.Capacitor !== undefined || window.location.protocol === 'file:');
  const appMode = import.meta.env.VITE_APP_MODE || '';

  if (isAdmin) {
    return <AdminPortal />;
  }

  // Force MobileAppView if on androidapp-omega.vercel.app, Capacitor Native, /app or /mobile
  if (!isWebSite && (isMobileDomain || isMobilePath || isCapacitorNative || appMode === 'mobile')) {
    return <MobileAppView />;
  }

  return (
    <div className="app-container">
      <Header onOpenBooking={handleOpenBooking} />
      
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Home onOpenBooking={handleOpenBooking} />} />
          <Route path="/web" element={<Home onOpenBooking={handleOpenBooking} />} />
          <Route path="/about" element={<About onOpenBooking={handleOpenBooking} />} />
          <Route path="/services" element={<Services onOpenBooking={handleOpenBooking} />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/faq" element={<Faq onOpenBooking={handleOpenBooking} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <BookingModal isOpen={isBookingOpen} onClose={handleCloseBooking} />
    </div>
  );
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <MainLayout 
        handleOpenBooking={handleOpenBooking}
        isBookingOpen={isBookingOpen}
        handleCloseBooking={handleCloseBooking}
      />
    </Router>
  );
}
