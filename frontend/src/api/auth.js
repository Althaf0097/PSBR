/**
 * Authentication API
 * 
 * This module provides functions for user authentication:
 * - User registration
 * - User login
 * 
 * All functions use the configured axios instance which automatically
 * handles JWT token management (except for these endpoints which don't require tokens).
 */

import api from './axios';

export const authAPI = {
  /**
   * Register a new user account
   * 
   * Creates a new user account and returns a JWT token for immediate authentication.
   * 
   * @param {string} username - Desired username (must be unique)
   * @param {string} email - User email address (must be unique)
   * @param {string} password - User password (min 6 characters)
   * @returns {Promise<Object>} Response containing JWT token, username, and email
   * @throws {Error} If username or email already exists, or validation fails
   */
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
  
  /**
   * Login an existing user
   * 
   * Authenticates a user and returns a JWT token for subsequent API calls.
   * Users can login with either username or email.
   * 
   * @param {string} usernameOrEmail - Username or email address
   * @param {string} password - User password
   * @returns {Promise<Object>} Response containing JWT token, username, and email
   * @throws {Error} If credentials are invalid
   */
  login: async (usernameOrEmail, password) => {
    const response = await api.post('/auth/login', {
      usernameOrEmail,
      password,
    });
    return response.data;
  },
};


