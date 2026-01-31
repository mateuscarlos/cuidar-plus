/**
 * Security Utilities
 * Common security functions for data sanitization and validation
 */

export const SENSITIVE_KEYS = [
  'password',
  'token',
  'authorization',
  'secret',
  'credential',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
];

/**
 * Sanitizes data by masking sensitive fields
 * Recursively traverses objects and arrays
 *
 * @param data The data to sanitize
 * @returns Sanitized data copy
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;
  if (typeof data !== 'object') return data;
  if (data instanceof Date) return data;
  if (data instanceof Blob || data instanceof File) return '[Blob/File]';

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  const sanitized: Record<string, unknown> = {};
  // Safe cast because we checked typeof data === 'object' and it's not null (from !data check)
  const obj = data as Record<string, unknown>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      // Check if key contains any sensitive keyword
      const isSensitive = SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));

      if (isSensitive) {
        sanitized[key] = '***SENSITIVE***';
      } else {
        sanitized[key] = sanitizeData(obj[key]);
      }
    }
  }

  return sanitized;
}
