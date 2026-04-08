/**
 * JWT Service
 * 
 * Handles JWT token generation, validation, and decoding for Google OAuth authentication.
 * Tokens have a 1-hour expiration time.
 * 
 * This is a simplified implementation for React Native that doesn't require crypto libraries.
 * For production, consider using a backend service to generate and validate JWT tokens.
 */

import { encode, decode } from 'base-64';
import { JWT_SECRET as ENV_JWT_SECRET } from '@env';

const JWT_SECRET = ENV_JWT_SECRET || 'default-secret-key-change-in-production';

export interface JWTPayload {
    sub: string;        // Google user ID
    email: string;
    name: string;
    picture?: string;
    iat: number;        // Issued at timestamp
    exp: number;        // Expiration timestamp
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    photo?: string;
}

/**
 * Generate a simple signature for the JWT
 * This is a basic implementation for demo purposes
 * In production, use proper HMAC-SHA256 signing on the backend
 */
const generateSignature = (header: string, payload: string): string => {
    // Simple signature using base64 encoding of secret + header + payload
    // NOT cryptographically secure - for demo only
    const data = `${JWT_SECRET}.${header}.${payload}`;
    return encode(data).replace(/[=]/g, '');
};

/**
 * Generate a JWT token from Google user information
 * Token expires in 1 hour
 */
export const generateToken = async (userInfo: GoogleUserInfo): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 3600; // 1 hour in seconds

    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const payload: JWTPayload = {
        sub: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.photo,
        iat: now,
        exp: now + expiresIn,
    };

    const encodedHeader = encode(JSON.stringify(header)).replace(/[=]/g, '');
    const encodedPayload = encode(JSON.stringify(payload)).replace(/[=]/g, '');
    const signature = generateSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Validate a JWT token
 * Returns the payload if valid, null if invalid or expired
 */
export const validateToken = async (token: string): Promise<JWTPayload | null> => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            console.error('Invalid token format');
            return null;
        }

        const [encodedHeader, encodedPayload, signature] = parts;

        // Verify signature
        const expectedSignature = generateSignature(encodedHeader, encodedPayload);
        if (signature !== expectedSignature) {
            console.error('Invalid token signature');
            return null;
        }

        // Decode payload
        const payload = JSON.parse(decode(encodedPayload)) as JWTPayload;

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            console.error('Token expired');
            return null;
        }

        return payload;
    } catch (error) {
        console.error('JWT validation error:', error);
        return null;
    }
};

/**
 * Decode a JWT token without validation
 * Useful for extracting payload for display purposes
 * Returns null if token is malformed
 */
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            return null;
        }

        const payload = JSON.parse(decode(parts[1])) as JWTPayload;
        return payload;
    } catch (error) {
        console.error('JWT decode error:', error);
        return null;
    }
};
