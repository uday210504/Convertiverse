import { useState, useEffect } from 'react';
import { getConverters, getInputFormats, getOutputFormats, convertFile } from '../services/api';

export const useConverter = () => {
  // State for file and preview
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // State for conversion options
  const [converters, setConverters] = useState({});
  const [inputFormats, setInputFormats] = useState([]);
  const [selectedInputFormat, setSelectedInputFormat] = useState('');
  const [outputFormats, setOutputFormats] = useState([]);
  const [selectedOutputFormat, setSelectedOutputFormat] = useState('');
  
  // State for conversion status
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  
  // Fetch available converters on mount
  useEffect(() => {
    const fetchConverters = async () => {
      try {
        const data = await getConverters();
        setConverters(data);
        
        // Get all input formats
        const formats = await getInputFormats();
        setInputFormats(formats);
        
        // Set default input format if available
        if (formats.length > 0) {
          setSelectedInputFormat(formats[0]);
        }
      } catch (error) {
        setError('Failed to load converters. Please try again later.');
      }
    };
    
    fetchConverters();
  }, []);
  
  // Update output formats when input format changes
  useEffect(() => {
    const fetchOutputFormats = async () => {
      if (!selectedInputFormat) return;
      
      try {
        const formats = await getOutputFormats(selectedInputFormat);
        setOutputFormats(formats);
        
        // Set default output format if available
        if (formats.length > 0) {
          setSelectedOutputFormat(formats[0]);
        } else {
          setSelectedOutputFormat('');
        }
      } catch (error) {
        setError('Failed to load output formats.');
      }
    };
    
    fetchOutputFormats();
  }, [selectedInputFormat]);
  
  // Handle file drop/selection
  const handleDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setConversionResult(null);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      // Simulate progress for better UX
      setProgress(30);
      setTimeout(() => setProgress(60), 300);
      setTimeout(() => setProgress(100), 600);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  // Handle conversion
  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    if (!selectedInputFormat || !selectedOutputFormat) {
      setError('Please select both input and output formats');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setConversionResult(null);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      const result = await convertFile(file, selectedInputFormat, selectedOutputFormat);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        setConversionResult(result);
      } else {
        setError(result.message || 'Conversion failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };
  
  // Reset state
  const resetState = () => {
    setFile(null);
    setPreview(null);
    setConversionResult(null);
    setError(null);
    setProgress(0);
    
    // Don't reset the formats to maintain user preference
    
    // Clean up the preview URL to avoid memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };
  
  // Get the category of the current conversion
  const getConversionCategory = () => {
    if (!selectedInputFormat || !selectedOutputFormat) return null;
    
    for (const category in converters) {
      const found = converters[category].some(
        c => c.from === selectedInputFormat && c.to === selectedOutputFormat
      );
      if (found) return category;
    }
    
    return null;
  };
  
  return {
    // File state
    file,
    preview,
    
    // Format options
    converters,
    inputFormats,
    selectedInputFormat,
    setSelectedInputFormat,
    outputFormats,
    selectedOutputFormat,
    setSelectedOutputFormat,
    
    // Conversion state
    isLoading,
    progress,
    error,
    conversionResult,
    
    // Actions
    handleDrop,
    handleConvert,
    resetState,
    getConversionCategory
  };
};

export default useConverter;
