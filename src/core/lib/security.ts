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
  'apiKey',
];

/**
 * Sanitizes data by masking sensitive keys
 * @param data Data to sanitize
 * @returns Sanitized data with masked values
 */
export function sanitizeData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    // Check if key contains any sensitive keyword (case insensitive)
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '***';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
