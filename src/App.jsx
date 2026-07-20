import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import Skills from './components/Skills';

// Detailed specifications for interactive system flow modals
const PROJECT_DETAILS = {
  papertrail: {
    badge: "Natural Language Processing / Backend",
    title: "Paper Trail",
    role: "Lead Systems Developer",
    timeline: "SGP Academic Term 2025-26",
    challenge: "Developing an academic paper indexing assistant that processes PDF documents and evaluates similarity without the usage latency or API cost of large-scale commercial model deployments.",
    solution: "Engineered a local similarity calculation based on tokenizing extracted texts, stripping standard stopwords, constructing key-value frequency hashes, and computing Dice's coefficients. Combined this algorithm with concurrent arXiv lookups using Python's concurrent.futures.",
    highlights: [
      "Optimized pdfminer library pipeline to extract structured paragraphs from academic papers dynamically.",
      "Created an in-memory Dice Similarity coefficient engine comparing keyword vectors with local pickle caching.",
      "Integrated multi-threaded query execution mapping keyword strings against standard arXiv APIs.",
      "Implemented security layer with bcrypt user authentication, SQLAlchemy SQLite tables, and JWT credentials."
    ],
    diagram: (
      <svg className="arch-svg" viewBox="0 0 700 280">
        <rect width="100%" height="100%" fill="none" />
        <g className="node-group">
          <rect className="node-rect" x="30" y="100" width="110" height="60" rx="6" />
          <text x="85" y="130" fill="currentColor" textAnchor="middle">Paper PDF</text>
          <text x="85" y="145" className="text-secondary" textAnchor="middle" fontSize="9">File Input</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="50" width="130" height="70" rx="6" />
          <text x="255" y="85" fill="currentColor" textAnchor="middle">PDF Text Extractor</text>
          <text x="255" y="102" className="text-highlight" textAnchor="middle" fontSize="9">pdfminer.high_level</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="150" width="130" height="70" rx="6" />
          <text x="255" y="185" fill="currentColor" textAnchor="middle">Tokenizing Engine</text>
          <text x="255" y="202" className="text-highlight" textAnchor="middle" fontSize="9">Stopword Filter &amp; Hash</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="100" width="130" height="70" rx="6" />
          <text x="440" y="135" fill="currentColor" textAnchor="middle">Similarity Core</text>
          <text x="440" y="152" className="text-highlight" textAnchor="middle" fontSize="9">Dice Coefficient Algo</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight-secondary" x="550" y="100" width="120" height="60" rx="6" />
          <text x="610" y="130" fill="currentColor" textAnchor="middle">Recommendation</text>
          <text x="610" y="145" className="text-highlight-sec" textAnchor="middle" fontSize="9">Shared Key Explainers</text>
        </g>
        <path className="connector-line" d="M 140 130 Q 165 130 165 85 L 190 85" fill="none"/>
        <path className="connector-line" d="M 140 130 Q 165 130 165 185 L 190 185" fill="none"/>
        <path className="connector-line" d="M 320 85 Q 350 85 350 135 L 375 135" fill="none"/>
        <path className="connector-line" d="M 320 185 Q 350 185 350 135 L 375 135" fill="none"/>
        <path className="connector-line" d="M 505 135 L 550 135" fill="none"/>
        <polygon className="connector-arrow" points="190,85 183,81 183,89" />
        <polygon className="connector-arrow" points="190,185 183,181 183,189" />
        <polygon className="connector-arrow" points="375,135 368,131 368,139" />
        <polygon className="connector-arrow" points="550,135 543,131 543,139" />
      </svg>
    )
  },
  fleetflow: {
    badge: "Odoo Hackathon Project",
    title: "FleetFlow Logistics Tracker",
    role: "Backend Architect & Team Lead",
    timeline: "Odoo Hackathon Submission",
    challenge: "Designing an integrated management suite mapping vehicles, drivers, approval matrices, and budgets under hackathon time limitations, ensuring quick data synchronization and strong authorization levels.",
    solution: "Engineered a lightweight Node.js Express server using SQLite3. Handled state propagation through global Zustand stores in React, partitioning roles between drivers logging logs/expenses and dispatch managers orchestrating approvals.",
    highlights: [
      "Configured Express middleware routing API requests based on authorization profiles (Driver vs Manager).",
      "Designed schema maps within SQLite databases supporting cascading relationships for trip dispatchers.",
      "Integrated asynchronous approval pipelines where managers approve maintenance schedules and fuel expense budgets.",
      "Optimized layout responsiveness using Tailwind CSS grids customized via modern styling metrics."
    ],
    diagram: (
      <svg className="arch-svg" viewBox="0 0 700 280">
        <rect width="100%" height="100%" fill="none" />
        <g className="node-group">
          <rect className="node-rect" x="30" y="40" width="110" height="60" rx="6" />
          <text x="85" y="70" fill="currentColor" textAnchor="middle">Manager View</text>
          <text x="85" y="85" className="text-secondary" textAnchor="middle" fontSize="9">React Desktop</text>
        </g>
        <g className="node-group">
          <rect className="node-rect" x="30" y="170" width="110" height="60" rx="6" />
          <text x="85" y="200" fill="currentColor" textAnchor="middle">Driver View</text>
          <text x="85" y="215" className="text-secondary" textAnchor="middle" fontSize="9">React Mobile</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="200" y="105" width="130" height="60" rx="6" />
          <text x="265" y="135" fill="currentColor" textAnchor="middle">Zustand Store</text>
          <text x="265" y="148" className="text-highlight" textAnchor="middle" fontSize="9">Client State Sync</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="380" y="100" width="130" height="70" rx="6" />
          <text x="445" y="130" fill="currentColor" textAnchor="middle">Express Server</text>
          <text x="445" y="148" className="text-highlight" textAnchor="middle" fontSize="9">Auth &amp; Role Routing</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight-secondary" x="560" y="105" width="110" height="60" rx="6" />
          <text x="615" y="135" fill="currentColor" textAnchor="middle">SQLite DB</text>
          <text x="615" y="148" className="text-highlight-sec" textAnchor="middle" fontSize="9">Relational Ledger</text>
        </g>
        <path className="connector-line" d="M 140 70 Q 170 70 170 120 L 200 120" fill="none"/>
        <path className="connector-line" d="M 140 200 Q 170 200 170 150 L 200 150" fill="none"/>
        <path className="connector-line" d="M 330 135 L 380 135" fill="none"/>
        <path className="connector-line" d="M 510 135 L 560 135" fill="none"/>
        <polygon className="connector-arrow" points="200,120 193,116 193,124" />
        <polygon className="connector-arrow" points="200,150 193,146 193,154" />
        <polygon className="connector-arrow" points="380,135 373,131 373,139" />
        <polygon className="connector-arrow" points="560,135 553,131 553,139" />
      </svg>
    )
  },
  shopdot: {
    badge: "Internship Project",
    title: "ShopDot Dropshipping Engine",
    role: "Backend Intern",
    timeline: "Summer Internship Work",
    challenge: "Developing a reliable drop-shipping order validation framework checking multi-brand catalog inventories dynamically, computing order parameters, and dispatching supplier routing triggers.",
    solution: "Constructed a FastAPI microservice using SQLAlchemy database queries and Pydantic schemas. Orders are checked against real-time product stock, inventories decrement in-memory or database systems, and order states route automatically to specific suppliers.",
    highlights: [
      "Implemented POST /orders endpoint checking inventory volumes across multiple supplier records.",
      "Designed modular FastAPI routes (auth, products, orders, analytics) clean-partitioning business processes.",
      "Developed default seeding triggers populating mock suppliers (Aura Goods, VoltTech) and items.",
      "Validated inbound JSON data payloads dynamically using Pydantic models for type safety."
    ],
    diagram: (
      <svg className="arch-svg" viewBox="0 0 700 280">
        <rect width="100%" height="100%" fill="none" />
        <g className="node-group">
          <rect className="node-rect" x="30" y="105" width="110" height="60" rx="6" />
          <text x="85" y="135" fill="currentColor" textAnchor="middle">Retailer Purchase</text>
          <text x="85" y="148" className="text-secondary" textAnchor="middle" fontSize="9">JSON Request</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="100" width="130" height="70" rx="6" />
          <text x="255" y="130" fill="currentColor" textAnchor="middle">FastAPI Middleware</text>
          <text x="255" y="148" className="text-highlight" textAnchor="middle" fontSize="9">Pydantic Schema Audit</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="40" width="130" height="60" rx="6" />
          <text x="440" y="70" fill="currentColor" textAnchor="middle">Inventory Engine</text>
          <text x="440" y="83" className="text-highlight" textAnchor="middle" fontSize="9">Stock Verification</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="170" width="130" height="60" rx="6" />
          <text x="440" y="200" fill="currentColor" textAnchor="middle">Supplier Router</text>
          <text x="440" y="213" className="text-highlight" textAnchor="middle" fontSize="9">Auto-routing Logic</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight-secondary" x="560" y="105" width="110" height="60" rx="6" />
          <text x="615" y="135" fill="currentColor" textAnchor="middle">Brand Supplier</text>
          <text x="615" y="148" className="text-highlight-sec" textAnchor="middle" fontSize="9">Fulfillment API Queue</text>
        </g>
        <path className="connector-line" d="M 140 135 L 190 135" fill="none"/>
        <path className="connector-line" d="M 320 135 Q 345 135 345 70 L 375 70" fill="none"/>
        <path className="connector-line" d="M 320 135 Q 345 135 345 200 L 375 200" fill="none"/>
        <path className="connector-line" d="M 505 70 Q 535 70 535 135 L 560 135" fill="none"/>
        <path className="connector-line" d="M 505 200 Q 535 200 535 135 L 560 135" fill="none"/>
        <polygon className="connector-arrow" points="190,135 183,131 183,139" />
        <polygon className="connector-arrow" points="375,70 368,66 368,74" />
        <polygon className="connector-arrow" points="375,200 368,196 368,204" />
        <polygon className="connector-arrow" points="560,135 553,131 553,139" />
      </svg>
    )
  },
  chainbeasts: {
    badge: "EVM Smart Contracts",
    title: "ChainBeasts Smart Contracts & Ecosystem",
    role: "Web3 Contract Engineer",
    timeline: "Blockchain Development Term",
    challenge: "Establishing standard on-chain evolutionary rules for ERC721 gaming beasts paid and processed via custom ERC20 utility token systems, keeping transactions secure and gas usage minimal.",
    solution: "Coded EVM Smart Contracts utilizing OpenZeppelin v5 frameworks in Solidity. Managed state progression where custom evolutionary nodes (stages 1, 2, and 3) fetch decentralized IPFS metadata dynamically upon verify-paying PowerToken burns.",
    highlights: [
      "Programmed ChainBeasts ERC721 contract processing NFT minting and phase progressions.",
      "Wrote PowerToken ERC20 token containing native burning and airdrop-distribution loops.",
      "Wrote secure custom errors (AlreadyMaxStage, NotBeastOwner) lowering overall gas footprint.",
      "Formulated testing suites in Foundry building comprehensive assertions on token-spending boundaries."
    ],
    diagram: (
      <svg className="arch-svg" viewBox="0 0 700 280">
        <rect width="100%" height="100%" fill="none" />
        <g className="node-group">
          <rect className="node-rect" x="30" y="105" width="110" height="60" rx="6" />
          <text x="85" y="135" fill="currentColor" textAnchor="middle">User Wallet</text>
          <text x="85" y="148" className="text-secondary" textAnchor="middle" fontSize="9">EVM Tx Source</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="40" width="130" height="60" rx="6" />
          <text x="255" y="70" fill="currentColor" textAnchor="middle">PowerToken ERC20</text>
          <text x="255" y="83" className="text-highlight" textAnchor="middle" fontSize="9">$POWER Token Contract</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="100" width="130" height="70" rx="6" />
          <text x="440" y="130" fill="currentColor" textAnchor="middle">ChainBeasts ERC721</text>
          <text x="440" y="148" className="text-highlight" textAnchor="middle" fontSize="9">Evolution Controller</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="170" width="130" height="60" rx="6" />
          <text x="255" y="200" fill="currentColor" textAnchor="middle">Token Burner</text>
          <text x="255" y="213" className="text-highlight" textAnchor="middle" fontSize="9">Evolve Payment Burn</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight-secondary" x="560" y="105" width="110" height="60" rx="6" />
          <text x="615" y="135" fill="currentColor" textAnchor="middle">IPFS Nodes</text>
          <text x="615" y="148" className="text-highlight-sec" textAnchor="middle" fontSize="9">Stage Metadata Metadata</text>
        </g>
        <path className="connector-line" d="M 140 135 Q 165 135 165 70 L 190 70" fill="none"/>
        <path className="connector-line" d="M 140 135 Q 165 135 165 200 L 190 200" fill="none"/>
        <path className="connector-line" d="M 320 70 Q 350 70 350 120 L 375 120" fill="none"/>
        <path className="connector-line" d="M 320 200 Q 350 200 350 150 L 375 150" fill="none"/>
        <path className="connector-line" d="M 505 135 L 560 135" fill="none"/>
        <polygon className="connector-arrow" points="190,70 183,66 183,74" />
        <polygon className="connector-arrow" points="190,200 183,196 183,204" />
        <polygon className="connector-arrow" points="375,120 368,116 368,124" />
        <polygon className="connector-arrow" points="375,150 368,146 368,154" />
        <polygon className="connector-arrow" points="560,135 553,131 553,139" />
      </svg>
    )
  },
  walmart: {
    badge: "Data Science",
    title: "Walmart Sales EDA & Modeling",
    role: "Data Analyst",
    timeline: "Data Analytics Term",
    challenge: "Analyzing multi-store sales registries across weather variables, holidays, and macro-economics (CPI, Unemployment) to detect growth drivers and isolate underperforming assets.",
    solution: "Programmed data-science routines inside Jupyter Notebooks. Processed massive CSV matrices with Pandas, ran exploratory queries mapping store sales correlation boundaries, and visualized profiles via Seaborn.",
    highlights: [
      "Conducted comprehensive outlier cleansing on extensive row records from Walmart registries.",
      "Constructed multivariate correlation tables mapping economic pressure indices against overall revenue.",
      "Designed store-wide efficiency visualization charts plotting revenue standard deviations.",
      "Automated seasonality adjustments explaining sales spikes surrounding holidays (Thanksgiving, Christmas)."
    ],
    diagram: (
      <svg className="arch-svg" viewBox="0 0 700 280">
        <rect width="100%" height="100%" fill="none" />
        <g className="node-group">
          <rect className="node-rect" x="30" y="105" width="110" height="60" rx="6" />
          <text x="85" y="135" fill="currentColor" textAnchor="middle">Walmart CSV</text>
          <text x="85" y="148" className="text-secondary" textAnchor="middle" fontSize="9">File Database</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="190" y="100" width="130" height="70" rx="6" />
          <text x="255" y="130" fill="currentColor" textAnchor="middle">Pandas Processing</text>
          <text x="255" y="148" className="text-highlight" textAnchor="middle" fontSize="9">Clean &amp; Outliers</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="40" width="130" height="60" rx="6" />
          <text x="440" y="70" fill="currentColor" textAnchor="middle">Economic Impact</text>
          <text x="440" y="83" className="text-highlight" textAnchor="middle" fontSize="9">CPI / Fuel Metrics</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight" x="375" y="170" width="130" height="60" rx="6" />
          <text x="440" y="200" fill="currentColor" textAnchor="middle">Store Analytics</text>
          <text x="440" y="213" className="text-highlight" textAnchor="middle" fontSize="9">Sales Distribution Maps</text>
        </g>
        <g className="node-group">
          <rect className="node-rect highlight-secondary" x="560" y="105" width="110" height="60" rx="6" />
          <text x="615" y="135" fill="currentColor" textAnchor="middle">Visual Plots</text>
          <text x="615" y="148" className="text-highlight-sec" textAnchor="middle" fontSize="9">Matplotlib &amp; Seaborn</text>
        </g>
        <path className="connector-line" d="M 140 135 L 190 135" fill="none"/>
        <path className="connector-line" d="M 320 135 Q 345 135 345 70 L 375 70" fill="none"/>
        <path className="connector-line" d="M 320 135 Q 345 135 345 200 L 375 200" fill="none"/>
        <path className="connector-line" d="M 505 70 Q 535 70 535 135 L 560 135" fill="none"/>
        <path className="connector-line" d="M 505 200 Q 535 200 535 135 L 560 135" fill="none"/>
        <polygon className="connector-arrow" points="190,135 183,131 183,139" />
        <polygon className="connector-arrow" points="375,70 368,66 368,74" />
        <polygon className="connector-arrow" points="375,200 368,196 368,204" />
        <polygon className="connector-arrow" points="560,135 553,131 553,139" />
      </svg>
    )
  }
};

