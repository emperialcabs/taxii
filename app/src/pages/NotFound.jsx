import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function NotFound() {
  return (
    <div className="page-404">
      <div className="container">
        <div className="card notfound-card">
          <div className="notfound-overlay"></div>
          <div className="notfound-content text-center">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-desc">Sorry, the page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
