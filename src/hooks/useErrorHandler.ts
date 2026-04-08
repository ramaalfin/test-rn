/**
 * useErrorHandler Hook
 * 
 * Provides consistent error handling across the app.
 * Maps technical errors to user-friendly messages.
 * Detects network errors and provides appropriate icons and actions.
 * 
 * Requirements: 7.7, 14.1, 14.2, 14.3
 */

import { AxiosError } from 'axios';
import { errorMessageMapper } from '../services/errorMessageMapper';

export interface ErrorDisplayInfo {
    message: string;
    icon: string;
    actionText: string;
    isNetworkError: boolean;
}

export function useErrorHandler() {
    /**
     * Get display information for an error
     */
    const getErrorDisplayInfo = (error: unknown): ErrorDisplayInfo => {
        // Handle AxiosError
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError;
            const errorInfo = errorMessageMapper.mapError(axiosError);

            return {
                message: errorInfo.message,
                icon: errorInfo.isNetworkError ? '📡' : '⚠️',
                actionText: errorInfo.isNetworkError ? 'Retry' : 'Try Again',
                isNetworkError: errorInfo.isNetworkError,
            };
        }

        // Handle generic errors
        if (error instanceof Error) {
            return {
                message: 'Something went wrong. Please try again.',
                icon: '⚠️',
                actionText: 'Try Again',
                isNetworkError: false,
            };
        }

        // Fallback for unknown errors
        return {
            message: 'An unexpected error occurred. Please try again.',
            icon: '⚠️',
            actionText: 'Try Again',
            isNetworkError: false,
        };
    };

    /**
     * Get just the user-friendly message
     */
    const getErrorMessage = (error: unknown): string => {
        return getErrorDisplayInfo(error).message;
    };

    /**
     * Check if error is a network error
     */
    const isNetworkError = (error: unknown): boolean => {
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as AxiosError;
            return errorMessageMapper.isNetworkError(axiosError);
        }
        return false;
    };

    return {
        getErrorDisplayInfo,
        getErrorMessage,
        isNetworkError,
    };
}
