import axios from 'axios';
import { encode } from 'base-64';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import TokenManager from './tokenManager';
import { googleOAuthConfig } from '../config/googleOAuth.config';
import * as JWTService from './jwtService';

const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

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

export const loginWithGoogle = async (): Promise<AuthResponse> => {
    try {
        await GoogleSignin.hasPlayServices();

        const userInfo = await GoogleSignin.signIn();

        if (!userInfo.data?.user) {
            throw new Error('Authentication failed. Please try again.');
        }

        const googleUser = userInfo.data.user;

        if (!validateEmail(googleUser.email)) {
            throw new Error('Invalid email received from Google');
        }

        if (!userInfo.data.idToken) {
            throw new Error('Authentication failed. Please try again.');
        }

        const jwtUserInfo: JWTService.GoogleUserInfo = {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name || googleUser.email,
            photo: googleUser.photo || undefined,
        };

        const token = await JWTService.generateToken(jwtUserInfo);

        await TokenManager.storeToken(token);

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
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            throw new Error('Sign in was cancelled');
        }

        if (error.code === statusCodes.IN_PROGRESS) {
            throw new Error('Sign in is already in progress');
        }

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw new Error('Google Play Services not available');
        }

        if (error.message?.toLowerCase().includes('network')) {
            throw new Error('No internet connection. Please check your network.');
        }

        if (error instanceof Error && error.message.includes('Invalid email')) {
            throw error;
        }

        console.error('Google Sign-In error:', error);
        throw new Error('Authentication failed. Please try again.');
    }
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const generateMockJWT = (user: User): string => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        sub: user.id.toString(),
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    };

    const encodedHeader = encode(JSON.stringify(header)).replace(/[=]/g, '');
    const encodedPayload = encode(JSON.stringify(payload)).replace(/[=]/g, '');

    const data = `mock-secret.${encodedHeader}.${encodedPayload}`;
    const signature = encode(data).replace(/[=]/g, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        console.log('[AuthService] Starting login request...');
        console.log('[AuthService] API URL:', `${JSONPLACEHOLDER_BASE_URL}/users`);

        const response = await axios.get(`${JSONPLACEHOLDER_BASE_URL}/users`, {
            timeout: 10000, // 10 detik timeout
        });

        console.log('[AuthService] Response status:', response.status);
        console.log('[AuthService] Response data length:', response.data?.length);

        const users = response.data;

        let user = users.find((u: any) => u.email.toLowerCase() === credentials.email.toLowerCase());

        if (!user && users.length > 0) {
            user = users[0];
        }

        if (!user) {
            throw new Error('Authentication failed. Please check your credentials.');
        }

        const authenticatedUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const token = generateMockJWT(authenticatedUser);

        await TokenManager.storeToken(token);

        return {
            token,
            user: authenticatedUser,
        };
    } catch (error) {
        console.error('[AuthService] Login error:', error);

        if (axios.isAxiosError(error)) {
            console.error('[AuthService] Axios error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.status,
                hasResponse: !!error.response,
            });

            if (!error.response) {
                throw new Error('No internet connection. Please check your network.');
            }
            throw new Error('Authentication failed. Please try again.');
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('An unexpected error occurred');
    }
};

export const logout = async (): Promise<void> => {
    try {
        try {
            const isSignedIn = GoogleSignin.hasPreviousSignIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
        } catch (error) {
            console.warn('Error revoking Google access:', error);
        }

        await TokenManager.deleteToken();
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Failed to logout. Please try again.');
    }
};

export const validateToken = async (token: string): Promise<boolean> => {
    if (!token) {
        return false;
    }

    try {
        const payload = await JWTService.validateToken(token);

        if (!payload) {
            await TokenManager.deleteToken();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        await TokenManager.deleteToken();
        return false;
    }
};

const AuthService = {
    configureGoogleSignIn,
    loginWithGoogle,
    login,
    logout,
    validateToken,
};

export default AuthService;
