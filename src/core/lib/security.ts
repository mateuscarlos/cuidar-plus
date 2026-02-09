/**
 * Security Utilities
 * Helper functions for data sanitization and security
 */

const SENSITIVE_KEYS = [
  'password',
  'passwd',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'secret',
  'apikey',
  'api_key',
  'credential',
  'card_number',
  'cvv',
];

/**
 * Sanitizes data by masking sensitive fields
 * recursive function to handle nested objects
 */
export function sanitizeData(data: unknown): unknown {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  // Handle Date, RegExp, etc. by returning them as is
  if (data instanceof Date || data instanceof RegExp) {
    return data;
  }

  const sanitized: Record<string, unknown> = {};
  const obj = data as Record<string, unknown>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
        sanitized[key] = '***HIDDEN***';
      } else {
        sanitized[key] = sanitizeData(obj[key]);
      }
    }
  }
  return sanitized;
}
