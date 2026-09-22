import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ activePath, navItems, theme, toggleTheme, user, onOpenAuthModal }) {
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

        <div className="nav-right-controls">
          {/* User Auth Profile Badge */}
          {user ? (
            <button className="nav-user-badge" onClick={onOpenAuthModal} title="Manage Profile & 2FA">
              <img src={user.profilePic} alt={user.username} className="nav-user-avatar" />
              <span className="nav-username">{user.username}</span>
              <span className="nav-2fa-dot" title="2FA Active"></span>
            </button>
          ) : (
            <button className="btn btn-secondary btn-xs" onClick={onOpenAuthModal}>
              🔐 Sign In / 2FA
            </button>
          )}

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="btn-theme-toggle"
            type="button"
            aria-label="Toggle Theme Mode"
          >
            Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
