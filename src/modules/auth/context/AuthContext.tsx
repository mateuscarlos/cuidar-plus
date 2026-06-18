import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthService } from '../data/auth.service';
import { ROUTES } from '@/core/constants/routes';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await AuthService.login(email, password);
    AuthService.saveTokens(tokens);
    setIsAuthenticated(true);
    navigate(ROUTES.HOME);
  }, [navigate]);

  const logout = useCallback(() => {
    AuthService.clearTokens();
    setIsAuthenticated(false);
    toast.info('Sessão encerrada');
    navigate(ROUTES.AUTH.LOGIN);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
