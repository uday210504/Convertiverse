# Convertiverse

Convertiverse is a modern file conversion platform that allows users to easily convert files between different formats. The initial version supports JPEG to PNG conversion, with plans to expand to 50+ converters in the future.

## Features

- **JPEG to PNG Conversion**: Upload JPEG images and convert them to PNG format
- **Modern UI**: Clean, intuitive interface with animations and visual feedback
- **Drag & Drop**: Easy file uploading with drag and drop functionality
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js with Vite
- Chakra UI for styling
- Framer Motion for animations
- React Dropzone for file uploads
- Axios for API requests

### Backend
- Node.js with Express
- Multer for file handling
- Sharp for image processing
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/uday210504/Convertiverse.git
cd Convertiverse
```

2. Install backend dependencies:
```bash
cd convertiverse-backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../convertiverse-frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd convertiverse-backend
npm start
```

2. Start the frontend development server:
```bash
cd convertiverse-frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend
- Deploy to Railway
- Set environment variables as needed

### Frontend
- Deploy to Vercel
- Set the `VITE_API_URL` environment variable to your backend URL

## Future Plans

- Add more file conversion options (50+ converters)
- Implement user accounts and conversion history
- Add batch conversion functionality
- Introduce AI-enhanced conversions
- Create mobile applications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [Express](https://expressjs.com/)
- [Sharp](https://sharp.pixelplumbing.com/)
