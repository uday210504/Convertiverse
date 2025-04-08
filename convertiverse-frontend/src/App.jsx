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
              <h2 className="converter-title">JPEG to PNG Converter</h2>

              <FileDropzone
                onDrop={handleDrop}
                preview={preview}
              />

              {file && (
                <p className="file-info">
                  Selected file: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
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
                    {isLoading ? 'Converting...' : 'Convert to PNG'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {downloadUrl && (
            <DownloadCard
              downloadUrl={downloadUrl}
              fileName={file ? file.name.replace(/\.[^/.]+$/, "") + '.png' : 'converted-image.png'}
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
