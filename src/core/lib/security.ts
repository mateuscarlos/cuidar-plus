/**
 * Security Utilities
 * Helper functions for data sanitization and security
 */

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
];

/**
 * Sanitizes data by masking sensitive keys
 * Used primarily for logging to prevent credential leaks
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Create a shallow copy to avoid mutating the original object
  const sanitized: Record<string, unknown> = { ...(data as Record<string, unknown>) };

  for (const key of Object.keys(sanitized)) {
    // Check if key is sensitive (case insensitive)
    if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive.toLowerCase()))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }

  return sanitized;
}
