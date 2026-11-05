import axios from 'axios';

// Support VITE_API_BASE_URL (standard) or VITE_API_URL with safe fallback
const rawUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000';

// Strip any trailing slashes to prevent double-slash route requests
const API_BASE_URL = rawUrl.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const api = {
  // Service health check
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Model metadata and verified metrics
  getModelInfo: async () => {
    const response = await apiClient.get('/model-info');
    return response.data;
  },

  // Upload fundus image for disease classification
  predict: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
