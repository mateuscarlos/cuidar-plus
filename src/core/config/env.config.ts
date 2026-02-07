/**
 * Configurações de Ambiente
 * Centraliza todas as variáveis de ambiente do projeto
 */

export const ENV = {
  // API Configuration
  // Em dev, usa proxy do Vite (URL relativa)
  // Em prod, usa URL completa do backend
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // App Configuration
  APP_NAME: 'Cuidar+',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEBUG: import.meta.env.DEV,
  
  // Auth
  TOKEN_KEY: 'cuidar_plus_auth_token',
  REFRESH_TOKEN_KEY: 'cuidar_plus_refresh_token',
} as const;

// Type-safe environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Validate required environment variables
export function validateEnv(): void {
  const required: (keyof typeof ENV)[] = ['API_BASE_URL'];
  
  for (const key of required) {
    if (!ENV[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
