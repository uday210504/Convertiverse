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

export const getConverters = async () => {
  try {
    const response = await api.get('/api/converters');
    return response.data;
  } catch (error) {
    console.error('Error fetching converters:', error);
    throw new Error('Failed to fetch available converters');
  }
};

export const getInputFormats = async () => {
  try {
    const response = await api.get('/api/formats/input');
    return response.data;
  } catch (error) {
    console.error('Error fetching input formats:', error);
    throw new Error('Failed to fetch supported input formats');
  }
};

export const getOutputFormats = async (inputFormat) => {
  try {
    const response = await api.get(`/api/formats/output/${inputFormat}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching output formats:', error);
    throw new Error('Failed to fetch supported output formats');
  }
};

export const convertFile = async (file, fromFormat, toFormat) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('from', fromFormat);
    formData.append('to', toFormat);

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
