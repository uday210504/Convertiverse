import React from 'react';

const FormatSelector = ({
  inputFormats,
  selectedInputFormat,
  setSelectedInputFormat,
  outputFormats,
  selectedOutputFormat,
  setSelectedOutputFormat,
  converters = {}
}) => {
  // Function to get the category of a format
  const getFormatCategory = (format) => {
    for (const category in converters) {
      const hasFormat = converters[category].some(
        c => c.from === format || c.to === format
      );
      if (hasFormat) return category;
    }
    return null;
  };

  // Group formats by category
  const groupFormatsByCategory = (formats) => {
    const grouped = {};

    formats.forEach(format => {
      const category = getFormatCategory(format) || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(format);
    });

    return grouped;
  };
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
            Object.entries(groupFormatsByCategory(inputFormats)).map(([category, formats]) => (
              <optgroup key={category} label={category.toUpperCase()}>
                {formats.map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </optgroup>
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
            Object.entries(groupFormatsByCategory(outputFormats)).map(([category, formats]) => (
              <optgroup key={category} label={category.toUpperCase()}>
                {formats.map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </optgroup>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default FormatSelector;
