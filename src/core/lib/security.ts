/**
 * Utilitários de Segurança
 * Funções para higienização e proteção de dados
 */

/**
 * Lista de chaves sensíveis que devem ser mascaradas nos logs
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
  'api_key',
];

/**
 * Higieniza dados para log, mascarando campos sensíveis
 * @param data Dados a serem higienizados
 * @returns Dados higienizados (cópia profunda)
 */
export function sanitizeData(data: unknown): unknown {
  if (!data) return data;

  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    // Verificar se a chave é sensível (case insensitive e partial match)
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      if (typeof value === 'string') {
        sanitized[key] = '***';
      } else if (value === null || value === undefined) {
        sanitized[key] = value;
      } else {
        // Se for objeto/array sensível, mascarar tudo ou recursivo?
        // Geralmente mascaramos o valor direto se a chave é sensível.
        sanitized[key] = '***';
      }
    } else {
      // Recursão para objetos aninhados
      sanitized[key] = sanitizeData(value);
    }
  }

  return sanitized;
}
