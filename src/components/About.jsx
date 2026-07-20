import React from 'react';

function About() {
  return (
    <section id="about" className="portfolio-section">
      <h2>About Me</h2>
      <p className="about-text">
        I am a backend-focused systems software engineer specializing in scalable API design, smart contracts, NLP processing, and data pipeline optimization. I focus on building robust logical architectures, clean database structures, and high-performance backend cores.
      </p>
      
      <div className="experience-highlights">
        <h3>Selected Engineering Highlights</h3>
        
        <div className="highlight-item">
          <h4>ShopDot - Internship Project</h4>
          <p className="highlight-meta">Role: Backend Intern | Tech: FastAPI, Python, SQLAlchemy, SQLite, Pydantic, Hashing (bcrypt)</p>
          <p>
            Engineered a B2B drop-shipping order validation framework checking stock levels dynamically, calculating purchase details, decrementing database stock values, and automated supplier routing.
          </p>
        </div>

        <div className="highlight-item">
          <h4>FleetFlow - Odoo Hackathon Project</h4>
          <p className="highlight-meta">Role: Backend Architect | Tech: React (Vite), Express.js, Node.js, SQLite3, Zustand, TailwindCSS</p>
          <p>
            Developed a full-stack logistics tracker isolating driver entries (logs, expenses) from dispatch manager controls (approvals, vehicle registries).
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
