import React from 'react';

// Simple ThemeProvider component that just passes children through
// We'll use CSS for all styling instead of a UI library
const ThemeProvider = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};

export default ThemeProvider;
