import axios from 'axios';
import TokenManager from '../features/auth/services/tokenManager';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * Adds JWT token to Authorization header for authenticated requests
 * Provides request logging for debugging
 * 
 * Requirements: 3.5
 */
apiClient.interceptors.request.use(
  async config => {
    // Get token from TokenManager
    const token = await TokenManager.getToken();

    // Add Authorization header with Bearer token if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request logging for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      params: config.params,
    });

    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * 
 * Handles API errors with automatic logout on 401, retry logic, and error logging
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Log error with context
    const endpoint = originalRequest?.url || 'unknown';
    const method = originalRequest?.method?.toUpperCase() || 'unknown';

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.error(
        `[API Error] 401 Unauthorized at ${method} ${endpoint}`,
        {
          status: 401,
          endpoint,
          message: 'Session expired or invalid token',
        },
      );

      // Delete token from storage
      await TokenManager.deleteToken();

      // Import auth store dynamically to avoid circular dependency
      const { default: useAuthStore } = await import('../stores/useAuthStore');

      // Trigger logout to clear auth state and navigate to login
      // This will cause RootNavigator to automatically switch to Auth stack
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Your session has expired. Please log in again.',
      });

      return Promise.reject(error);
    }

    // Implement retry logic for network errors and 5xx errors
    // Maximum 2 retries with exponential backoff
    if (!originalRequest._retry) {
      originalRequest._retry = 0;
    }

    const shouldRetry =
      (!error.response || error.response.status >= 500) &&
      originalRequest._retry < 2;

    if (shouldRetry) {
      originalRequest._retry += 1;
      const retryDelay = Math.pow(2, originalRequest._retry - 1) * 1000; // 1s, 2s

      console.warn(
        `[API Retry] Attempt ${originalRequest._retry} for ${method} ${endpoint} after ${retryDelay}ms`,
      );

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      return apiClient(originalRequest);
    }

    // Log errors with context
    if (error.response) {
      // API returned error response (4xx, 5xx)
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Unknown error';

      if (status >= 400 && status < 500) {
        // Client errors (4xx)
        console.error(`[API Error] ${status} at ${method} ${endpoint}`, {
          status,
          endpoint,
          message,
        });
      } else if (status >= 500) {
        // Server errors (5xx)
        console.error(`[API Error] ${status} Server Error at ${method} ${endpoint}`, {
          status,
          endpoint,
          message,
        });
      }
    } else if (error.request) {
      // Network error - no response received
      console.error(`[Network Error] No response for ${method} ${endpoint}`, {
        endpoint,
        message: 'No internet connection or request timeout',
      });
    } else {
      // Other errors (request setup, etc.)
      console.error(`[API Error] Request failed for ${method} ${endpoint}`, {
        endpoint,
        message: error.message || 'Unknown error',
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
