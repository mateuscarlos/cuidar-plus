import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`[HTTP ${request.method}] Enviando requisição para: ${request.url}`);
    
    // Adicionar a URL base da API se a requisição não for absoluta
    if (!request.url.startsWith('http')) {
      request = request.clone({
        url: `${environment.apiUrl}${request.url}`
      });
    }
    
    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('auth_token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add testing headers if we're in the test environment
    if (environment.testing) {
      request = request.clone({
        setHeaders: {
          'X-Test-Environment': 'true'
        }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event.type !== 0) { // Ignorar eventos "sent"
          console.log(`[HTTP] Resposta recebida de ${request.url}`, event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`[HTTP Error] ${request.url}:`, error);
        
        // Enhanced error logging in test environment
        if (environment.testing && environment.logLevel === 'debug') {
          console.group('API Error in Test Environment');
          console.error('Request URL:', request.url);
          console.error('Status:', error.status);
          console.error('Error:', error);
          console.groupEnd();
        }
        
        // Log mais detalhado para erros 404
        if (error.status === 404) {
          console.error(`Rota não encontrada: ${request.url}`);
        }
        
        if (error.status === 401) {
          // Redirecionar para login em caso de erro de autenticação
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}