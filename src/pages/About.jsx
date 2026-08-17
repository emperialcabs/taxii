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
      title: "Professional and Trained Drivers",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem."
    },
    {
      title: "GPS Tracking and Monitoring",
      content: "Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim."
    },
    {
      title: "Well-Maintained Vehicles",
      content: "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue."
    },
    {
      title: "24/7 Customer Support",
      content: "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem."
    }
  ];

  return (
    <div className="page-about">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span>About</span>
              </div>
              <h1 className="banner-title">Our Story of Service and Excellence</h1>
            </div>
          </div>
        </div>
      </section>

      {/* STORY BEHIND CABSY */}
      <section className="section story-section">
        <div className="container">
          <div className="grid-2-cols align-center">
            <div className="story-text">
              <h2>Fueling Connections The Story behind EMPERIAL CABS</h2>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum
              </p>
              <p>
                Voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum
              </p>

              <div className="stats-counters flex-counters">
                <div className="stat-box">
                  <div className="stat-num">24 +</div>
                  <div className="stat-lbl">Years of Experience</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">1,297 +</div>
                  <div className="stat-lbl">Professional Drivers</div>
                </div>
              </div>
            </div>

            <div className="story-media">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                alt="Driver with EMPERIAL CABS Taxi" 
                className="rounded-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* REDEFINING TRANSPORTATION - VISION, MISSION & METRICS */}
      <section className="section section-mint vision-section">
        <div className="container">
          <div className="section-header">
            <h2>Redefining Transportation for a Connected World</h2>
            <p>Voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores porro quisquam est qui dolorem ipsum</p>
          </div>

          <div className="grid-3-cols vision-grid">
            <div className="card vision-card">
              <div className="icon-box">
                <Eye size={26} />
              </div>
              <h3>Our Vision</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora consequuntur magni</p>
            </div>

            <div className="card vision-card">
              <div className="icon-box">
                <Target size={26} />
              </div>
              <h3>Our Mission</h3>
              <p>Sed adipisci velit, sed quia non numquam eius modi tempora consequuntur magni</p>
            </div>

            <div className="card progress-metrics-card">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Safety Ride</span>
                  <span>92%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Quality Service</span>
                  <span>89%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '89%' }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Happy Passenger</span>
                  <span>95%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Affordable Pricing</span>
                  <span>85%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '85%' }}></div>
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
                alt="Passenger listening to music in ride" 
                className="rounded-img"
              />
            </div>

            <div className="safety-acc-content">
              <h2>Stringent Safety Measures for Peace of Mind</h2>
              <p className="section-desc">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
              </p>

              <div className="accordion-list">
                {safetyItems.map((item, index) => (
                  <div key={index} className={`accordion-item ${openAccordion === index ? 'active' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                      <span>{item.title}</span>
                      {openAccordion === index ? <ChevronUp size={20} className="text-green" /> : <ChevronDown size={20} />}
                    </div>
                    {openAccordion === index && (
                      <div className="accordion-body">
                        <p>{item.content}</p>
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
              <h2>Contact Us for Any Inquiries or Assistance</h2>
              <p className="section-desc">
                Fugit sed quia consequuntur magni dolores eos qui ration nesciunt. Excepteur sint occaecat cupidatat non proident sunt in qui.
              </p>

              <div className="grid-2-cols info-cards">
                <div className="card info-mini-card">
                  <div className="icon-box">
                    <MapPin size={22} />
                  </div>
                  <h4>Our Office</h4>
                  <p className="small-text">Jl. Raya Sesetan No.210, Sesetan, Denpasar, Bali</p>
                </div>

                <div className="card info-mini-card">
                  <div className="icon-box">
                    <Phone size={22} />
                  </div>
                  <h4>Contact Info</h4>
                  <p className="small-text">+62 831-9929-86700<br />contact@domain.com</p>
                </div>
              </div>
            </div>

            <div className="contact-prev-media">
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80" 
                alt="Contact EMPERIAL CABS support" 
                className="rounded-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
