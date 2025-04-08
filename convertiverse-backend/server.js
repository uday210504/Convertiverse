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
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://convertiverse.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
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

// File filter to only accept jpeg/jpg files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/JPG files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve static files from the public directory
app.use(express.static(publicDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Conversion endpoint
app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file type not supported' });
    }

    const inputPath = req.file.path;
    const outputFilename = `${crypto.randomBytes(16).toString('hex')}.png`;
    const outputPath = path.join(publicDir, outputFilename);

    // Convert JPEG to PNG
    await sharp(inputPath)
      .toFormat('png')
      .toFile(outputPath);

    // Clean up the uploaded file
    fs.unlinkSync(inputPath);

    // Send the download URL
    res.status(200).json({ 
      success: true,
      message: 'Conversion successful',
      downloadUrl: `/${outputFilename}`,
      originalName: req.file.originalname.replace(/\.[^/.]+$/, "") + '.png'
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
  console.log(`✨ Convertiverse API server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
  console.log(`🚀 Conversion endpoint available at http://localhost:${PORT}/convert`);
});
