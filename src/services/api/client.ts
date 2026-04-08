import axios from 'axios';
import TokenManager from '../../features/auth/services/tokenManager';
import { errorLogger } from '../errorLogger';
import { errorMessageMapper } from '../errorMessageMapper';

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
 * Handles API errors with automatic logout on 401, retry logic, and structured error logging
 * Detects network errors and provides user-friendly error messages
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 14.1, 14.2, 14.3, 14.4
 */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Extract request context
    const endpoint = originalRequest?.url || 'unknown';
    const method = originalRequest?.method?.toUpperCase() || 'UNKNOWN';

    // Detect network errors (no internet connection)
    const isNetworkError = errorMessageMapper.isNetworkError(error);

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Log authentication error with structured format
      errorLogger.logAuthError(
        'Session expired or invalid token',
        endpoint,
      );

      // Delete token from storage
      await TokenManager.deleteToken();

      // Import auth store dynamically to avoid circular dependency
      const { default: useAuthStore } = await import('../../stores/useAuthStore');

      // Get user-friendly error message
      const userMessage = errorMessageMapper.getSimpleMessage(error);

      // Trigger logout to clear auth state and navigate to login
      // This will cause RootNavigator to automatically switch to Auth stack
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: userMessage,
      });

      return Promise.reject(error);
    }

    // Implement retry logic for network errors and 5xx errors
    // Maximum 2 retries with exponential backoff
    if (!originalRequest._retry) {
      originalRequest._retry = 0;
    }

    const shouldRetry =
      (isNetworkError || (error.response && error.response.status >= 500)) &&
      originalRequest._retry < 2;

    if (shouldRetry) {
      originalRequest._retry += 1;
      const retryDelay = Math.pow(2, originalRequest._retry - 1) * 1000; // 1s, 2s

      // Log retry attempt
      errorLogger.log({
        type: isNetworkError ? 'network' : 'api',
        endpoint,
        method,
        statusCode: error.response?.status,
        message: `Retry attempt ${originalRequest._retry} after ${retryDelay}ms`,
      });

      // Wait before retrying
      await new Promise<void>(resolve => setTimeout(resolve, retryDelay));

      return apiClient(originalRequest);
    }

    // Log errors with structured format and context
    if (error.response) {
      // API returned error response (4xx, 5xx)
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Unknown error';

      // Log API error with structured format
      errorLogger.logApiError(endpoint, method, status, message);
    } else if (isNetworkError) {
      // Network error - no response received (no internet connection)
      errorLogger.logNetworkError(
        endpoint,
        method,
        'No internet connection or request timeout',
      );
    } else {
      // Other errors (request setup, etc.)
      errorLogger.log({
        type: 'api',
        endpoint,
        method,
        message: error.message || 'Unknown error',
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
