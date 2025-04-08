import axios from 'axios';

// Use the production URL if in production, otherwise use the environment variable or localhost
const API_URL = import.meta.env.PROD
  ? 'https://convertiverse-production.up.railway.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const convertImage = async (file, targetFormat = 'png') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    const response = await api.post('/convert', formData);
    return response.data;
  } catch (error) {
    console.error('Error converting image:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Server error');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

export default api;
