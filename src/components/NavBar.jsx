import React from 'react';

function NavBar({ activeSection, navItems }) {
  return (
    <nav className="portfolio-nav">
      <div className="nav-container">
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? 'active' : ''}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
