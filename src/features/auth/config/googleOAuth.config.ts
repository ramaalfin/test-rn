/**
 * Google OAuth Configuration
 * 
 * This module exports the configuration needed for Google Sign-In.
 * Client IDs are loaded from environment variables.
 * 
 * To obtain these values:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create OAuth 2.0 Client IDs for Web, iOS, and Android
 * 3. Add the values to your .env file
 * 
 * See GOOGLE_OAUTH_SETUP.md for detailed setup instructions.
 */

import { GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';

export interface GoogleOAuthConfig {
    webClientId: string;
    androidClientId?: string;
    offlineAccess?: boolean;
    scopes?: string[];
}

export const googleOAuthConfig: GoogleOAuthConfig = {
    webClientId: GOOGLE_WEB_CLIENT_ID || '',
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    offlineAccess: false,
    scopes: ['email', 'profile'],
};
