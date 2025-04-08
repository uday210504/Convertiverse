import React from 'react';

const FormatSelector = ({ 
  inputFormats, 
  selectedInputFormat, 
  setSelectedInputFormat,
  outputFormats,
  selectedOutputFormat,
  setSelectedOutputFormat
}) => {
  return (
    <div className="format-selector-container">
      <div className="format-selector-group">
        <label htmlFor="input-format" className="format-label">From:</label>
        <select
          id="input-format"
          value={selectedInputFormat}
          onChange={(e) => setSelectedInputFormat(e.target.value)}
          className="format-dropdown"
          disabled={inputFormats.length === 0}
        >
          {inputFormats.length === 0 ? (
            <option value="">Loading...</option>
          ) : (
            inputFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="format-arrow">→</div>

      <div className="format-selector-group">
        <label htmlFor="output-format" className="format-label">To:</label>
        <select
          id="output-format"
          value={selectedOutputFormat}
          onChange={(e) => setSelectedOutputFormat(e.target.value)}
          className="format-dropdown"
          disabled={outputFormats.length === 0}
        >
          {outputFormats.length === 0 ? (
            <option value="">Select input format first</option>
          ) : (
            outputFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default FormatSelector;
