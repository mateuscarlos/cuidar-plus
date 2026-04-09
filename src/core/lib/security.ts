/**
 * Security Utilities
 * Helper functions for security-related operations
 */

export const SENSITIVE_KEYS = [
  'password',
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
 * @param data The data to sanitize
 * @returns The sanitized data with sensitive keys masked
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (typeof data === 'object' && data !== null) {
    // Handle Date objects
    if (data instanceof Date) return data;

    const sanitized: Record<string, unknown> = { ...data as Record<string, unknown> };

    for (const key of Object.keys(sanitized)) {
      if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        sanitized[key] = '***MASKED***';
      } else {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    }
    return sanitized;
  }

  return data;
}
