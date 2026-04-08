/**
 * Error Message Mapper
 * 
 * Maps technical errors to user-friendly messages.
 * Never exposes technical details to users.
 * Provides actionable guidance (retry, check connection).
 * 
 * Requirements: 7.7, 14.2
 */

import { AxiosError } from 'axios';

export interface UserFriendlyError {
    message: string;
    action?: string;
    isNetworkError: boolean;
}

class ErrorMessageMapperService {
    /**
     * Check if error is a network error (no internet connection)
     */
    isNetworkError(error: AxiosError): boolean {
        // Network error: no response received
        if (!error.response && error.request) {
            return true;
        }

        // Check for specific network error codes
        if (error.code === 'ECONNABORTED' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ERR_NETWORK' ||
            error.message?.toLowerCase().includes('network error')) {
            return true;
        }

        return false;
    }

    /**
     * Map error to user-friendly message
     */
    mapError(error: AxiosError): UserFriendlyError {
        // Network error - no internet connection
        if (this.isNetworkError(error)) {
            return {
                message: 'No internet connection. Please check your network and try again.',
                action: 'Check your connection and retry',
                isNetworkError: true,
            };
        }

        // API returned error response
        if (error.response) {
            const status = error.response.status;

            // Authentication errors (401)
            if (status === 401) {
                return {
                    message: 'Your session has expired. Please log in again.',
                    action: 'Log in again',
                    isNetworkError: false,
                };
            }

            // Forbidden (403)
            if (status === 403) {
                return {
                    message: 'You don\'t have permission to access this resource.',
                    action: 'Contact support if you believe this is an error',
                    isNetworkError: false,
                };
            }

            // Not found (404)
            if (status === 404) {
                return {
                    message: 'The requested information could not be found.',
                    action: 'Try refreshing or go back',
                    isNetworkError: false,
                };
            }

            // Client errors (400-499)
            if (status >= 400 && status < 500) {
                return {
                    message: 'Something went wrong with your request. Please try again.',
                    action: 'Check your input and retry',
                    isNetworkError: false,
                };
            }

            // Server errors (500-599)
            if (status >= 500) {
                return {
                    message: 'Our servers are having trouble. Please try again in a moment.',
                    action: 'Wait a moment and retry',
                    isNetworkError: false,
                };
            }
        }

        // Request timeout
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return {
                message: 'The request took too long. Please check your connection and try again.',
                action: 'Check your connection and retry',
                isNetworkError: true,
            };
        }

        // Generic error fallback
        return {
            message: 'Something went wrong. Please try again.',
            action: 'Retry',
            isNetworkError: false,
        };
    }

    /**
     * Get a simple user-friendly message (without action)
     */
    getSimpleMessage(error: AxiosError): string {
        return this.mapError(error).message;
    }

    /**
     * Get actionable guidance for the error
     */
    getActionGuidance(error: AxiosError): string | undefined {
        return this.mapError(error).action;
    }
}

// Export singleton instance
export const errorMessageMapper = new ErrorMessageMapperService();
