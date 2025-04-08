import { useState } from 'react';
import { convertImage } from '../services/api';

export const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [targetFormat, setTargetFormat] = useState('png');
  const [conversionResult, setConversionResult] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setDownloadUrl(null);

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

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
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

      const result = await convertImage(file, targetFormat);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setDownloadUrl(result.downloadUrl);
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

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setDownloadUrl(null);
    setError(null);
    setProgress(0);
    setConversionResult(null);
    // Don't reset the target format to maintain user preference

    // Clean up the preview URL to avoid memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return {
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
    resetState,
  };
};

export default useFileUpload;
