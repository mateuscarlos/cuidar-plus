/**
 * Utilitários de Segurança
 * Funções para sanitização e segurança de dados
 */

/**
 * Sanitiza dados para evitar vazamento de informações sensíveis em logs
 * Substitui valores de chaves sensíveis por *****
 *
 * @param data Dados a serem sanitizados
 * @returns Dados sanitizados (cópia profunda)
 */
export function sanitizeData(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Lista de chaves sensíveis (case insensitive)
  const SENSITIVE_KEYS = [
    'password',
    'senha',
    'token',
    'access_token',
    'refresh_token',
    'authorization',
    'secret',
    'key',
    'credit_card',
    'cvv',
    'card_number',
  ];

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();

    // Verifica se a chave contém algum termo sensível
    const isSensitive = SENSITIVE_KEYS.some(term => lowerKey.includes(term));

    if (isSensitive) {
      sanitized[key] = '*****';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
