// Centralized API configuration and utilities
// This file provides a single point of configuration for all backend API calls

// Get the API base URL from environment variables
// For Create React App, use REACT_APP_API_URL
// For Vite, use VITE_API_URL
// Falls back to localhost:5000 for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Make a fetch request with common configuration
 * @param {string} endpoint - API endpoint (e.g., '/api/login')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Uncomment the line below if your backend uses cookie-based authentication
    // credentials: 'include',
  };
  
  return fetch(url, config);
}

/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - Response JSON
 */
export async function login(email, password) {
  const response = await apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server ${response.status}: ${text}`);
  }
  
  return response.json();
}

/**
 * User signup
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} location - User location
 * @returns {Promise<object>} - Response JSON
 */
export async function signup(name, email, password, location) {
  const response = await apiFetch('/api/createuser', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, location }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server ${response.status}: ${text}`);
  }
  
  return response.json();
}

/**
 * Get food items and categories
 * @returns {Promise<object>} - Response JSON with food data
 */
export async function getFoodItems() {
  const response = await apiFetch('/api/foodData', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}`);
  }
  
  return response.json();
}

// Token handling utilities
/**
 * Save authentication token to localStorage
 * @param {string} token - Authentication token
 */
export function saveToken(token) {
  if (token) {
    localStorage.setItem('authToken', token);
  }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Authentication token or null
 */
export function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * Clear authentication token from localStorage
 */
export function clearToken() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
}

/**
 * Save user data to localStorage
 * @param {object} userData - User data object
 */
export function saveUserData(userData) {
  if (userData.authToken) {
    localStorage.setItem('authToken', userData.authToken);
  }
  if (userData.id || userData._id || userData.token) {
    localStorage.setItem('userToken', userData.id || userData._id || userData.token);
  }
  if (userData.name) {
    localStorage.setItem('userName', userData.name);
  }
}

// Export API_BASE_URL for debugging or special cases
export { API_BASE_URL };
