import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook useApi
 * Gerencia estado de chamadas API genéricas
 * 
 * @param apiFunction - Função do serviço API a ser executada
 * 
 * @example
 * const { data, isLoading, error, execute } = useApi(PatientService.listByCaregiver);
 * 
 * // Em um componente
 * useEffect(() => {
 *   execute(caregiverId);
 * }, [caregiverId]);
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  /**
   * Executa a função da API
   */
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Erro ao executar requisição';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        console.error('Erro na API:', errorMessage);
        return null;
      }
    },
    [apiFunction]
  );

  /**
   * Reseta o estado do hook
   */
  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    execute,
    reset,
  };
}
