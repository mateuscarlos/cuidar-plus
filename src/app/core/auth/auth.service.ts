import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.carregarUsuarioSalvo();
  }
  
  private carregarUsuarioSalvo() {
    const userJson = localStorage.getItem('current_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('current_user');
        localStorage.removeItem('auth_token');
      }
    }
  }
  
  login(email: string, senha: string): Observable<AuthResponse> {
    if (environment.production) {
      return this.http.post<AuthResponse>(`/api/login`, { email, senha }).pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Falha na autenticação'));
        })
      );
    }
    
    // Mock para desenvolvimento - atualizado para incluir usuário root
    if (email === 'admin@cuidarplus.com' && senha === 'CuidarPlus@2025') {
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          nome: 'Administrador',
          email: 'admin@cuidarplus.com',
          cargo: 'Administrador',
          permissions: ['admin', 'view_all', 'edit_all', 'delete_all']
        },
        token: 'mock-jwt-token'
      };
      
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('current_user', JSON.stringify(mockResponse.user));
      this.currentUserSubject.next(mockResponse.user);
      
      return of(mockResponse).pipe(delay(500)); // Simula atraso da rede
    }
    
    return throwError(() => new Error('Credenciais inválidas'));
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  // Método para verificar se o usuário tem uma permissão específica
  hasPermission(permission: string): boolean {
    const user = this.currentUser;
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission) || user.permissions.includes('admin');
  }
}