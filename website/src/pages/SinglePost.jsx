import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import './Pages.css';

export default function SinglePost() {
  const [comment, setComment] = useState('');
  const [commentPosted, setCommentPosted] = useState(false);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (comment) setCommentPosted(true);
  };

  return (
    <div className="page-single-post">
      {/* BANNER */}
      <section className="page-banner single-post-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-overlay"></div>
            <div className="banner-content text-center">
              <p className="blog-meta-white">Jane Doe • June 23, 2023</p>
              <h1 className="banner-title text-center">Exploring Eco-Friendly Transportation: The Role of Taxis in Sustainable Cities</h1>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT & SIDEBAR */}
      <section className="section article-section">
        <div className="container">
          <div className="grid-article-layout">
            <main className="article-main">
              <h2>The Significant Role That Taxis Play in Building Sustainable Cities</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
              </p>

              <ul className="article-checklist">
                <li><CheckCircle2 size={16} className="text-green" /> Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit</li>
                <li><CheckCircle2 size={16} className="text-green" /> Quae ab illo inventore veritatis et quasi architecto beatae vitae dicta</li>
                <li><CheckCircle2 size={16} className="text-green" /> Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit</li>
                <li><CheckCircle2 size={16} className="text-green" /> Adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore</li>
              </ul>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>

              <div className="article-image-full">
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1000&auto=format&fit=crop&q=80" alt="Eco Taxi" className="rounded-img" />
              </div>

              <h2>Role in Reducing Carbon Emissions and Promoting Eco-friendly Practices</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>

              <div className="grid-2-cols checklist-grid">
                <div className="check-item"><CheckCircle2 size={20} className="check-icon" /><span>Improve air quality</span></div>
                <div className="check-item"><CheckCircle2 size={20} className="check-icon" /><span>Reduce carbon emissions</span></div>
                <div className="check-item"><CheckCircle2 size={20} className="check-icon" /><span>Contribute Sustainability</span></div>
                <div className="check-item"><CheckCircle2 size={20} className="check-icon" /><span>Reduced traffic volume</span></div>
              </div>

              <div className="grid-2-cols article-dual-images">
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80" alt="Taxi passenger" className="rounded-img" />
                <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80" alt="Hailing a ride" className="rounded-img" />
              </div>

              <div className="article-footer-meta">
                <div className="article-tags">
                  <strong>Tags:</strong> <span>Sustainability</span>
                </div>
                <div className="article-share">
                  <strong>Share This:</strong>
                  <div className="share-icons">
                    <a href="#share"><Facebook size={18} /></a>
                    <a href="#share"><Twitter size={18} /></a>
                    <a href="#share"><Linkedin size={18} /></a>
                  </div>
                </div>
              </div>

              {/* COMMENTS FORM */}
              <div className="comments-section">
                <h3>Leave a Reply</h3>
                <p className="comment-note">Logged in as Jane Doe. Required fields are marked *</p>

                {!commentPosted ? (
                  <form onSubmit={handlePostComment} className="comment-form">
                    <div className="input-group">
                      <label>Comment *</label>
                      <textarea 
                        rows="5" 
                        placeholder="Write your thoughts..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                      Post Comment
                    </button>
                  </form>
                ) : (
                  <div className="subscribed-msg">
                    <span>✓ Your comment has been posted!</span>
                  </div>
                )}
              </div>
            </main>

            {/* SIDEBAR NEWSLETTER */}
            <aside className="article-sidebar">
              <div className="card newsletter-sidebar-card">
                <div className="icon-box"><Mail size={24} /></div>
                <h3>Subscribe to Our Newsletter</h3>
                <p>Duis aute irure dolor in voluptate velit do eiusmod tempor</p>
                <form onSubmit={(e) => e.preventDefault()} className="sidebar-newsletter-form">
                  <input type="email" placeholder="Enter your email" required />
                  <button type="submit" className="btn btn-primary btn-block">Subscribe</button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
