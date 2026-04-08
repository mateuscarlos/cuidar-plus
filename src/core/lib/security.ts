/**
 * Security Utilities
 * Helper functions for data sanitization and security checks
 */

// List of sensitive keys that should be masked in logs
// Case insensitive matching will be applied
const SENSITIVE_KEYS = [
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
 * Sanitizes data by masking sensitive fields
 * recursive function to handle nested objects and arrays
 * @param data - The data to sanitize
 * @returns The sanitized data
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object' && data !== null) {
    // Avoid sanitizing special objects like Date, RegExp, etc. if they are not plain objects
    // But for logging purposes, JSON compatibility is main concern.
    // However, if we receive a class instance, spreading it might lose prototype or private fields.
    // For logging, we usually want a plain object representation.

    // Check if it's a plain object or something that behaves like one
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      // Check if key is sensitive (case insensitive partial match)
      // e.g. "userPassword", "api_token", "MySecret"
      const isSensitive = SENSITIVE_KEYS.some(sensitiveKey =>
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      );

      if (isSensitive) {
        sanitized[key] = '***MASKED***';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }

    return sanitized;
  }

  return data;
}
