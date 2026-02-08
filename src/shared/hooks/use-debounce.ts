import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debouncing de valores.
 * @param value O valor a ser observado.
 * @param delay O atraso em milissegundos antes de atualizar o valor debounced.
 * @returns O valor debounced.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Define um timer para atualizar o valor debounced após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor ou o delay mudarem antes do tempo acabar
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
