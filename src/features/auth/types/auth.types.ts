/**
 * Authentication Type Definitions
 * 
 * Defines types for authentication-related data structures
 */

export interface User {
    id: number;
    email: string;
    name: string;
    picture?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
