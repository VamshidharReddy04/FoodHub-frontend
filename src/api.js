/**
 * Centralized API wrapper for FoodHub frontend
 * 
 * This file provides a single point of configuration for the backend API URL
 * and exposes commonly used API functions with consistent error handling.
 * 
 * Configuration:
 * - Set REACT_APP_API_URL environment variable for production deployments
 * - Falls back to http://localhost:5000 for local development
 * 
 * Example usage in Vercel:
 * - Add environment variable: REACT_APP_API_URL=https://your-backend.herokuapp.com
 */

// Get the API base URL from environment variable or use localhost as fallback
// Empty string is treated as falsy and will use the default fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Token management utilities
 */
export const saveToken = (authToken) => {
  if (authToken) {
    localStorage.setItem('authToken', authToken);
  }
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const clearToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
};

/**
 * Login API call
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response data with success flag and authToken
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include', // Uncomment if using cookie-based authentication
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server ${response.status}: ${text}`);
  }

  return await response.json();
};

/**
 * Sign up (create user) API call
 * 
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} location - User location
 * @returns {Promise<Object>} Response data
 */
export const signup = async (name, email, password, location) => {
  const response = await fetch(`${API_BASE_URL}/api/createuser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include', // Uncomment if using cookie-based authentication
    body: JSON.stringify({ name, email, password, location })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server ${response.status}: ${text}`);
  }

  return await response.json();
};

/**
 * Get food items and categories
 * 
 * @returns {Promise<Object>} Response data with food items and categories
 */
export const getFoodItems = async () => {
  const response = await fetch(`${API_BASE_URL}/api/foodData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include', // Uncomment if using cookie-based authentication
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}`);
  }

  return await response.json();
};

/**
 * Get the current API base URL (useful for debugging)
 * 
 * @returns {string} The configured API base URL
 */
export const getApiBaseUrl = () => API_BASE_URL;