function App() {
  const location = useLocation();
  
  // 1. useState for Theme (dark by default, toggles to light)
  const [theme, setTheme] = useState('dark');
  
  // 2. useState for details modal overlay
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Dynamic Props data
  const name = "Saumya Patel";
  const themeColor = "transparent"; // Styled dynamic gradient background
  const skillList = [
    "Python", "JavaScript", "TypeScript", "Solidity", "SQL", "C++",
    "FastAPI", "Express.js", "Node.js", "RESTful APIs",
    "SQLAlchemy", "SQLite", "PostgreSQL",
    "Foundry Framework", "OpenZeppelin v5", "ERC-20", "ERC-721 Standards",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Dice Similarity Coefficients", "pdfminer",
    "Git", "GitHub Actions", "Docker"
  ];

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  // Apply theme class globally to document body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Handle escape key to close details modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenModal = (projectId) => {
    setSelectedProjectId(projectId);
    document.body.style.overflow = 'hidden'; // Disable scroll on background
  };

  const handleCloseModal = () => {
    setSelectedProjectId(null);
    document.body.style.overflow = 'auto'; // Re-enable scroll
  };

  // Get active modal project details
  const activeProject = selectedProjectId ? PROJECT_DETAILS[selectedProjectId] : null;

  return (
    <div className="portfolio-app">
      {/* Background Neon Glowing Accents */}
      <div className="glow-wrapper">
        <div className="radial-glow glow-1"></div>
        <div className="radial-glow glow-2"></div>
        <div className="radial-glow glow-3"></div>
      </div>

      <NavBar 
        activePath={location.pathname} 
        navItems={navItems} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="portfolio-main">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="home-route-wrapper">
                <Home name={name} themeColor={themeColor} />
                <Skills skillList={skillList} />
              </div>
            } 
          />
          <Route 
            path="/projects" 
            element={<Projects onViewDetails={handleOpenModal} />} 
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Interactive System Flow Modal Overlay */}
      {activeProject && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Close Details">
              &times;
            </button>
            <div className="modal-content-container">
              <span className="modal-project-badge">{activeProject.badge}</span>
              <h3 className="modal-project-title">{activeProject.title}</h3>
              
              <div className="modal-project-meta-row">
                <div className="modal-project-meta-item">
                  <strong>Role</strong>
                  <span>{activeProject.role}</span>
                </div>
                <div className="modal-project-meta-item">
                  <strong>Timeline</strong>
                  <span>{activeProject.timeline}</span>
                </div>
              </div>

              <div className="modal-project-overview">
                <h4>Core Challenge</h4>
                <p>{activeProject.challenge}</p>
                
                <h4>Logical Solution</h4>
                <p>{activeProject.solution}</p>
              </div>

              <div className="architecture-diagram-container">
                <div className="architecture-title">
                  <svg className="arch-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  Interactive Architecture Diagram
                </div>
                <div className="svg-wrapper">
                  {activeProject.diagram}
                </div>
              </div>

              <div className="modal-highlights-grid">
                <div className="modal-highlight-box">
                  <h5>Key Implementations</h5>
                  <ul>
                    {activeProject.highlights.map((h, index) => <li key={index}>{h}</li>)}
                  </ul>
                </div>
                <div className="modal-highlight-box">
                  <h5>Architecture Flow Guide</h5>
                  <ul>
                    <li><strong>Inputs:</strong> Data payloads, tokens, or configuration maps entering validation scopes.</li>
                    <li><strong>Core Processes:</strong> Local code filters, parsing calculations, similarity models, or routers.</li>
                    <li><strong>Storages:</strong> Relation tables or caches preserving transaction metrics.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
