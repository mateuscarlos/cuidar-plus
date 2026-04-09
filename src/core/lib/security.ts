/**
 * Utilitários de segurança para o frontend.
 */

// Lista de chaves que contêm informações sensíveis e devem ser mascaradas nos logs.
// Armazenar em lower case para a busca case-insensitive funcionar.
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'refreshtoken',
  'apikey',
  'secret',
  'authorization',
  'cpf',
  'rg',
  'email',
  'phone',
  'creditcard',
  'cvv',
]);

const MAX_DEPTH = 5;

/**
 * Função para sanitizar/mascarar dados sensíveis em objetos antes de realizar o log.
 * Evita vazar informações confidenciais (PII, credenciais) no console.
 *
 * @param data O dado a ser sanitizado
 * @param seen WeakSet para evitar loops infinitos com referências circulares
 * @param depth Controle da profundidade máxima para performance
 * @returns O dado sanitizado
 */
export function sanitizeData(data: unknown, seen = new WeakSet(), depth = 0): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (depth > MAX_DEPTH) {
    return '[Max Depth Reached]';
  }

  // File, Blob e FormData não precisam/devem ser destrinchados nos logs (evita lentidão e travamentos)
  if (data instanceof File || data instanceof Blob) {
    return '[Binary Data]';
  }

  if (data instanceof FormData) {
    const formDataEntries: Record<string, unknown> = {};
    data.forEach((value, key) => {
       if (SENSITIVE_KEYS.has(key.toLowerCase())) {
         formDataEntries[key] = '[REDACTED]';
       } else {
         formDataEntries[key] = typeof value === 'string' ? value : '[Binary Data]';
       }
    });
    return formDataEntries;
  }

  if (data instanceof Map) {
     const mapEntries = new Map();
     data.forEach((value, key) => {
        const strKey = String(key).toLowerCase();
        if (SENSITIVE_KEYS.has(strKey)) {
          mapEntries.set(key, '[REDACTED]');
        } else {
          mapEntries.set(key, sanitizeData(value, seen, depth + 1));
        }
     });
     return mapEntries;
  }

  if (data instanceof Set) {
     const setArray = Array.from(data);
     return new Set(setArray.map(item => sanitizeData(item, seen, depth + 1)));
  }

  if (typeof data === 'object') {
    if (seen.has(data)) {
      return '[Circular Reference]';
    }

    seen.add(data);

    let result: unknown;

    if (Array.isArray(data)) {
      // Limite para não iterar arrays muito grandes e travar o log
      if (data.length > 100) {
        result = [
          ...data.slice(0, 100).map(item => sanitizeData(item, seen, depth + 1)),
          `... [${data.length - 100} more items]`
        ];
      } else {
        result = data.map(item => sanitizeData(item, seen, depth + 1));
      }
    } else {
      const sanitized: Record<string, unknown> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (SENSITIVE_KEYS.has(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
          } else {
            sanitized[key] = sanitizeData((data as Record<string, unknown>)[key], seen, depth + 1);
          }
        }
      }
      result = sanitized;
    }

    // Remover após percorrer a ramificação para permitir instâncias iguais em nós diferentes (DAGs)
    seen.delete(data);

    return result;
  }

  return '[Unknown Type]';
}
