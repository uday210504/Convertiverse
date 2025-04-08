const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Try to load ffmpeg, but don't fail if it's not available
let ffmpeg;
let ffmpegAvailable = false;
try {
  ffmpeg = require('fluent-ffmpeg');
  // Check if ffmpeg is actually available
  ffmpeg.getAvailableFormats(function(err, formats) {
    ffmpegAvailable = !err;
    console.log('FFmpeg available:', ffmpegAvailable);
    if (err) {
      console.warn('FFmpeg not available:', err.message);
    }
  });
} catch (error) {
  console.warn('Failed to load fluent-ffmpeg:', error.message);
}

// Load converters configuration
const converters = require('./converters.config');

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

// Helper function to find a converter based on from and to formats
function findConverter(from, to) {
  for (const category in converters) {
    const converter = converters[category].find(c =>
      c.from.toUpperCase() === from.toUpperCase() &&
      c.to.toUpperCase() === to.toUpperCase());

    // Check if the converter is available based on the tool
    if (converter) {
      if (converter.tool === 'ffmpeg' && !ffmpegAvailable) {
        return null; // FFmpeg is not available
      }
      return converter;
    }
  }
  return null;
}

// Helper function to get all available converters
function getAvailableConverters() {
  const available = {};

  for (const category in converters) {
    // Filter converters based on available tools
    const availableConverters = converters[category].filter(c => {
      if (c.tool === 'ffmpeg' && !ffmpegAvailable) {
        return false; // Skip FFmpeg converters if not available
      }
      return true;
    });

    if (availableConverters.length > 0) {
      available[category] = availableConverters.map(c => ({
        from: c.from,
        to: c.to
      }));
    }
  }

  return available;
}

// Helper function to get all supported input formats
function getSupportedInputFormats() {
  const formats = new Set();

  for (const category in converters) {
    // Filter converters based on available tools
    converters[category]
      .filter(c => !(c.tool === 'ffmpeg' && !ffmpegAvailable))
      .forEach(c => formats.add(c.from));
  }

  return Array.from(formats);
}

// Helper function to get all possible output formats for a given input format
function getPossibleOutputFormats(inputFormat) {
  const formats = new Set();

  for (const category in converters) {
    converters[category]
      .filter(c => c.from.toUpperCase() === inputFormat.toUpperCase())
      .filter(c => !(c.tool === 'ffmpeg' && !ffmpegAvailable))
      .forEach(c => formats.add(c.to));
  }

  return Array.from(formats);
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

// File filter to accept file types based on the requested conversion
const fileFilter = (req, file, cb) => {
  // If no conversion type is specified, accept the file and validate later
  if (!req.body.from || !req.body.to) {
    return cb(null, true);
  }

  // Find the converter for the requested conversion
  const converter = findConverter(req.body.from, req.body.to);

  // If no converter is found, reject the file
  if (!converter) {
    return cb(new Error(`Conversion from ${req.body.from} to ${req.body.to} is not supported`), false);
  }

  // Check if the file's MIME type is supported for this conversion
  const isValidMimeType = converter.mime.from.includes(file.mimetype);

  if (isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not valid for ${req.body.from} to ${req.body.to} conversion`), false);
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

// API endpoint to get all available converters
app.get('/api/converters', (req, res) => {
  res.json(getAvailableConverters());
});

// API endpoint to get all supported input formats
app.get('/api/formats/input', (req, res) => {
  res.json(getSupportedInputFormats());
});

// API endpoint to get possible output formats for a given input format
app.get('/api/formats/output/:inputFormat', (req, res) => {
  const { inputFormat } = req.params;
  res.json(getPossibleOutputFormats(inputFormat));
});

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

  // Check if directories exist
  const uploadsExists = fs.existsSync(uploadsDir);
  const publicExists = fs.existsSync(publicDir);

  // Get available converters
  const availableConverters = getAvailableConverters();
  const supportedFormats = getSupportedInputFormats();

  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    baseUrl: baseUrl,
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'not set',
    directories: {
      uploads: uploadsExists,
      public: publicExists
    },
    ffmpeg: {
      available: ffmpegAvailable
    },
    converters: {
      available: Object.keys(availableConverters).length > 0,
      categories: Object.keys(availableConverters),
      supportedFormats: supportedFormats
    }
  });
});

// Conversion endpoint
app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded or file type not supported'
      });
    }

    // Get source and target formats from the request
    const sourceFormat = req.body.from;
    const targetFormat = req.body.to;

    if (!sourceFormat || !targetFormat) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
        message: 'Both "from" and "to" parameters are required'
      });
    }

    // Find the appropriate converter
    const converter = findConverter(sourceFormat, targetFormat);
    if (!converter) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported conversion',
        message: `Conversion from ${sourceFormat} to ${targetFormat} is not supported`
      });
    }

    const inputPath = req.file.path;
    const outputExtension = targetFormat.toLowerCase();
    const outputFilename = `${crypto.randomBytes(16).toString('hex')}.${outputExtension}`;
    const outputPath = path.join(publicDir, outputFilename);

    // Perform the conversion based on the tool
    if (converter.tool === 'sharp') {
      // Image conversion using Sharp
      await sharp(inputPath)
        .toFormat(outputExtension)
        .toFile(outputPath);
    } else if (converter.tool === 'ffmpeg') {
      // Check if FFmpeg is available
      if (!ffmpegAvailable) {
        return res.status(503).json({
          success: false,
          error: 'Service unavailable',
          message: 'FFmpeg is not available on this server. Only image conversions are supported.'
        });
      }

      // Video/Audio conversion using FFmpeg
      try {
        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => {
              resolve();
            })
            .on('error', (err) => {
              console.error('FFmpeg error:', err);
              reject(err);
            })
            .run();
        });
      } catch (ffmpegError) {
        console.error('FFmpeg conversion failed:', ffmpegError);
        return res.status(500).json({
          success: false,
          error: 'Conversion error',
          message: 'Failed to convert file using FFmpeg: ' + ffmpegError.message
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        error: 'Conversion error',
        message: 'Unknown conversion tool'
      });
    }

    // Clean up the uploaded file
    fs.unlinkSync(inputPath);

    // Prepare the original filename with the new extension
    const originalNameWithoutExt = req.file.originalname.replace(/\.[^/.]+$/, "");
    const originalNameWithNewExt = originalNameWithoutExt + '.' + targetFormat.toLowerCase();

    // Get the category of the conversion (image, video, audio)
    let category = 'unknown';
    for (const cat in converters) {
      if (converters[cat].some(c =>
        c.from.toUpperCase() === sourceFormat.toUpperCase() &&
        c.to.toUpperCase() === targetFormat.toUpperCase())) {
        category = cat;
        break;
      }
    }

    // Send the download URL with the original filename as a query parameter
    res.status(200).json({
      success: true,
      message: 'Conversion successful',
      downloadUrl: `/download/${outputFilename}?originalName=${encodeURIComponent(originalNameWithNewExt)}`,
      viewUrl: `/static/${outputFilename}`,
      originalName: originalNameWithNewExt,
      sourceFormat: sourceFormat,
      targetFormat: targetFormat,
      category: category,
      fileSize: fs.statSync(outputPath).size
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
