import React, { useState } from 'react';

function Projects({ onViewDetails }) {
  const [filter, setFilter] = useState('all');

  const projectsData = [
    {
      id: 'papertrail',
      title: 'Paper Trail',
      badge: 'Natural Language Processing / Backend',
      categories: ['backend', 'data'],
      desc: 'Locally-hosted academic research assistant parsing PDF files, executing local keyword matrix checks, and computing Dice similarity coefficients to map connections between research publications.',
      tech: ['FastAPI', 'Python', 'SQLAlchemy', 'pdfminer', 'ArXiv API']
    },
    {
      id: 'fleetflow',
      title: 'FleetFlow Logistics',
      badge: 'Odoo Hackathon Project',
      highlight: true,
      categories: ['backend'],
      desc: 'Full-stack enterprise logistics tracker and vehicle dispatch core separating driver log entries from manager approvals. Integrates custom Express routing gateways and Zustand status synchronization.',
      tech: ['React', 'Express.js', 'Node.js', 'SQLite3', 'Zustand']
    },
    {
      id: 'shopdot',
      title: 'ShopDot Backend',
      badge: 'Internship Project',
      highlight: true,
      categories: ['backend'],
      desc: 'B2B drop-shipping purchase routing validation engine. Inspects catalog stock quantities, decrements storage volumes, and dispatches supplier queue payloads in transaction-safe database scopes.',
      tech: ['FastAPI', 'Python', 'Uvicorn', 'Pydantic', 'SQLite']
    },
    {
      id: 'chainbeasts',
      title: 'ChainBeasts & $POWER',
      badge: 'EVM Smart Contracts',
      categories: ['web3'],
      desc: 'Solidity gaming evolution contracts. Coordinates ERC721 metadata phase changes linked with transactional ERC20 token burns, utilizing gas-optimized custom compiler errors.',
      tech: ['Solidity', 'Foundry', 'OpenZeppelin v5', 'ERC-721', 'ERC-20']
    },
    {
      id: 'walmart',
      title: 'Walmart Sales EDA',
      badge: 'Data Science',
      categories: ['data'],
      desc: 'Statistical data science modeling store sales efficiency margins and holiday spikes, correlating CPI, fuel pricing, and unemployment pressures in Jupyter Notebook structures.',
      tech: ['Python', 'Jupyter Notebook', 'Pandas', 'Matplotlib', 'Seaborn']
    }
  ];

  const filterButtons = [
    { value: 'all', label: 'All Systems' },
    { value: 'backend', label: 'Web & Backend' },
    { value: 'web3', label: 'Blockchain & Web3' },
    { value: 'data', label: 'Data Science' }
  ];

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.categories.includes(filter));

  return (
    <section id="projects" className="portfolio-section container">
      <h2>Engineered Projects</h2>
      <p className="contact-intro">A collection of systems-focused software built with high efficiency, algorithmic clarity, and clean structures.</p>

      {/* Filter Buttons */}
      <div className="filter-container">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            className={`filter-btn ${filter === btn.value ? 'active' : ''}`}
            onClick={() => setFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-card-body">
              <span className={project.highlight ? 'project-badge-highlight' : 'project-badge'}>
                {project.badge}
              </span>
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-description">{project.desc}</p>
              
              <div className="project-tech-stack">
                {project.tech.map(t => <span key={t}>{t}</span>)}
              </div>
              
              <button 
                type="button"
                className="btn-card-details"
                onClick={() => onViewDetails(project.id)}
              >
                View System Architecture
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
