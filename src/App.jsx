import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import Skills from './components/Skills';

function App() {
  const location = useLocation();
  
  // 1. useState for theme toggle
  const [theme, setTheme] = useState('light-white');
  
  // Props data per lab requirements
  const name = "Saumya Patel";
  const themeColor = "#ffffff"; // Plain white header background
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

  // Apply theme class to document body whenever theme toggles
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light-white' ? 'light-gray' : 'light-white');
  };

  return (
    <div className="portfolio-app">
      {/* Navigation bar with React Router links and theme toggle state */}
      <NavBar 
        activePath={location.pathname} 
        navItems={navItems} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      {/* Primary Routing paths */}
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          {/* 404 Route for any undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
