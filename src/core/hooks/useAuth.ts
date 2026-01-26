import { useState, useEffect, useCallback } from 'react';
import { AuthService, LoginRequest, LoginResponse } from '@/core/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'caregiver' | 'family' | 'admin';
  is_active: boolean;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

/**
 * Hook useAuth
 * Gerencia estado de autenticação do usuário
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verifica se há usuário salvo no localStorage ao montar o componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser && AuthService.isAuthenticated()) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Faz login do usuário
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await AuthService.login(credentials);
      
      // Salva dados do usuário no localStorage
      const userData: User = response.user;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Faz logout do usuário
   */
  const logout = useCallback(() => {
    AuthService.logout();
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user && AuthService.isAuthenticated(),
    isLoading,
    login,
    logout,
    error,
  };
}
