import React from 'react';

function Header({ name, themeColor }) {
  return (
    <header className="portfolio-header" style={{ backgroundColor: themeColor || '#ffffff' }}>
      <div className="header-container">
        <h1 className="header-name">{name}</h1>
        <p className="header-title">Systems &amp; Backend Software Engineer</p>
      </div>
    </header>
  );
}

export default Header;
