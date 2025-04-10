import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * Executa uma requisição GET
   */
  get<T>(url: string, params?: HttpParams, retryCount = 1): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params }).pipe(
      retry(retryCount),
      catchError(this.handleError)
    );
  }

  /**
   * Executa uma requisição POST
   */
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Executa uma requisição PUT
   */
  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Executa uma requisição DELETE
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento centralizado de erros
   */
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido ao processar a solicitação';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente (rede, etc)
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      if (error.status === 0) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua conexão de internet.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 401) {
        errorMessage = 'Você não está autorizado a realizar esta operação. Por favor, faça login novamente.';
      } else if (error.status === 403) {
        errorMessage = 'Você não tem permissão para realizar esta operação.';
      } else if (error.status === 422 || error.status === 400) {
        // Erros de validação ou bad request
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        } else {
          errorMessage = 'Dados inválidos. Por favor, verifique os campos preenchidos.';
        }
      } else {
        errorMessage = `Erro ${error.status}: ${error.message || 'Erro desconhecido'}`;
      }
    }
    
    console.error('Erro na requisição:', error);
    return throwError(() => new Error(errorMessage));
  }
}