/**
 * Security Utilities
 * Tools for data sanitization, masking, and security-related operations.
 */

// Keys that commonly contain sensitive information
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'credential',
  'key',
  'auth',
  'session',
  'cookie',
  'cpf',
  'rg',
  'document',
  'ssn',
  'credit',
  'card',
  'cvv',
  'pin',
  'email',
  'phone',
  'address',
  'zip',
  'birth',
];

/**
 * Recursively sanitizes data by masking sensitive fields.
 * Useful for logging and debugging without exposing PII or credentials.
 *
 * @param data Data to sanitize
 * @param mask String to replace sensitive values with
 * @param seen Set to track circular references
 * @returns Sanitized clone of the data
 */
export function sanitizeData<T>(data: T, mask: string = '*** MASKED ***', seen = new WeakSet()): T {
  // Handle primitive values and null/undefined
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  // Handle Dates, Blobs, Files, and other native objects that shouldn't be traversed
  if (data instanceof Date || data instanceof Blob || data instanceof File) {
    return data;
  }

  // Circular reference check
  if (seen.has(data as object)) {
    return '[Circular]' as unknown as T;
  }
  seen.add(data as object);

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, mask, seen)) as unknown as T;
  }

  // Handle Objects
  const sanitized = { ...data } as Record<string, unknown>;

  for (const [key, value] of Object.entries(sanitized)) {
    // Check if the key matches any sensitive term (case-insensitive partial match)
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some(sensitiveTerm => lowerKey.includes(sensitiveTerm));

    if (isSensitive) {
      sanitized[key] = mask;
    } else {
      // Recursively sanitize nested objects/arrays
      sanitized[key] = sanitizeData(value, mask, seen);
    }
  }

  return sanitized as T;
}
