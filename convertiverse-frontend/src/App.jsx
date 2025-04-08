import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

// Custom theme provider
import ThemeProvider from './theme/ThemeProvider';

// Custom components
import Header from './components/Header';
import Footer from './components/Footer';
import FileDropzone from './components/FileDropzone';
import ProgressBar from './components/ProgressBar';
import DownloadCard from './components/DownloadCard';

// Custom hooks
import useFileUpload from './hooks/useFileUpload';

function App() {
  // State for showing error message
  const [validationError, setValidationError] = useState(null);

  const {
    file,
    preview,
    isLoading,
    downloadUrl,
    error,
    progress,
    targetFormat,
    setTargetFormat,
    conversionResult,
    handleDrop,
    handleConvert,
    resetState
  } = useFileUpload();

  const handleConvertClick = () => {
    if (!file) {
      setValidationError('Please select a JPEG file first');
      // Auto-hide the error after 3 seconds
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Clear any previous error
    setValidationError(null);
    handleConvert();
  };

  return (
    <ThemeProvider>
      <div className="app-layout">
        <div className="container">
          <Header />

          <div className="converter-card">
            <div className="converter-content">
              <h2 className="converter-title">Image Format Converter</h2>

              <FileDropzone
                onDrop={handleDrop}
                preview={preview}
              />

              {file && (
                <div className="file-details">
                  <p className="file-info">
                    Selected file: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>

                  <div className="format-selector">
                    <label htmlFor="format-select">Convert to:</label>
                    <select
                      id="format-select"
                      value={targetFormat}
                      onChange={(e) => setTargetFormat(e.target.value)}
                      className="format-dropdown"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WEBP</option>
                      <option value="gif">GIF</option>
                      <option value="tiff">TIFF</option>
                      <option value="bmp">BMP</option>
                    </select>
                  </div>
                </div>
              )}

              <ProgressBar
                value={progress}
                isVisible={progress > 0 || isLoading}
                label={isLoading ? 'Converting...' : 'Processing...'}
              />

              {(error || validationError) && (
                <div className={`custom-alert ${validationError ? 'warning' : 'error'}`}>
                  <p>{validationError || error}</p>
                </div>
              )}

              {!downloadUrl && (
                <button
                  className={`convert-button ${isLoading ? 'loading' : ''} ${!file || isLoading ? 'disabled' : ''}`}
                  onClick={handleConvertClick}
                  disabled={!file || isLoading}
                >
                  <span className="button-icon">
                    <FiUpload />
                  </span>
                  <span className="button-text">
                    {isLoading ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {downloadUrl && conversionResult && (
            <DownloadCard
              downloadUrl={downloadUrl}
              fileName={conversionResult.originalName}
              sourceFormat={conversionResult.sourceFormat}
              targetFormat={conversionResult.targetFormat}
              onReset={resetState}
            />
          )}
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App
