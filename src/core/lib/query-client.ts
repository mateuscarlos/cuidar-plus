/**
 * Configuração do React Query
 * Setup centralizado com defaults otimizados
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/core/config/api.config';

/**
 * Configurações padrão para queries
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Tempo de cache padrão: 5 minutos
    staleTime: 1000 * 60 * 5,
    
    // Tempo de cache em memória: 10 minutos
    gcTime: 1000 * 60 * 10,
    
    // Retry logic
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      // Não retry em erros 4xx (exceto 408 timeout)
      if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        if (axiosError?.response?.status === 408) return failureCount < 2;
        return false;
      }
      // Retry até 2 vezes em outros erros
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch on window focus apenas em produção
    refetchOnWindowFocus: import.meta.env.PROD,
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Refetch on mount apenas se dados estiverem stale
    refetchOnMount: true,
  },
  
  mutations: {
    // Handler global de erro para mutations
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error('Erro na operação', {
        description: message,
      });
    },
    
    // Retry apenas uma vez para mutations
    retry: 1,
  },
};

/**
 * Criar instância do Query Client
 */
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

/**
 * Query Keys
 * Centraliza as keys para invalidação e prefetch
 */
export const QUERY_KEYS = {
  // Patients
  PATIENTS: {
    all: ['patients'] as const,
    lists: () => [...QUERY_KEYS.PATIENTS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.PATIENTS.lists(), filters] as const,
    details: () => [...QUERY_KEYS.PATIENTS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.PATIENTS.details(), id] as const,
  },
  
  // Inventory
  INVENTORY: {
    all: ['inventory'] as const,
    lists: () => [...QUERY_KEYS.INVENTORY.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.INVENTORY.lists(), filters] as const,
    details: () => [...QUERY_KEYS.INVENTORY.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.INVENTORY.details(), id] as const,
  },
  
  // Reports
  REPORTS: {
    all: ['reports'] as const,
    lists: () => [...QUERY_KEYS.REPORTS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.REPORTS.lists(), filters] as const,
    details: () => [...QUERY_KEYS.REPORTS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.REPORTS.details(), id] as const,
  },
  
  // Users
  USERS: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.USERS.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.USERS.lists(), filters] as const,
    details: () => [...QUERY_KEYS.USERS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.USERS.details(), id] as const,
    profile: () => [...QUERY_KEYS.USERS.all, 'profile'] as const,
  },
  
  // Dashboard
  DASHBOARD: {
    stats: () => ['dashboard', 'stats'] as const,
    recentActivity: () => ['dashboard', 'recent-activity'] as const,
  },
} as const;

/**
 * Helpers para invalidação de cache
 */
export const invalidateQueries = {
  patients: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS.all }),
  inventory: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVENTORY.all }),
  reports: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS.all }),
  users: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.all }),
  dashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  all: () => queryClient.invalidateQueries(),
};

export default queryClient;
