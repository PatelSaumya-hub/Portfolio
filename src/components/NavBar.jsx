import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ activePath, navItems, theme, toggleTheme }) {
  return (
    <nav className="portfolio-nav">
      <div className="nav-container nav-flex">
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={activePath === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Grayscale Theme Toggle matching clean white style constraints */}
        <button 
          onClick={toggleTheme} 
          className="btn-theme-toggle"
          type="button"
          aria-label="Toggle Grayscale Theme"
        >
          Theme: {theme === 'light-white' ? 'White' : 'Slate'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
