/**
 * Rotas da Aplicação
 * Centraliza todas as rotas para evitar strings mágicas
 */

export const ROUTES = {
  // Páginas Principais
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Módulos
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients/new',
    DETAIL: (id: string) => `/patients/${id}`,
    EDIT: (id: string) => `/patients/${id}/edit`,
  },
  
  INVENTORY: {
    LIST: '/inventory',
    CREATE: '/inventory/new',
    DETAIL: (id: string) => `/inventory/${id}`,
    EDIT: (id: string) => `/inventory/${id}/edit`,
  },
  
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports/new',
    DETAIL: (id: string) => `/reports/${id}`,
  },
  
  USERS: {
    LIST: '/users',
    CREATE: '/users/new',
    DETAIL: (id: string) => `/users/${id}`,
    EDIT: (id: string) => `/users/${id}/edit`,
    PROFILE: '/users/profile',
  },
  
  // Autenticação
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    LOGOUT: '/logout',
  },
  
  // Outros
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const;

/**
 * Helper para verificar se uma rota é pública (não requer autenticação)
 */
export function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.NOT_FOUND,
  ];
  
  return publicRoutes.includes(path);
}
