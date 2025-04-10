import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  token?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Usuario;
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Retorna o usuário atual
   */
  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Realiza o login do usuário
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.setUserSession(response)),
      catchError(error => {
        let errorMsg = 'Erro desconhecido durante o login';
        
        if (error.status === 401) {
          errorMsg = 'Email ou senha incorretos';
        } else if (error.status === 422) {
          errorMsg = 'Dados de login inválidos';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        }
        
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    // Remover dados do localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Atualizar o BehaviorSubject
    this.currentUserSubject.next(null);
    
    // Redirecionar para a página de login
    this.router.navigate(['/login']);
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    const token = localStorage.getItem('token');
    
    return !!currentUser && !!token;
  }

  /**
   * Armazena os dados da sessão do usuário
   */
  private setUserSession(response: AuthResponse): void {
    // Verificar se a resposta tem os dados necessários
    if (!response || !response.user || !response.token) {
      console.error('Resposta de autenticação inválida:', response);
      return;
    }

    const usuario: Usuario = {
      ...response.user,
      token: response.token
    };
    
    // Salvar dados no localStorage
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    localStorage.setItem('token', response.token);
    
    // Atualizar o BehaviorSubject
    this.currentUserSubject.next(usuario);
  }

  /**
   * Recupera o usuário do localStorage
   */
  private getUserFromStorage(): Usuario | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica se o token ainda é válido
   */
  isTokenValid(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/validate-token`).pipe(
      map(response => response.valid),
      catchError(() => {
        // Em caso de erro, consideramos o token inválido
        this.logout();
        return throwError(() => new Error('Token inválido'));
      })
    );
  }
}