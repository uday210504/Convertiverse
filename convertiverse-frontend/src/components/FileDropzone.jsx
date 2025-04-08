import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile } from 'react-icons/fi';

const FileDropzone = ({ onDrop, preview, accept = { 'image/jpeg': ['.jpg', '.jpeg'] } }) => {
  const onDropAccepted = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: onDropAccepted,
    accept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Determine dropzone class based on drag state
  let dropzoneClass = 'dropzone';
  if (isDragActive) dropzoneClass += ' dropzone-active';
  if (isDragAccept) dropzoneClass += ' dropzone-accept';
  if (isDragReject) dropzoneClass += ' dropzone-reject';

  return (
    <div className="dropzone-container">
      <div
        {...getRootProps()}
        className={dropzoneClass}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="preview-container">
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />
            <div className="preview-overlay">
              <p className="preview-text">Click or drag to replace</p>
            </div>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="dropzone-icon">
              {isDragActive ?
                <FiFile size={48} color="#0080ff" /> :
                <FiUploadCloud size={48} color="#718096" />}
            </div>
            <p className="dropzone-text">
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a JPEG file here, or click to select'}
            </p>
            <p className="dropzone-hint">
              (Only JPEG files up to 10MB are accepted)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
