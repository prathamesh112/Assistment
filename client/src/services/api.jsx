import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (name, email, password) =>
    api.post('/signup', { name, email, password }),
  
  login: (email, password) =>
    api.post('/login', { email, password }),
  
  getProfile: () => api.get('/profile'),
};

export default api;