const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ||
    (process.env.NODE_ENV === 'production'
      ? 'https://convertiverse.vercel.app'
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']),
  methods: ['GET', 'POST'],
  credentials: true
}));

// Create uploads and public directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter to accept various image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WEBP, BMP, TIFF) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve static files from the public directory, but don't use this for downloads
app.use('/static', express.static(publicDir));

// Download endpoint
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const originalName = req.query.originalName || filename;
  const filePath = path.join(publicDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Determine content type based on file extension
  const extension = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';

  switch (extension) {
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.bmp':
      contentType = 'image/bmp';
      break;
    case '.tiff':
    case '.tif':
      contentType = 'image/tiff';
      break;
  }

  // Set headers for download with original filename
  res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
  res.setHeader('Content-Type', contentType);

  // Send the file
  res.sendFile(filePath);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://convertiverse-production.up.railway.app'
    : `http://localhost:${process.env.PORT || 5000}`;

  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    baseUrl: baseUrl,
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'not set'
  });
});

// Conversion endpoint
app.post('/convert', upload.single('file'), async (req, res) => {
  // Get the target format from the request, default to PNG
  const targetFormat = req.body.targetFormat || 'png';
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file type not supported' });
    }

    const inputPath = req.file.path;

    // Validate the target format
    const validFormats = ['png', 'jpeg', 'jpg', 'webp', 'gif', 'tiff', 'bmp'];
    if (!validFormats.includes(targetFormat)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format',
        message: `Format '${targetFormat}' is not supported. Supported formats: ${validFormats.join(', ')}`
      });
    }

    // Generate a unique filename with the target extension
    const outputFilename = `${crypto.randomBytes(16).toString('hex')}.${targetFormat}`;
    const outputPath = path.join(publicDir, outputFilename);

    // Convert the image to the target format
    await sharp(inputPath)
      .toFormat(targetFormat)
      .toFile(outputPath);

    // Clean up the uploaded file
    fs.unlinkSync(inputPath);

    // Prepare the original filename with the new extension
    const originalNameWithoutExt = req.file.originalname.replace(/\.[^/.]+$/, "");
    const originalNameWithNewExt = originalNameWithoutExt + '.' + targetFormat;

    // Send the download URL with the original filename as a query parameter
    res.status(200).json({
      success: true,
      message: 'Conversion successful',
      downloadUrl: `/download/${outputFilename}?originalName=${encodeURIComponent(originalNameWithNewExt)}`,
      viewUrl: `/static/${outputFilename}`,
      originalName: originalNameWithNewExt,
      sourceFormat: path.extname(req.file.originalname).substring(1) || 'unknown',
      targetFormat: targetFormat
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({
      success: false,
      error: 'Conversion failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large',
        message: 'The uploaded file exceeds the 10MB size limit'
      });
    }
  }

  res.status(500).json({
    success: false,
    error: 'Server error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Create a Procfile for Railway deployment
fs.writeFileSync(
  path.join(__dirname, 'Procfile'),
  'web: node server.js'
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://convertiverse-production.up.railway.app'
    : `http://localhost:${PORT}`;

  console.log(`✨ Convertiverse API server running on port ${PORT}`);
  console.log(`🔗 Health check available at ${baseUrl}/health`);
  console.log(`🚀 Conversion endpoint available at ${baseUrl}/convert`);

  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 CORS configured for: ${process.env.CORS_ORIGIN || 'https://convertiverse.vercel.app'}`);
  } else {
    console.log(`🌐 CORS configured for local development`);
  }
});
