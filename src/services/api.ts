import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('klinik_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('klinik_token');
      localStorage.removeItem('klinik_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
