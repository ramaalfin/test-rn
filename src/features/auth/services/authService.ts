import axios from 'axios';
import { encode, decode } from 'base-64';
import { GoogleSignin, statusCodes, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import TokenManager from './tokenManager';
import { googleOAuthConfig } from '../config/googleOAuth.config';
import * as JWTService from './jwtService';

/**
 * AuthService
 * 
 * Handles authentication operations including login, logout, and token validation.
 * Supports both Google OAuth and mock authentication (JSONPlaceholder).
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 6.1, 6.2, 6.3, 6.4
 */

const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Configure Google Sign-In
 * Must be called during app initialization
 * 
 * Requirements: 1.1
 */
export const configureGoogleSignIn = (): void => {
    try {
        console.log('[AuthService] Configuring Google Sign-In...');
        console.log('[AuthService] Web Client ID:', googleOAuthConfig.webClientId ? 'Set' : 'Missing');

        const config: any = {
            webClientId: googleOAuthConfig.webClientId,
            offlineAccess: googleOAuthConfig.offlineAccess || false,
            scopes: googleOAuthConfig.scopes || ['email', 'profile'],
        };

        GoogleSignin.configure(config);
        console.log('[AuthService] Google Sign-In configured successfully');
    } catch (error) {
        console.error('[AuthService] Error configuring Google Sign-In:', error);
        throw new Error('Failed to configure Google Sign-In');
    }
};

/**
 * Login with Google OAuth
 * 
 * Initiates Google Sign-In flow, validates user data, generates JWT token,
 * and stores it for session management.
 * 
 * Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 3.1, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3
 * 
 * @returns AuthResponse with JWT token and user data
 * @throws Error with user-friendly message for various failure scenarios
 */
export const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
        // Check if Google Play Services are available (Android)
        await GoogleSignin.hasPlayServices();

        // Initiate Google Sign-In flow
        const userInfo = await GoogleSignin.signIn();

        // Validate that we received user data
        if (!userInfo.data?.user) {
            throw new Error('Authentication failed. Please try again.');
        }

        const googleUser = userInfo.data.user;

        // Validate email format
        if (!validateEmail(googleUser.email)) {
            throw new Error('Invalid email received from Google');
        }

        // Validate that we have required tokens
        if (!userInfo.data.idToken) {
            throw new Error('Authentication failed. Please try again.');
        }

        // Extract user information for JWT
        const jwtUserInfo: JWTService.GoogleUserInfo = {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
            photo: googleUser.photo || undefined,
        };

        // Generate JWT token with 1-hour expiration
        const token = await JWTService.generateToken(jwtUserInfo);

        // Store JWT token
        await TokenManager.storeToken(token);

        // Map to our User type
        const user: User = {
            id: parseInt(googleUser.id, 10) || 0,
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
        };

        return {
            token,
            user,
        };
    } catch (error: any) {
        // Handle user cancellation
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            throw new Error('Sign in was cancelled');
        }

        // Handle network errors
        if (error.code === statusCodes.IN_PROGRESS) {
            throw new Error('Sign in is already in progress');
        }

        // Handle Play Services errors (Android)
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw new Error('Google Play Services not available');
        }

        // Handle network connectivity issues
        if (error.message?.toLowerCase().includes('network')) {
            throw new Error('No internet connection. Please check your network.');
        }

        // Re-throw validation errors
        if (error instanceof Error && error.message.includes('Invalid email')) {
            throw error;
        }

        // Generic error for other cases
        console.error('Google Sign-In error:', error);
        throw new Error('Authentication failed. Please try again.');
    }
};

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
 * Clears stored token, revokes Google access, and clears cached user data
 * 
 * Requirements: 6.1, 6.2
 */
export const logout = async (): Promise<void> => {
    try {
        // Revoke Google access token if user is signed in with Google
        try {
            const isSignedIn = await GoogleSignin.hasPreviousSignIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
        } catch (error) {
            // Log but don't throw - we still want to clear local storage
            console.warn('Error revoking Google access:', error);
        }

        // Clear stored token
        await TokenManager.deleteToken();
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Failed to logout. Please try again.');
    }
};

/**
 * Validate JWT token
 * Verifies token signature and expiration using JWTService
 * 
 * Requirements: 3.2, 7.4, 7.5, 7.6, 8.4
 * 
 * @param token - JWT token to validate
 * @returns true if token is valid and not expired
 */
export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) {
        return false;
    }

    try {
        // Use JWTService to validate token
        const payload = await JWTService.validateToken(token);

        // If payload is null, token is invalid or expired
        if (!payload) {
            // Clear invalid token
            await TokenManager.deleteToken();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        // Clear invalid token
        await TokenManager.deleteToken();
        return false;
    }
};

// Export as default object for easier mocking in tests
const AuthService = {
    configureGoogleSignIn,
    loginWithGoogle,
    login,
    logout,
    validateToken,
    validateEmail,
    validatePassword,
};

export default AuthService;
