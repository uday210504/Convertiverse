import React from 'react';
import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-item">
          © {new Date().getFullYear()} Convertiverse. All rights reserved.
        </div>
        <div className="footer-separator">•</div>
        <div className="footer-item">
          Made with <FiHeart className="heart-icon" /> for seamless file conversions
        </div>
        <div className="footer-separator">•</div>
        <div className="footer-item">
          <a href="#" className="footer-link">Privacy Policy</a>
          {' | '}
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
