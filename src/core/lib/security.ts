/**
 * Security Utilities
 * Helper functions for data sanitization and security checks
 */

// Keys that should be masked in logs
export const SENSITIVE_KEYS = [
  'password',
  'passwordConfirm',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'authorization',
  'cookie',
  'creditCard',
  'cvv',
  'apiKey',
];

/**
 * Sanitize Data for Logging
 * Recursively masks sensitive keys in objects
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (typeof data === 'string') {
    // Basic heuristics for string masking if needed, but mainly focusing on objects
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object') {
    // Handle special types
    if (data instanceof Date) return data.toISOString();
    if (data instanceof Blob || data instanceof File) return '[Binary Data]';

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        sanitized[key] = '***MASKED***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  return data;
}
