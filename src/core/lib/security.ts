/**
 * Security Utilities
 * Helper functions for data masking and security
 */

/**
 * List of sensitive keys to be masked in logs and debug output
 * Case-insensitive partial match
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
 * Used for logging and debug output
 *
 * @param data The data to sanitize
 * @returns A sanitized copy of the data
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object' && data !== null) {
    // Handle Date objects
    if (data instanceof Date) {
      return new Date(data);
    }

    // Handle Blob/File objects (skip content)
    // Check for global existence to avoid reference errors in Node environments
    const isBlob = typeof Blob !== 'undefined' && data instanceof Blob;
    const isFile = typeof File !== 'undefined' && data instanceof File;

    if (isBlob || isFile) {
      return '[Binary Data]';
    }

    const sanitized: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const lowerKey = key.toLowerCase();

      // Check if key contains any sensitive keyword
      const isSensitive = SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive.toLowerCase()));

      if (isSensitive) {
        if (typeof value === 'string') {
          // Keep first few chars if long enough, otherwise full mask
          if (value.length > 10) {
            sanitized[key] = `${value.substring(0, 3)}***${value.substring(value.length - 3)}`;
          } else {
            sanitized[key] = '***';
          }
        } else {
          sanitized[key] = '***';
        }
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}
