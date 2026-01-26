import apiClient from '@/core/config/api.config';
import { API_ENDPOINTS } from '@/core/constants/api';

/**
 * DTOs para Authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'caregiver' | 'family' | 'admin';
    is_active: boolean;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * AuthService
 * Gerencia autenticação e tokens JWT
 */
export class AuthService {
  /**
   * Faz login do usuário
   * @param data - Credenciais do usuário (email e senha)
   * @returns Dados do usuário e tokens
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    // Armazena tokens no localStorage
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    
    return response.data;
  }

  /**
   * Atualiza o access token usando refresh token
   * @param refreshToken - Token de refresh
   * @returns Novos tokens
   */
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );
    
    // Atualiza tokens no localStorage
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    
    return response.data;
  }

  /**
   * Faz logout do usuário
   * Remove tokens do localStorage
   */
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se há um token válido
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Obtém o token de acesso atual
   * @returns Token de acesso ou null
   */
  static getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtém o refresh token atual
   * @returns Refresh token ou null
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}
