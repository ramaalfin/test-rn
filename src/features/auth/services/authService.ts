import axios from 'axios';
import { encode, decode } from 'base-64';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import TokenManager from './tokenManager';

/**
 * AuthService
 * 
 * Handles authentication operations including login, logout, and token validation.
 * Uses JSONPlaceholder /users endpoint for mock authentication.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7
 */

const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if email format is valid
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password meets minimum requirements
 * @param password - Password string to validate
 * @returns true if password meets requirements (minimum 6 characters)
 */
export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Generate mock JWT token
 * For demo purposes, creates a base64 encoded token containing user data
 * @param user - User object to encode in token
 * @returns Mock JWT token string
 */
const generateMockJWT = (user: User): string => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        sub: user.id.toString(),
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    };

    const encodedHeader = encode(JSON.stringify(header));
    const encodedPayload = encode(JSON.stringify(payload));
    const signature = 'mock_signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Login with email and password
 * 
 * For demo purposes, this uses JSONPlaceholder's /users endpoint.
 * It accepts any email/password combination that passes validation.
 * In production, this would call a real authentication endpoint.
 * 
 * @param credentials - Login credentials (email and password)
 * @returns AuthResponse with token and user data
 * @throws Error if validation fails or network error occurs
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Validate email format
    if (!validateEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
    }

    // Validate password requirements
    if (!validatePassword(credentials.password)) {
        throw new Error('Password must be at least 6 characters');
    }

    try {
        // Fetch users from JSONPlaceholder
        // In a real app, this would be POST /auth/login with credentials
        const response = await axios.get(`${JSONPLACEHOLDER_BASE_URL}/users`);
        const users = response.data;

        // For demo: find user by email or use first user
        let user = users.find((u: any) => u.email.toLowerCase() === credentials.email.toLowerCase());

        // If no matching user, use first user for demo purposes
        if (!user && users.length > 0) {
            user = users[0];
        }

        if (!user) {
            throw new Error('Authentication failed. Please check your credentials.');
        }

        // Map JSONPlaceholder user to our User type
        const authenticatedUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        // Generate mock JWT token
        const token = generateMockJWT(authenticatedUser);

        // Store token
        await TokenManager.storeToken(token);

        return {
            token,
            user: authenticatedUser,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (!error.response) {
                throw new Error('No internet connection. Please check your network.');
            }
            throw new Error('Authentication failed. Please try again.');
        }

        // Re-throw validation errors
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('An unexpected error occurred');
    }
};

/**
 * Logout user
 * Clears stored token and any cached user data
 */
export const logout = async (): Promise<void> => {
    try {
        await TokenManager.deleteToken();
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Failed to logout. Please try again.');
    }
};

/**
 * Validate JWT token
 * For demo purposes, checks if token exists and has valid format
 * In production, this would verify token signature and expiration
 * 
 * @param token - JWT token to validate
 * @returns true if token is valid
 */
export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) {
        return false;
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return false;
        }

        const payload = JSON.parse(decode(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

// Export as default object for easier mocking in tests
const AuthService = {
    login,
    logout,
    validateToken,
    validateEmail,
    validatePassword,
};

export default AuthService;
