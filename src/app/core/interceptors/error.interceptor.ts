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
import { NotificacaoService } from '../../shared/services/notificacao.service';

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
    private notificacaoService: NotificacaoService
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
          this.handleClientSideError(error);
        } else {
          // Erro do lado do servidor
          this.handleServerSideError(error);
        }
        
        // Repassar o erro original para outros handlers
        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
      })
    );
  }

  /**
   * Trata erros que ocorrem no cliente (problemas de rede, etc)
   */
  private handleClientSideError(error: HttpErrorResponse): void {
    console.error('Erro do lado do cliente:', error);
    this.notificacaoService.mostrarErro(
      'Problema de conexão. Verifique sua internet e tente novamente.'
    );
  }

  /**
   * Trata erros que ocorrem no servidor (códigos HTTP de erro)
   */
  private handleServerSideError(error: HttpErrorResponse): void {
    // Registrar o erro no console com detalhes para debugging
    console.error(`Erro ${error.status} no servidor:`, error);
    
    // Tratar códigos de erro específicos
    switch (error.status) {
      case 0:
        this.notificacaoService.mostrarErro(
          'Não foi possível conectar ao servidor. Verifique sua conexão à internet.'
        );
        break;
        
      case 400:
        this.handleValidationError(error);
        break;
        
      case 401:
        this.handleUnauthorizedError();
        break;
        
      case 403:
        this.notificacaoService.mostrarErro(
          'Você não tem permissão para realizar esta operação.'
        );
        break;
        
      case 404:
        this.notificacaoService.mostrarErro(
          'O recurso solicitado não foi encontrado no servidor.'
        );
        break;
        
      case 422:
        this.handleValidationError(error);
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        this.notificacaoService.mostrarErro(
          'Erro no servidor. Por favor, tente novamente mais tarde ou contate o suporte.'
        );
        break;
        
      default:
        this.notificacaoService.mostrarErro(
          `Ocorreu um erro inesperado. Código: ${error.status}`
        );
    }
  }

  /**
   * Trata erros de validação (400, 422)
   */
  private handleValidationError(error: HttpErrorResponse): void {
    let mensagem = 'Há dados inválidos no formulário. Por favor, verifique os campos.';
    
    // Tentar extrair mensagem de erro específica da resposta
    if (error.error?.message) {
      mensagem = error.error.message;
    } else if (error.error?.error) {
      mensagem = error.error.error;
    } else if (typeof error.error === 'string') {
      try {
        const parsedError = JSON.parse(error.error);
        mensagem = parsedError.message || parsedError.error || mensagem;
      } catch {
        // Se não conseguir parsear, mantém a mensagem padrão
      }
    }
    
    // Verificar se há erros específicos por campo
    if (error.error?.errors) {
      const errors = error.error.errors;
      const firstField = Object.keys(errors)[0];
      
      if (firstField && errors[firstField]) {
        // Mostrar o primeiro erro de validação
        mensagem = `${firstField}: ${errors[firstField]}`;
      }
    }
    
    this.notificacaoService.mostrarErro(mensagem);
  }

  /**
   * Trata erros de autenticação (401)
   */
  private handleUnauthorizedError(): void {
    this.notificacaoService.mostrarErro(
      'Sua sessão expirou ou você não está autorizado. Faça login novamente.'
    );
    
    // Limpar dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Redirecionar para login após pequeno delay para a mensagem ser visualizada
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}