import { create } from 'zustand';
import { decode } from 'base-64';
import AuthService from '../features/auth/services/authService';
import TokenManager from '../features/auth/services/tokenManager';
import { User } from '../features/auth/types/auth.types';

/**
 * Authentication Store
 * 
 * Manages global authentication state using Zustand.
 * Integrates with AuthService and TokenManager for authentication operations.
 * 
 * Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3
 */

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    /**
     * Check for existing authentication token on app launch
     * Validates stored token and restores user session if valid
     */
    checkAuth: async () => {
        try {
            set({ isLoading: true, error: null });

            const token = await TokenManager.getToken();

            if (!token) {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return;
            }

            // Validate token
            const isValid = await AuthService.validateToken(token);

            if (!isValid) {
                // Token is invalid or expired, clear it
                await TokenManager.deleteToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
                return;
            }

            // Token is valid, decode user info from token
            // For demo purposes, extract user from token payload
            try {
                const parts = token.split('.');
                const payload = JSON.parse(decode(parts[1]));
                const user: User = {
                    id: parseInt(payload.sub, 10),
                    email: payload.email,
                    name: payload.name,
                };

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });
            } catch (decodeError) {
                // If we can't decode the token, treat it as invalid
                await TokenManager.deleteToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Failed to check authentication status'
            });
        }
    },

    /**
     * Login with email and password
     * Stores token and user data on successful authentication
     * 
     * @param email - User email address
     * @param password - User password
     * @throws Error with user-friendly message if login fails
     */
    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });

            const response = await AuthService.login({ email, password });

            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected error occurred';

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });

            throw error;
        }
    },

    /**
     * Logout user
     * Clears token, user data, and authentication state
     */
    logout: async () => {
        try {
            set({ isLoading: true, error: null });

            await AuthService.logout();

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to logout';

            set({
                isLoading: false,
                error: errorMessage,
            });

            throw error;
        }
    },

    /**
     * Clear error message
     * Useful for dismissing error messages in UI
     */
    clearError: () => {
        set({ error: null });
    },
}));

export default useAuthStore;
