import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, MapPin, Phone, UserCheck, Award, HeartHandshake } from 'lucide-react';
import './Pages.css';

export default function Driver({ onOpenBooking }) {
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const drivers = [
    {
      name: "Jerry Gomez",
      rating: 5.0,
      since: 2018,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Louis Le Goff",
      rating: 4.8,
      since: 2018,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Tejas Mehta",
      rating: 4.6,
      since: 2019,
      img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Arthur Roux",
      rating: 4.5,
      since: 2021,
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Nate Thompson",
      rating: 4.5,
      since: 2020,
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="page-driver">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span>Driver</span>
              </div>
              <h1 className="banner-title">Immense Pride in Our Outstanding Team</h1>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCING OUR BEST DRIVERS */}
      <section className="section best-drivers-section">
        <div className="container">
          <div className="section-header align-left">
            <h2>Introducing Our Best Drivers</h2>
            <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi</p>
          </div>

          <div className="driver-cards-grid">
            {drivers.map((drv, idx) => (
              <div key={idx} className="card driver-card">
                <div className="driver-img-box">
                  <img src={drv.img} alt={drv.name} />
                </div>
                <div className="driver-info">
                  <div className="driver-stars">
                    <span className="rating-num">{drv.rating}</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#00b87c" color="#00b87c" />
                    ))}
                  </div>
                  <h3>{drv.name}</h3>
                  <p className="driver-since">Empire Cab Driver Since {drv.since}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFIT OF JOINING */}
      <section className="section benefits-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="benefit-media">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80" 
                alt="Driver in cab" 
                className="rounded-img"
              />
            </div>

            <div className="benefit-text">
              <h2>Explore the Benefits of Joining Our Driver Team</h2>
              <p className="section-desc">
                Fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
              </p>

              <div className="grid-2-cols checklist-grid">
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Flexible Schedule</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Training and Development</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Passenger Referrals</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={20} className="check-icon" />
                  <span>Exclusive Rewards and Incentives</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITMENT CTA BANNER */}
      <section className="section recruitment-section">
        <div className="container">
          <div className="recruitment-card section-mint">
            <div className="grid-2-cols align-center">
              <div className="recruitment-text">
                <h2>Wanna Become A Part of Our Dedicated Team of Empire Cab Drivers?</h2>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam laboriosam, nisi ut aliquid ex ea commodi consequatur</p>
                
                <button onClick={() => setSignUpModalOpen(true)} className="btn btn-primary">
                  Sign Up As A Driver
                </button>
              </div>

              <div className="recruitment-media text-center">
                <img 
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                  alt="Become a Empire Cab driver" 
                  className="rounded-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRIVER SUCCESS STORIES */}
      <section className="section success-stories-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories from Our Driver Community</h2>
            <p>Neque porro quisquam est qui dolorem ipsum adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et</p>
          </div>

          <div className="grid-2-cols">
            <div className="card story-quote-card">
              <div className="story-img-wrap">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80" alt="Craig Carter" />
              </div>
              <p className="quote-body">
                "Being Empire Cab taxi driver has not only provided me with a stable income but has also opened doors to endless opportunities and personal growth."
              </p>
              <div className="quote-author-info">
                <strong>— Craig Carter</strong>
                <small>Empire Cab Driver Since 2019</small>
              </div>
            </div>

            <div className="card story-quote-card">
              <div className="story-img-wrap">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80" alt="Marwane Perez" />
              </div>
              <p className="quote-body">
                "What I love most about being a driver with Empire Cab is the freedom and flexibility it offers, allowing me to strike a perfect work-life balance."
              </p>
              <div className="quote-author-info">
                <strong>— Marwane Perez</strong>
                <small>Empire Cab Driver Since 2021</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRIVER SIGNUP MODAL */}
      {signUpModalOpen && (
        <div className="modal-overlay" onClick={() => setSignUpModalOpen(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join Empire Cab Driver Fleet</h2>
              <p>Apply to become a verified driver partner today.</p>
            </div>
            
            {!formSubmitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="booking-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your full name" required />
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" required />
                </div>

                <div className="input-group">
                  <label>City &amp; Driving License ID</label>
                  <input type="text" placeholder="e.g. San Francisco, DL-99201" required />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Submit Driver Application
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h3>Application Submitted!</h3>
                <p>Our fleet manager will contact you within 24 hours to schedule your vehicle inspection and orientation.</p>
                <button onClick={() => { setFormSubmitted(false); setSignUpModalOpen(false); }} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
