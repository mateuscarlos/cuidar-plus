import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * Útil para evitar múltiplas chamadas de API durante digitação
 *
 * @param value Valor a ser monitorado
 * @param delay Tempo de espera em milissegundos
 * @returns Valor com delay aplicado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
