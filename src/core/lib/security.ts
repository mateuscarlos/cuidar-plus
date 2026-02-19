/**
 * Security Utilities
 * Helper functions for security, sanitization, and data protection
 */

// Keys that should be masked in logs and error messages
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
 * Mask sensitive data in an object or value
 * Used primarily for logging to prevent secrets from leaking
 */
export function sanitizeData(data: unknown): unknown {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // At this point, data is a non-null object
  const sanitized: Record<string, unknown> = {};
  const obj = data as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    // Check if key is sensitive (case-insensitive partial match)
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '*****';
    } else {
      sanitized[key] = sanitizeData(value);
    }
  }

  return sanitized;
}
