import React from 'react';

const ProgressBar = ({ value = 0, isVisible = false, label = 'Processing...' }) => {
  return (
    <div className={`progress-container ${isVisible ? 'visible' : 'hidden'}`}>
      <p className="progress-label">
        {label} {value > 0 ? `(${Math.round(value)}%)` : ''}
      </p>
      <div className="custom-progress-container">
        <div
          className={`custom-progress-bar ${value < 100 ? 'animated' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
