/**
 * Utilitários de Segurança
 * Funções para proteção de dados sensíveis e segurança geral
 */

// Lista de chaves que contêm dados sensíveis que devem ser mascarados
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
 * Sanitiza dados sensíveis em objetos para logging seguro
 * Recursivamente percorre objetos e arrays mascarando valores de chaves sensíveis
 */
export function sanitizeData(data: unknown): unknown {
  // Retorna o valor original se não for um objeto ou se for nulo
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Se for array, mapeia cada item
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Se for objeto, processa cada chave
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    // Verifica se a chave é sensível (case-insensitive e partial match)
    // Ex: 'userPassword' dá match com 'password'
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

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
