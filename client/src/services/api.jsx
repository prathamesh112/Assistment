import axios from 'axios';

// Use deployed backend URL in production
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://assisment-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
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
