/**
 * Security Utilities
 * Funções para segurança e proteção de dados
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
 * Mascara dados sensíveis em objetos para logs seguros
 * @param data Objeto ou valor a ser sanitizado
 * @returns Novo objeto com campos sensíveis mascarados
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (typeof data !== 'object') return data;

  // Preservar tipos especiais
  if (data instanceof Date) return data;
  if (data instanceof Blob) return data;
  if (data instanceof File) return data;

  // Tratar Arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Tratar Objetos
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    // Verifica se a chave é sensível (case insensitive)
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = '*** MASKED ***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
