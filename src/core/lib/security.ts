/**
 * Security Utilities
 * Helper functions for security-related operations
 */

// Keys that should be masked if they are included in the property name (partial match)
const SENSITIVE_SUBSTRINGS = [
  'password',
  'token',
  'secret',
  'creditcard',
  'cardnumber'
];

// Keys that should be masked only if they match exactly (to avoid false positives like 'target' matching 'rg')
const SENSITIVE_EXACT_KEYS = [
  'cpf',
  'rg',
  'cvv',
  'cvc',
  'pan',
  'authorization'
];

/**
 * Sanitizes data by masking sensitive fields
 * recursive function to handle nested objects
 */
export function sanitizeData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  // Handle Date objects and other non-plain objects if necessary
  if (data instanceof Date) {
    return data;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();

    // Check if key matches sensitive patterns
    const isSensitive =
      SENSITIVE_EXACT_KEYS.includes(lowerKey) ||
      SENSITIVE_SUBSTRINGS.some(substring => lowerKey.includes(substring));

    if (isSensitive) {
      sanitized[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
