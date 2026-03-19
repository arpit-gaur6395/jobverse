const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:5000/api';

export const API_URL = API_BASE_URL;
