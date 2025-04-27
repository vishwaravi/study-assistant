
// src/api/api.js
import axios from 'axios';
import { createCookie, createCookieSessionStorage } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL, // adjust based on your backend
});

// Add token to each request if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
