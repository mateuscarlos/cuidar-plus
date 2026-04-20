import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * Útil para evitar múltiplas chamadas de API durante digitação
 *
 * @param value Valor a ser monitorado
 * @param delay Tempo de espera em ms (padrão: 500ms)
 * @returns Valor com debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
