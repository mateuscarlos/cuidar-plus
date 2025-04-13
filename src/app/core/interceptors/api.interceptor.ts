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
    console.log(`[HTTP ${request.method}] Início da requisição para: ${request.url}`);
    console.log('Request original:', {
      url: request.url,
      method: request.method,
      headers: request.headers.keys(),
      body: request.body
    });
    
    // Verificar se a requisição é para um domínio externo
    const isExternalRequest = request.url.startsWith('http') && !request.url.includes(environment.apiUrl);
    
    let modifiedRequest = request;
    
    // Adicionar a URL base da API se a requisição não for absoluta
    if (!request.url.startsWith('http')) {
      // CORREÇÃO: Não adicionar o prefixo /api para rotas de pacientes
      let url;
      if (request.url.includes('/pacientes')) {
        // Para rotas de pacientes, não adicionar /api
        url = request.url.startsWith('/') ? request.url : '/' + request.url;
      } else {
        // Para outras rotas, verificar e adicionar /api se necessário
        url = request.url.startsWith('/api/') 
          ? request.url 
          : `/api${request.url.startsWith('/') ? request.url : '/' + request.url}`;
      }
        
      modifiedRequest = request.clone({
        url: `${environment.apiUrl}${url}`
      });
      
      console.log(`[HTTP] URL modificada para: ${modifiedRequest.url}`);
    }
    
    console.log(`[HTTP ${modifiedRequest.method}] Requisição final para: ${modifiedRequest.url}`);
    
    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('auth_token');
    if (token) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Add testing headers if we're in the test environment and NOT sending to external API
    if (environment.testing && !isExternalRequest) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'X-Test-Environment': 'true'
        }
      });
    }

    return next.handle(modifiedRequest).pipe(
      tap(event => {
        if (event.type !== 0) { // Ignorar eventos "sent"
          console.log(`[HTTP] Resposta recebida de ${modifiedRequest.url}`, event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`[HTTP Error] ${modifiedRequest.url}:`, error);
        
        // Enhanced error logging in test environment
        if (environment.testing && environment.logLevel === 'debug') {
          console.group('API Error in Test Environment');
          console.error('Request URL:', modifiedRequest.url);
          console.error('Status:', error.status);
          console.error('Error:', error);
          console.groupEnd();
        }
        
        // Log mais detalhado para erros 404
        if (error.status === 404) {
          console.error(`Rota não encontrada: ${modifiedRequest.url}`);
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