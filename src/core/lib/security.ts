/**
 * Security Utilities
 * Common security functions for data sanitization and protection
 */

// Keys that should be masked in logs
const SENSITIVE_KEYS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'secret',
  'key',
  'credit_card',
  'cvv',
];

/**
 * Sanitizes an object by masking sensitive values
 * Useful for logging safely
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeData(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitized: any = { ...data };

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase();

      if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '***MASKED***';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    }

    return sanitized;
  }

  return data;
}
