import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="portfolio-section not-found-view container">
      <h2>404 - Page Not Found</h2>
      <p className="error-text">
        The route you are trying to access does not exist on this portfolio.
      </p>
      <div className="back-link-wrapper">
        <Link to="/" className="btn-back-home">
          Go Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
