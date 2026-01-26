/**
 * API Endpoints Constants
 */

export const API_ENDPOINTS = {
  PATIENTS: {
    BASE: '/patients',
    BY_ID: (id: string) => `/patients/${id}`,
    DISCHARGE: (id: string) => `/patients/${id}/discharge`,
    HISTORY: (id: string) => `/patients/${id}/history`,
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`,
    MOVEMENT: (id: string) => `/inventory/${id}/movement`,
    LOW_STOCK: '/inventory/low-stock',
  },
  REPORTS: {
    BASE: '/reports',
    BY_ID: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    SUMMARY: '/reports/summary',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    PASSWORD: (id: string) => `/users/${id}/password`,
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  MEDICATIONS: {
    BASE: '/medications',
    BY_ID: (id: string) => `/medications/${id}`,
    BY_PATIENT: (patientId: string) => `/medications/patient/${patientId}`,
    SCHEDULE: (patientId: string) => `/medications/patient/${patientId}/schedule`,
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
    BY_PATIENT: (patientId: string) => `/appointments/patient/${patientId}`,
    UPCOMING: '/appointments/upcoming',
  },
} as const;
