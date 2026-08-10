import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, ArrowRight } from 'lucide-react';
import './Pages.css';

export default function Blog() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="page-blog">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="breadcrumb">
                <Link to="/">Home</Link> &gt; <span>Blog</span>
              </div>
              <h1 className="banner-title">Discover our Blog for News, Travel Stories, and Expert Tips</h1>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST UPDATES LEAD SECTION */}
      <section className="section blog-lead-section">
        <div className="container">
          <h2 className="section-title-left">Latest Updates</h2>

          <div className="grid-blog-featured">
            {/* Featured Main Post */}
            <article className="card featured-post-card">
              <div className="featured-img-wrap">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80" alt="Eco Friendly Transportation" />
                <span className="blog-category">Sustainability</span>
              </div>
              <div className="featured-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">Exploring Eco-Friendly Transportation: The Role of Taxis in Sustainable Cities</Link></h3>
                <p className="blog-meta">By Jane Doe • June 21, 2023</p>
                <p className="featured-snippet">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </article>

            {/* Side Articles */}
            <div className="blog-side-list">
              <article className="card side-blog-card">
                <div className="side-blog-img">
                  <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80" alt="Rush Hour" />
                </div>
                <div className="side-blog-content">
                  <h4><Link to="/blog/exploring-eco-friendly-transportation">Navigating Rush Hour: Tips for a Smooth Commute in the City</Link></h4>
                  <p className="blog-meta">By Jane Doe • June 22, 2023</p>
                </div>
              </article>

              <article className="card side-blog-card">
                <div className="side-blog-img">
                  <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80" alt="Rise of Ride-Sharing" />
                </div>
                <div className="side-blog-content">
                  <h4><Link to="/blog/exploring-eco-friendly-transportation">The Rise of Ride-Sharing: Exploring the Future of Transportation</Link></h4>
                  <p className="blog-meta">By Jane Doe • June 22, 2023</p>
                </div>
              </article>

              <article className="card side-blog-card">
                <div className="side-blog-img">
                  <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop&q=80" alt="Traveling in Style" />
                </div>
                <div className="side-blog-content">
                  <h4><Link to="/blog/exploring-eco-friendly-transportation">Traveling in Style: Luxury Taxi Services Redefining the Ride Experience</Link></h4>
                  <p className="blog-meta">By Jane Doe • June 22, 2023</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE NEWSLETTER BANNER */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-card section-mint">
            <div className="newsletter-content">
              <h3>Subscribe To Our Newsletter</h3>
              <p>By joining our mailing list, you'll gain access to a world of benefits, including exclusive offers, latest updates, and community involvement</p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="subscribed-msg">
                <span>✓ Thank you for subscribing! Check your inbox for updates.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6 BLOG GRID SECTION */}
      <section className="section blog-grid-section">
        <div className="container">
          <div className="grid-3-cols">
            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80" alt="Eco-Friendly" />
                <span className="blog-category">Sustainability</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">Exploring Eco-Friendly Transportation: The Role of Taxis in Sustainable Cities</Link></h3>
                <p className="blog-meta">By Jane Doe • June 21, 2023</p>
              </div>
            </article>

            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80" alt="Customer Service" />
                <span className="blog-category">Customer</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">The Art of Customer Service: How Taxi Companies Excel in Passenger Satisfaction</Link></h3>
                <p className="blog-meta">By Jane Doe • June 23, 2023</p>
              </div>
            </article>

            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Safety First" />
                <span className="blog-category">Safety</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">Safety First: Ensuring Secure and Reliable Taxi Services for Every Journey</Link></h3>
                <p className="blog-meta">By Jane Doe • June 23, 2023</p>
              </div>
            </article>

            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80" alt="Unlocking Convenience" />
                <span className="blog-category">Innovation</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">Unlocking Convenience: How Taxi Services Are Revolutionizing Urban Mobility</Link></h3>
                <p className="blog-meta">By Jane Doe • June 21, 2023</p>
              </div>
            </article>

            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" alt="Future of Taxi" />
                <span className="blog-category">Innovation</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">The Future of Taxi Services: Embracing Innovation for Seamless Transportation</Link></h3>
                <p className="blog-meta">By Jane Doe • June 23, 2023</p>
              </div>
            </article>

            <article className="card blog-card">
              <div className="blog-img-wrap">
                <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" alt="Background Checks" />
                <span className="blog-category">Safety</span>
              </div>
              <div className="blog-body">
                <h3><Link to="/blog/exploring-eco-friendly-transportation">Safety First: The Importance of Background Checks for Taxi Drivers</Link></h3>
                <p className="blog-meta">By Jane Doe • June 22, 2023</p>
              </div>
            </article>
          </div>

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <button className="btn btn-primary">Load More</button>
          </div>
        </div>
      </section>
    </div>
  );
}
