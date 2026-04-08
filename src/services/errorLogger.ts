/**
 * Error Logger Service
 * 
 * Provides structured error logging with timestamp, type, endpoint, status, and message.
 * Sanitizes sensitive data from logs to prevent exposure of credentials or tokens.
 * 
 * Requirements: 7.2, 7.3, 7.4
 */

export type ErrorType = 'network' | 'api' | 'auth' | 'validation';

export interface ErrorLog {
    timestamp: string;
    type: ErrorType;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    message: string;
    userId?: number;
}

class ErrorLoggerService {
    /**
     * Sanitize sensitive data from error messages and objects
     */
    private sanitize(data: any): any {
        if (typeof data === 'string') {
            // Remove tokens, passwords, and other sensitive patterns
            return data
                .replace(/Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, 'Bearer [REDACTED]')
                .replace(/token["\s:]+[\w-]+\.[\w-]+\.[\w-]+/gi, 'token: [REDACTED]')
                .replace(/password["\s:]+[^\s,}]+/gi, 'password: [REDACTED]')
                .replace(/api[_-]?key["\s:]+[^\s,}]+/gi, 'api_key: [REDACTED]');
        }

        if (typeof data === 'object' && data !== null) {
            const sanitized: any = Array.isArray(data) ? [] : {};
            for (const key in data) {
                if (key.toLowerCase().includes('password') ||
                    key.toLowerCase().includes('token') ||
                    key.toLowerCase().includes('secret') ||
                    key.toLowerCase().includes('key')) {
                    sanitized[key] = '[REDACTED]';
                } else {
                    sanitized[key] = this.sanitize(data[key]);
                }
            }
            return sanitized;
        }

        return data;
    }

    /**
     * Log an error with structured format
     */
    log(errorLog: Omit<ErrorLog, 'timestamp'>): void {
        const sanitizedLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            type: errorLog.type,
            endpoint: errorLog.endpoint,
            method: errorLog.method,
            statusCode: errorLog.statusCode,
            message: this.sanitize(errorLog.message),
            userId: errorLog.userId,
        };

        // In development, log to console with formatting
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            const prefix = this.getLogPrefix(sanitizedLog.type);
            console.error(
                `${prefix} [${sanitizedLog.timestamp}]`,
                this.formatLogMessage(sanitizedLog),
            );
        } else {
            // Always log in test environment or when __DEV__ is not defined
            const prefix = this.getLogPrefix(sanitizedLog.type);
            console.error(
                `${prefix} [${sanitizedLog.timestamp}]`,
                this.formatLogMessage(sanitizedLog),
            );
        }

        // In production, this would send to a logging service (e.g., Sentry, LogRocket)
        // For now, we just log to console
    }

    /**
     * Get log prefix based on error type
     */
    private getLogPrefix(type: ErrorType): string {
        switch (type) {
            case 'network':
                return '🌐 [Network Error]';
            case 'api':
                return '⚠️ [API Error]';
            case 'auth':
                return '🔒 [Auth Error]';
            case 'validation':
                return '✋ [Validation Error]';
            default:
                return '❌ [Error]';
        }
    }

    /**
     * Format log message for console output
     */
    private formatLogMessage(log: ErrorLog): string {
        const parts: string[] = [];

        if (log.method && log.endpoint) {
            parts.push(`${log.method} ${log.endpoint}`);
        } else if (log.endpoint) {
            parts.push(log.endpoint);
        }

        if (log.statusCode) {
            parts.push(`Status: ${log.statusCode}`);
        }

        parts.push(`Message: ${log.message}`);

        if (log.userId) {
            parts.push(`User: ${log.userId}`);
        }

        return parts.join(' | ');
    }

    /**
     * Log a network error
     */
    logNetworkError(endpoint: string, method: string, message: string): void {
        this.log({
            type: 'network',
            endpoint,
            method,
            message,
        });
    }

    /**
     * Log an API error
     */
    logApiError(
        endpoint: string,
        method: string,
        statusCode: number,
        message: string,
    ): void {
        this.log({
            type: 'api',
            endpoint,
            method,
            statusCode,
            message,
        });
    }

    /**
     * Log an authentication error
     */
    logAuthError(message: string, endpoint?: string): void {
        this.log({
            type: 'auth',
            endpoint,
            message,
        });
    }

    /**
     * Log a validation error
     */
    logValidationError(message: string): void {
        this.log({
            type: 'validation',
            message,
        });
    }
}

// Export singleton instance
export const errorLogger = new ErrorLoggerService();
