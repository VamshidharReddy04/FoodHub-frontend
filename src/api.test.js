/**
 * Tests for the centralized API wrapper
 */
import { API_BASE_URL, signup, login, getFoodItems } from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Configuration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('API_BASE_URL uses environment variable or defaults to localhost', () => {
    // The API_BASE_URL should be set from process.env.REACT_APP_API_URL
    // or default to http://localhost:5000
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
    expect(API_BASE_URL).toContain('http');
  });

  test('signup function makes correct API call', async () => {
    // Mock successful response
    const mockResponse = {
      success: true,
      createdUserId: '123',
      name: 'Test User',
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      location: 'Test City',
    };

    const result = await signup(userData);

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/createuser'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          location: userData.location,
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  test('login function makes correct API call', async () => {
    // Mock successful response
    const mockResponse = {
      success: true,
      authToken: 'test-token-123',
      id: '456',
      name: 'Test User',
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await login(credentials);

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/login'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(credentials),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  test('getFoodItems function makes correct API call', async () => {
    // Mock successful response
    const mockResponse = [
      [{ name: 'Pizza', category: 'Italian' }],
      [{ CategoryName: 'Italian' }],
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getFoodItems();

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/foodData'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({}),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  test('API functions handle errors correctly', async () => {
    // Mock error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await expect(login({ email: 'test@example.com', password: 'wrong' }))
      .rejects
      .toThrow('Server 500: Internal Server Error');
  });
});
