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
import FormatSelector from './components/FormatSelector';

// Custom hooks
import useConverter from './hooks/useConverter';

function App() {
  // State for showing error message
  const [validationError, setValidationError] = useState(null);

  const {
    file,
    preview,
    isLoading,
    error,
    progress,
    conversionResult,
    converters,
    inputFormats,
    selectedInputFormat,
    setSelectedInputFormat,
    outputFormats,
    selectedOutputFormat,
    setSelectedOutputFormat,
    handleDrop,
    handleConvert,
    resetState,
    getConversionCategory
  } = useConverter();

  const handleConvertClick = () => {
    if (!file) {
      setValidationError('Please select a file first');
      // Auto-hide the error after 3 seconds
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    if (!selectedInputFormat || !selectedOutputFormat) {
      setValidationError('Please select both input and output formats');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Clear any previous error
    setValidationError(null);
    handleConvert();
  };

  // Get the category of the current conversion
  const conversionCategory = getConversionCategory();

  return (
    <ThemeProvider>
      <div className="app-layout">
        <div className="container">
          <Header />

          <div className="converter-card">
            <div className="converter-content">
              <h2 className="converter-title">
                Convertiverse: Universal File Converter
                {conversionCategory && (
                  <span className={`file-type-indicator ${conversionCategory}`}>
                    {conversionCategory}
                  </span>
                )}
              </h2>

              <FileDropzone
                onDrop={handleDrop}
                preview={preview}
              />

              <FormatSelector
                inputFormats={inputFormats}
                selectedInputFormat={selectedInputFormat}
                setSelectedInputFormat={setSelectedInputFormat}
                outputFormats={outputFormats}
                selectedOutputFormat={selectedOutputFormat}
                setSelectedOutputFormat={setSelectedOutputFormat}
                converters={converters}
              />

              {file && (
                <div className="file-details">
                  <p className="file-info">
                    Selected file: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
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

              {!conversionResult && (
                <button
                  className={`convert-button ${isLoading ? 'loading' : ''} ${!file || isLoading ? 'disabled' : ''}`}
                  onClick={handleConvertClick}
                  disabled={!file || isLoading}
                >
                  <span className="button-icon">
                    <FiUpload />
                  </span>
                  <span className="button-text">
                    {isLoading ? 'Converting...' :
                      selectedInputFormat && selectedOutputFormat ?
                      `Convert ${selectedInputFormat} to ${selectedOutputFormat}` :
                      'Convert File'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {conversionResult && (
            <DownloadCard
              downloadUrl={conversionResult.downloadUrl}
              fileName={conversionResult.originalName}
              sourceFormat={conversionResult.sourceFormat}
              targetFormat={conversionResult.targetFormat}
              category={conversionResult.category}
              fileSize={conversionResult.fileSize}
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
