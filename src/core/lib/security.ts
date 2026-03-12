const SENSITIVE_KEYS = new Set(['password', 'token', 'refresh', 'refreshtoken', 'refresh_token', 'access_token', 'cpf', 'rg', 'secret', 'email', 'phone', 'document', 'apikey', 'api_key']);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeData(data: any, seen = new WeakSet()): any {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date || (typeof Blob !== 'undefined' && data instanceof Blob) || (typeof File !== 'undefined' && data instanceof File)) {
    return data;
  }
  if (seen.has(data)) {
    return '[Circular]';
  }
  seen.add(data);
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, seen));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // Check if the exact key or common variations are in the set, or if it strictly contains 'password' or 'token'
    const isSensitive = SENSITIVE_KEYS.has(lowerKey) ||
                        lowerKey.includes('password') ||
                        lowerKey.includes('token') ||
                        lowerKey === 'api_key' ||
                        lowerKey === 'apikey';

    if (isSensitive) {
      sanitized[key] = '[FILTERED]';
    } else {
      sanitized[key] = sanitizeData(value, seen);
    }
  }
  return sanitized;
}
