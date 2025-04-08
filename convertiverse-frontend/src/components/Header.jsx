import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="rotating-icon">
          <FiRefreshCw size={40} color="#0080ff" />
        </div>

        <h1 className="site-title fade-in-down">
          Convertiverse
        </h1>

        <p className="site-description fade-in-up">
          Transform your files with ease. Start with JPEG to PNG conversion.
        </p>
      </div>
    </header>
  );
};

export default Header;
