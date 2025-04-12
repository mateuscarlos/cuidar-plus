import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

/**
 * Interceptor para tratamento centralizado de erros HTTP
 * Captura erros, registra logs e exibe mensagens amigáveis ao usuário
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // Armazena requisições em andamento para controlar indicadores de carregamento
  private activeRequests = 0;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    
    // Não interceptar requisições para APIs externas (como ViaCEP)
    const isExternalRequest = !request.url.includes(window.location.hostname) && 
                              !request.url.includes('localhost') &&
                              !request.url.includes('127.0.0.1');
    
    if (isExternalRequest) {
      // Para APIs externas, apenas contamos a requisição mas não interferimos
      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
        })
      );
    }
    
    // Para APIs internas, tratamos os erros
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Personalizar tratamento com base no tipo e código de erro
        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente (problemas de rede, etc)
          this.toastService.error(
            'Problema de conexão. Verifique sua internet e tente novamente.',
            'Erro de Conexão'
          );
        } else {
          // Erro do lado do servidor
          this.handleError(error);
        }
        
        // Repassar o erro original para outros handlers
        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocorreu um erro inesperado.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
      this.toastService.error(errorMessage, 'Erro de Conexão');
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Há dados inválidos na solicitação. Por favor, revise e tente novamente.';
          this.toastService.warning(errorMessage, 'Erro de Validação');
          break;
        case 401:
          errorMessage = 'Sua sessão expirou. Faça login novamente.';
          this.toastService.error(errorMessage, 'Não Autorizado');
          this.router.navigate(['/login']);
          break;
        case 403:
          errorMessage = 'Você não tem permissão para realizar esta operação.';
          this.toastService.error(errorMessage, 'Acesso Negado');
          break;
        case 404:
          errorMessage = 'O recurso solicitado não foi encontrado.';
          this.toastService.warning(errorMessage, 'Recurso Não Encontrado');
          break;
        case 500:
          errorMessage = 'Erro interno no servidor. Tente novamente mais tarde.';
          this.toastService.error(errorMessage, 'Erro no Servidor');
          break;
        default:
          errorMessage = `Ocorreu um erro inesperado. Código: ${error.status}`;
          this.toastService.error(errorMessage, 'Erro Desconhecido');
      }
    }

    console.error('Erro interceptado:', errorMessage, error);
  }
}