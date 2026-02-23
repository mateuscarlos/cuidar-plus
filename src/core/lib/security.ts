/**
 * Security utilities
 */

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
 * Sanitizes sensitive data from an object by masking values of keys that match SENSITIVE_KEYS
 * Performs a deep copy to avoid modifying the original object.
 */
export function sanitizeData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (data instanceof Date) {
    return new Date(data);
  }

  // Handle other built-in objects that shouldn't be traversed like plain objects
  if (data instanceof RegExp || data instanceof Error || data instanceof Set || data instanceof Map) {
      return data;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    // Check if key contains any sensitive keyword
    const isSensitive = SENSITIVE_KEYS.some((k) => lowerKey.includes(k.toLowerCase()));

    if (isSensitive) {
      sanitized[key] = '***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
