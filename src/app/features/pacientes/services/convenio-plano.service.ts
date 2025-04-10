import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Convenio } from '../models/convenio.model';
import { Plano } from '../models/plano.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConvenioPlanoService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os convênios cadastrados
   */
  listarConvenios(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(`${this.apiUrl}/convenios/listar`).pipe(
      retry(1),
      map(convenios => this.normalizarConvenios(convenios)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtém um convênio específico pelo ID
   */
  obterConvenio(id: number): Observable<Convenio> {
    return this.http.get<Convenio>(`${this.apiUrl}/convenios/${id}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Lista todos os planos de um convênio específico
   */
  listarPlanosPorConvenio(convenioId: number): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}/planos/convenios/${convenioId}`).pipe(
      retry(1),
      map(planos => this.normalizarPlanos(planos)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtém informações de um plano específico
   */
  obterPlano(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/planos/${id}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo convênio
   */
  criarConvenio(convenio: Convenio): Observable<Convenio> {
    return this.http.post<Convenio>(`${this.apiUrl}/convenios/criar`, convenio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um convênio existente
   */
  atualizarConvenio(id: number, convenio: Convenio): Observable<Convenio> {
    return this.http.put<Convenio>(`${this.apiUrl}/convenios/${id}`, convenio).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove um convênio
   */
  removerConvenio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/convenios/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo plano para um convênio específico
   */
  criarPlano(convenioId: number, plano: Plano): Observable<Plano> {
    return this.http.post<Plano>(`${this.apiUrl}/convenios/${convenioId}/planos`, plano).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um plano existente
   */
  atualizarPlano(id: number, plano: Plano): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/planos/${id}`, plano).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove um plano
   */
  removerPlano(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/planos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Normaliza um array de convênios
   */
  private normalizarConvenios(convenios: any[]): Convenio[] {
    if (!convenios || !Array.isArray(convenios)) return [];
    
    return convenios.map(c => {
      // Garantir que todos os campos necessários estejam presentes
      return {
        id: c.id,
        nome: c.nome || 'Sem nome',
        codigo: c.codigo || '',
        ativo: c.ativo === undefined ? true : c.ativo,
        created_at: c.created_at || '',
        updated_at: c.updated_at || ''
      };
    });
  }

  /**
   * Normaliza um array de planos
   */
  private normalizarPlanos(planos: any[]): Plano[] {
    if (!planos || !Array.isArray(planos)) return [];
    
    return planos.map(p => {
      // Garantir que todos os campos necessários estejam presentes
      return {
        id: p.id,
        convenio_id: p.convenio_id,
        nome: p.nome || 'Sem nome',
        codigo: p.codigo || '',
        tipo_acomodacao: p.tipo_acomodacao || '',
        ativo: p.ativo === undefined ? true : p.ativo,
        created_at: p.created_at || '',
        updated_at: p.updated_at || '',
        convenio: p.convenio || undefined
      };
    });
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(error: HttpErrorResponse) {
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