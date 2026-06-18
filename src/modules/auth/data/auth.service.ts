import { apiClient } from '@/core/config/api.config';
import { ENV } from '@/core/config/env.config';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
      email,
      password,
    });
    return data;
  }

  static saveTokens(tokens: Pick<LoginResponse, 'access_token' | 'refresh_token'>): void {
    localStorage.setItem(ENV.TOKEN_KEY, tokens.access_token);
    localStorage.setItem(ENV.REFRESH_TOKEN_KEY, tokens.refresh_token);
  }

  static clearTokens(): void {
    localStorage.removeItem(ENV.TOKEN_KEY);
    localStorage.removeItem(ENV.REFRESH_TOKEN_KEY);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(ENV.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!AuthService.getAccessToken();
  }
}
