import React from 'react';
import { FiDownload, FiCheck, FiEye } from 'react-icons/fi';

const DownloadCard = ({ downloadUrl, fileName = 'converted-image.png', onReset }) => {
  // Use the production URL if in production, otherwise use the environment variable or localhost
  const API_URL = import.meta.env.PROD
    ? 'https://convertiverse-production.up.railway.app'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

  // The backend now provides two URLs: one for downloading and one for viewing
  const fullDownloadUrl = `${API_URL}${downloadUrl}`;
  const viewUrl = `${API_URL}${downloadUrl.replace('/download/', '/static/')}`;

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

        <div className="button-group">
          <a
            href={fullDownloadUrl}
            className="download-button"
          >
            <FiDownload className="download-icon" />
            <span>Download PNG</span>
          </a>

          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="view-button"
          >
            <FiEye className="view-icon" />
            <span>View Image</span>
          </a>
        </div>

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
