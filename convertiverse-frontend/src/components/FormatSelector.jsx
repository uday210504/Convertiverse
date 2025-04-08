import React from 'react';

const FormatSelector = ({
  inputFormats = [],
  selectedInputFormat = '',
  setSelectedInputFormat,
  outputFormats = [],
  selectedOutputFormat = '',
  setSelectedOutputFormat,
  converters = {}
}) => {
  // Simple function to render formats
  const renderFormats = (formats) => {
    // If we have converters with categories, try to group them
    if (converters && Object.keys(converters).length > 0) {
      // Group formats by category
      const grouped = {};

      // Initialize with empty arrays for each category
      Object.keys(converters).forEach(category => {
        grouped[category] = [];
      });

      // Add an 'other' category for formats that don't match
      grouped['other'] = [];

      // Categorize formats
      formats.forEach(format => {
        let found = false;

        // Try to find the format in a category
        for (const category in converters) {
          const hasFormat = converters[category].some(
            c => c.from === format || c.to === format
          );

          if (hasFormat) {
            grouped[category].push(format);
            found = true;
            break;
          }
        }

        // If not found in any category, add to 'other'
        if (!found) {
          grouped['other'].push(format);
        }
      });

      // Remove empty categories
      Object.keys(grouped).forEach(category => {
        if (grouped[category].length === 0) {
          delete grouped[category];
        }
      });

      // If we have grouped formats, render them by category
      if (Object.keys(grouped).length > 0) {
        return Object.entries(grouped).map(([category, categoryFormats]) => {
          if (categoryFormats.length === 0) return null;

          return (
            <optgroup key={category} label={category.toUpperCase()}>
              {categoryFormats.map(format => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </optgroup>
          );
        });
      }
    }

    // Fallback: just render all formats without categories
    return formats.map(format => (
      <option key={format} value={format}>
        {format}
      </option>
    ));
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
            renderFormats(inputFormats)
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
            renderFormats(outputFormats)
          )}
        </select>
      </div>
    </div>
  );
};

export default FormatSelector;
