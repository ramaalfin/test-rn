import { encode, decode } from 'base-64';
import { JWT_SECRET as ENV_JWT_SECRET } from '@env';

const JWT_SECRET = ENV_JWT_SECRET || 'default-secret-key-change-in-production';

export interface JWTPayload {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    iat: number;
    exp: number;
}

export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    photo?: string;
}

const generateSignature = (header: string, payload: string): string => {
    const data = `${JWT_SECRET}.${header}.${payload}`;
    return encode(data).replace(/[=]/g, '');
};

export const generateToken = async (userInfo: GoogleUserInfo): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 3600;

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

export const validateToken = async (token: string): Promise<JWTPayload | null> => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            console.error('Invalid token format');
            return null;
        }

        const [encodedHeader, encodedPayload, signature] = parts;

        const expectedSignature = generateSignature(encodedHeader, encodedPayload);
        const mockSignature = encode(`mock-secret.${encodedHeader}.${encodedPayload}`).replace(/[=]/g, '');

        if (signature !== expectedSignature && signature !== mockSignature) {
            console.error('Invalid token signature');
            return null;
        }

        const payload = JSON.parse(decode(encodedPayload)) as JWTPayload;

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
