import React from 'react';
import Header from './Header';
import About from './About';

function Home({ name, themeColor }) {
  return (
    <div className="home-view">
      <Header name={name} themeColor={themeColor} />
      <About />
    </div>
  );
}

export default Home;
