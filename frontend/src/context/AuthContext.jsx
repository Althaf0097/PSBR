/**
 * Authentication Context
 * 
 * This context provides authentication state and methods throughout the application.
 * It manages user login, registration, logout, and persists authentication state
 * using localStorage.
 * 
 * Features:
 * - User authentication state management
 * - JWT token storage in localStorage
 * - Automatic token restoration on page reload
 * - Login, register, and logout functions
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * Custom hook to access authentication context
 * 
 * This hook provides access to authentication state and methods.
 * Must be used within an AuthProvider component.
 * 
 * @returns {Object} Authentication context with user, login, register, logout, etc.
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * 
 * This component wraps the application and provides authentication context
 * to all child components. It manages:
 * - User state (logged in user information)
 * - Loading state (while checking authentication)
 * - Login, register, and logout functions
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that need auth context
 */
export const AuthProvider = ({ children }) => {
  // Current logged-in user (null if not authenticated)
  const [user, setUser] = useState(null);
  // Loading state while checking authentication on mount
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Restore authentication state on component mount
   * 
   * When the app loads, check localStorage for a saved token and user data.
   * If found, restore the user state. This allows users to stay logged in
   * after page refresh.
   */
  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Parse and restore user data from localStorage
        setUser(JSON.parse(userData));
      } catch (e) {
        // If parsing fails, clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    // Mark loading as complete
    setLoading(false);
  }, []);

  /**
   * Login function
   * 
   * Authenticates a user with username/email and password.
   * On success, stores JWT token and user data in localStorage.
   * 
   * @param {string} usernameOrEmail - Username or email address
   * @param {string} password - User password
   * @returns {Object} { success: boolean, error?: string }
   */
  const login = async (usernameOrEmail, password) => {
    try {
      // Call login API endpoint
      const response = await authAPI.login(usernameOrEmail, password);
      
      // Store JWT token in localStorage for subsequent API calls
      localStorage.setItem('token', response.token);
      // Store user data for display purposes
      localStorage.setItem('user', JSON.stringify({ 
        username: response.username, 
        email: response.email 
      }));
      
      // Update user state
      setUser({ username: response.username, email: response.email });
      return { success: true };
    } catch (error) {
      // Return error message from API or generic message
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  /**
   * Register function
   * 
   * Creates a new user account. On success, automatically logs in the user
   * by storing the JWT token and user data.
   * 
   * @param {string} username - Desired username
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Object} { success: boolean, error?: string }
   */
  const register = async (username, email, password) => {
    try {
      // Call register API endpoint
      const response = await authAPI.register(username, email, password);
      
      // Store JWT token (user is automatically logged in after registration)
      localStorage.setItem('token', response.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify({ 
        username: response.username, 
        email: response.email 
      }));
      
      // Update user state
      setUser({ username: response.username, email: response.email });
      return { success: true };
    } catch (error) {
      // Return error message from API or generic message
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  /**
   * Logout function
   * 
   * Clears authentication state by removing token and user data from localStorage
   * and resetting user state to null.
   */
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Clear user state
    setUser(null);
  };

  // Context value containing all authentication state and methods
  const value = {
    user,                    // Current user object (null if not logged in)
    login,                   // Login function
    register,                // Register function
    logout,                  // Logout function
    isAuthenticated: !!user, // Boolean indicating if user is logged in
    loading,                 // Boolean indicating if auth check is in progress
  };

  // Provide context to all child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


