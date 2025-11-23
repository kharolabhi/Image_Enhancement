import React from 'react';
import './Navbar.css';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">Image Enhancer</a>
      </div>
      <div className="navbar-menu">
        {/* <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a> */}
      </div>
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
