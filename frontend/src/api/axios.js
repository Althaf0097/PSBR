/**
 * Axios API Configuration
 * 
 * This file configures the axios HTTP client for making API requests.
 * It sets up:
 * - Base URL for all API requests
 * - Request interceptor to automatically add JWT token
 * - Response interceptor to handle authentication errors
 * 
 * All API modules (auth.js, todos.js) use this configured instance.
 */

import axios from 'axios';

/**
 * Create axios instance with base configuration
 * 
 * Base URL is loaded from environment variable VITE_API_BASE_URL
 * Falls back to localhost:8080 if not set (for development)
 */
const api = axios.create({
  // API base URL from environment variable or default to localhost
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * This interceptor runs before every API request.
 * It automatically adds the JWT token from localStorage to the Authorization header.
 * 
 * Format: "Bearer <token>"
 * 
 * This means we don't need to manually add the token in each API call.
 */
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add token to Authorization header
      // Backend expects: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If request setup fails, reject the promise
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This interceptor runs after every API response.
 * It handles authentication errors (401 Unauthorized) by:
 * - Clearing invalid token from localStorage
 * - Redirecting user to login page
 * 
 * This provides automatic logout when token expires or is invalid.
 */
api.interceptors.response.use(
  // On successful response, just return it
  (response) => response,
  // On error response, handle authentication errors
  (error) => {
    // Check if error is 401 Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    // Reject the promise so calling code can handle the error
    return Promise.reject(error);
  }
);

export default api;


