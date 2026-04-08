/**
 * Configuração do Cliente HTTP
 * Configura o Axios com interceptors para autenticação, logging e tratamento de erros
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from './env.config';
import { sanitizeData } from '../lib/security';

// Criar instância do Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adiciona token de autenticação e logging
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Adicionar token de autenticação
    const token = localStorage.getItem(ENV.TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log em desenvolvimento
    if (ENV.ENABLE_DEBUG) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: sanitizeData(config.data),
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Trata erros globalmente e faz refresh de token
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log em desenvolvimento
    if (ENV.ENABLE_DEBUG) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: sanitizeData(response.data),
      });
    }

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Tratamento de erro 401 (Não autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar refresh do token
        const refreshToken = localStorage.getItem(ENV.REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(`${ENV.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem(ENV.TOKEN_KEY, token);

          // Retry request original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Logout se refresh falhar
        localStorage.removeItem(ENV.TOKEN_KEY);
        localStorage.removeItem(ENV.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Log de erro
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

/**
 * Tipos para respostas de erro da API
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Helper para extrair mensagem de erro
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    return apiError.response?.data?.message || apiError.message || 'Erro desconhecido';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Erro desconhecido';
}

export default apiClient;
