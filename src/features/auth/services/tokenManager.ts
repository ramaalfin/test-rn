import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * TokenManager Service
 * 
 * Abstracts AsyncStorage access for JWT token management.
 * Provides a clean interface for storing, retrieving, and deleting authentication tokens.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

const TOKEN_STORAGE_KEY = '@auth_token';

/**
 * Store JWT token in secure storage
 * @param token - JWT token string to store
 * @throws Error if storage operation fails
 */
export const storeToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
        console.error('Error storing token:', error);
        throw new Error('Failed to store authentication token');
    }
};

/**
 * Retrieve JWT token from secure storage
 * @returns JWT token string or null if not found
 */
export const getToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

/**
 * Delete JWT token from secure storage
 * @throws Error if deletion operation fails
 */
export const deleteToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
        console.error('Error deleting token:', error);
        throw new Error('Failed to delete authentication token');
    }
};

/**
 * Check if a JWT token exists in storage
 * @returns true if token exists, false otherwise
 */
export const hasToken = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        return token !== null;
    } catch (error) {
        console.error('Error checking token existence:', error);
        return false;
    }
};

// Export as default object for easier mocking in tests
const TokenManager = {
    storeToken,
    getToken,
    deleteToken,
    hasToken,
};

export default TokenManager;
