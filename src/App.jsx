import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import NavBar from './components/NavBar';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  
  // Data passed as props per lab specs
  const name = "Saumya Patel";
  const themeColor = "#ffffff"; // Plain white inline style theme
  const skillList = [
    "Python", "JavaScript", "TypeScript", "Solidity", "SQL", "C++",
    "FastAPI", "Express.js", "Node.js", "RESTful APIs",
    "SQLAlchemy", "SQLite", "PostgreSQL",
    "Foundry Framework", "OpenZeppelin v5", "ERC-20", "ERC-721 Standards",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Dice Similarity Coefficients", "pdfminer",
    "Git", "GitHub Actions", "Docker"
  ];

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  // Active section scrollspy observer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      {/* 4 Reusable components + NavBar composed into single page layout */}
      <NavBar activeSection={activeSection} navItems={navItems} />
      
      <Header name={name} themeColor={themeColor} />
      
      <main className="portfolio-main">
        
        <About />

        {/* Projects Section */}
        <section id="projects" className="portfolio-section">
          <h2>Featured Projects</h2>
          
          <div className="projects-list">
            
            <div className="project-node">
              <h3>Paper Trail</h3>
              <p className="project-type">NLP Similarity Engine &amp; Academic Assistant</p>
              <p className="project-desc">
                A locally-hosted academic research assistant processing PDF files, building keyword dictionary frequency hashes, and calculating Dice similarity coefficients to recommend papers from database caches or ArXiv search interfaces.
              </p>
              <pre className="project-flow">
{`[ PDF File Input ] ---> [ pdfminer Parser ] ---> [ Stopword filter ]
                                                          |
                                                          v
[ Output Rank Map ] <--- [ Similarity Engine ] <--- [ Word Frequency Hash ]`}
              </pre>
            </div>

            <div className="project-node">
              <h3>ChainBeasts &amp; PowerToken</h3>
              <p className="project-type">GameFi NFT Evolution Protocol</p>
              <p className="project-desc">
                EVM smart contracts designed in Solidity using Foundry. Establishes ERC721 token evolution milestones linked with transactional ERC20 token burn processes. Custom error designs limit overall gas consumption.
              </p>
              <pre className="project-flow">
{`[ User Wallet ] --------> [ PowerToken Contract ] ----> [ Evolution Burn ]
       |                                                      |
       v                                                      v
[ Approve Power Spend ] -> [ ChainBeasts Contract ] --> [ Evolution Event ]`}
              </pre>
            </div>

            <div className="project-node">
              <h3>Walmart Sales Analytics</h3>
              <p className="project-type">Jupyter Data Science EDA</p>
              <p className="project-desc">
                Exploratory data analysis modeling store efficiency levels, charting seasonality performance spikes around major holidays, and visualizing economic correlation coefficients (CPI, fuel, unemployment) using Pandas and Seaborn.
              </p>
            </div>

          </div>
        </section>

        <Skills skillList={skillList} />
        
        {/* Contact wrapper for NavBar anchoring */}
        <div id="contact">
          <Footer />
        </div>

      </main>
    </div>
  );
}

export default App;
