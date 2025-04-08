import React from 'react';
import { FiDownload, FiCheck, FiEye } from 'react-icons/fi';

const DownloadCard = ({
  downloadUrl,
  fileName = 'converted-file.bin',
  sourceFormat = 'unknown',
  targetFormat = 'unknown',
  category = 'unknown',
  fileSize = 0,
  onReset
}) => {
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
          Your {targetFormat.toUpperCase()} file is ready for download
        </p>

        <div className="conversion-details">
          <span className={`conversion-badge ${category}`}>
            {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
          </span>
          <span className="file-size">
            {(fileSize / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="file-category">
            Type: {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>

        <div className="button-group">
          <a
            href={fullDownloadUrl}
            className="download-button"
          >
            <FiDownload className="download-icon" />
            <span>Download {targetFormat.toUpperCase()}</span>
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
