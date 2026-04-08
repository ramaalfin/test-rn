import { useEffect } from 'react';
import useAuthStore from '../../../stores/useAuthStore';

/**
 * useAuth Hook
 * 
 * Custom hook that wraps useAuthStore with business logic.
 * Provides a clean, component-friendly API for authentication operations.
 * 
 * Features:
 * - Automatic authentication check on mount
 * - Clean API for login/logout operations
 * - Loading and error state management
 * - User session information
 * 
 * Requirements: 1.3, 1.4, 1.5, 1.6, 1.7
 * 
 * @example
 * ```tsx
 * const { login, logout, isLoading, error, user, isAuthenticated } = useAuth();
 * 
 * // Login
 * await login('user@example.com', 'password123');
 * 
 * // Logout
 * await logout();
 * 
 * // Check authentication status
 * if (isAuthenticated) {
 *   console.log('User:', user);
 * }
 * ```
 */
export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
        clearError,
    } = useAuthStore();

    /**
     * Check authentication status on mount
     * This ensures the app knows if the user is logged in when it starts
     */
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    /**
     * Login wrapper with enhanced error handling
     * 
     * @param email - User email address
     * @param password - User password
     * @throws Error with user-friendly message if login fails
     */
    const handleLogin = async (email: string, password: string): Promise<void> => {
        try {
            await login(email, password);
        } catch (error) {
            // Error is already set in the store by the login action
            // Re-throw to allow components to handle it if needed
            throw error;
        }
    };

    /**
     * Logout wrapper with enhanced error handling
     * 
     * @throws Error with user-friendly message if logout fails
     */
    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            // Error is already set in the store by the logout action
            // Re-throw to allow components to handle it if needed
            throw error;
        }
    };

    return {
        // User data
        user,
        isAuthenticated,

        // Loading and error states
        isLoading,
        error,
        clearError,

        // Actions
        login: handleLogin,
        logout: handleLogout,
    };
};

export default useAuth;
