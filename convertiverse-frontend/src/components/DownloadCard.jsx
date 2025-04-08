import React from 'react';
import { FiDownload, FiCheck } from 'react-icons/fi';

const DownloadCard = ({ downloadUrl, fileName = 'converted-image.png', onReset }) => {
  // Use the production URL if in production, otherwise use the environment variable or localhost
  const API_URL = import.meta.env.PROD
    ? 'https://convertiverse-production.up.railway.app'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
  const fullDownloadUrl = `${API_URL}${downloadUrl}`;

  return (
    <div className="download-card fade-in">
      <div className="download-content">
        <div className="success-icon">
          <FiCheck size={24} />
        </div>

        <h3 className="download-title">
          Conversion Complete!
        </h3>

        <p className="download-message">
          Your PNG file is ready for download
        </p>

        <a
          href={fullDownloadUrl}
          download={fileName}
          className="download-button"
        >
          <FiDownload className="download-icon" />
          <span>Download PNG</span>
        </a>

        <button
          className="reset-button"
          onClick={onReset}
        >
          Convert another file
        </button>
      </div>
    </div>
  );
};

export default DownloadCard;
