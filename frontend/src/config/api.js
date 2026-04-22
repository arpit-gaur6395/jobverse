const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || '/api'
  : 'http://192.168.0.103:5000/api';

export const API_URL = API_BASE_URL;

// Helper function to get base URL for file uploads
export const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || '';
  }
  return 'http://192.168.0.103:5000';
};
