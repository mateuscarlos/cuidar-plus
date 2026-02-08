/**
 * Security Utilities
 */

/**
 * Sensitive keys that should be masked in logs
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'secret',
  'apikey',
  'api_key',
  'cvv',
  'credit_card',
  'card_number',
];

/**
 * Sanitizes data by masking sensitive fields
 * Useful for logging requests/responses safely
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object' && data !== null) {
    // Handle Date objects and other non-plain objects if necessary
    if (data instanceof Date) return data;

    const sanitized: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const [key, value] of Object.entries(obj)) {
      // Check if key contains any sensitive keyword
      if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '***';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  return data;
}
