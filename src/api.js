/**
 * Centralized API wrapper for FoodHub frontend
 * 
 * This module provides a centralized way to make API calls to the backend.
 * It reads the API base URL from environment variables, making it easy to
 * deploy to different environments (development, production, etc.)
 * 
 * Environment Variables:
 * - REACT_APP_API_URL: The base URL for the backend API (Create React App)
 * 
 * If REACT_APP_API_URL is not set, it defaults to http://localhost:5000
 */

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Helper function to make API requests
 * @param {string} endpoint - API endpoint (e.g., '/api/login')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response JSON
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Include credentials for cookie-based authentication
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server ${response.status}: ${text}`);
  }
  
  return await response.json();
}

/**
 * User signup API call
 * @param {object} userData - User data {name, email, password, location}
 * @returns {Promise<object>} - Response from server
 */
export async function signup(userData) {
  return apiRequest('/api/createuser', {
    method: 'POST',
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      location: userData.location,
    }),
  });
}

/**
 * User login API call
 * @param {object} credentials - Login credentials {email, password}
 * @returns {Promise<object>} - Response from server with authToken
 */
export async function login(credentials) {
  return apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });
}

/**
 * Fetch food items and categories
 * @returns {Promise<object>} - Food items and categories data
 */
export async function getFoodItems() {
  return apiRequest('/api/foodData', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

// Export API_BASE_URL for debugging/testing purposes
export { API_BASE_URL };
