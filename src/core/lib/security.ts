/**
 * Security utilities for the application.
 */

// Keys that are considered sensitive and should be sanitized in logs
const SENSITIVE_KEYS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'secret',
  'apiKey',
  'credit_card',
  'cpf',
  'rg'
];

/**
 * Sanitizes an object by recursively replacing sensitive values with '[REDACTED]'.
 * This is useful for logging objects that may contain passwords or tokens.
 *
 * @param obj The object to sanitize
 * @returns A new sanitized object, or the original value if it's not an object
 */
export function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
  }

  // Handle special object types that shouldn't be recursed into
  if (obj instanceof Date || obj instanceof Blob || obj instanceof File) {
    return obj;
  }

  const sanitized: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const isSensitive = SENSITIVE_KEYS.some(sensitiveKey =>
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(obj[key]);
      }
    }
  }

  return sanitized;
}
