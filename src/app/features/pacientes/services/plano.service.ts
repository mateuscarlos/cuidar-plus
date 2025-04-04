import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

export interface Plano {
  id: number;
  nome: string;
  codigo: string;
  convenio_id: number;
  descricao?: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  private apiUrl = `${environment.apiUrl}/planos`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém todos os planos disponíveis
   */
  listarTodos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erro ao obter planos:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtém planos por ID de convênio
   */
  listarPorConvenio(convenioId: number): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${environment.apiUrl}/convenios/${convenioId}/planos`).pipe(
      catchError(error => {
        console.error(`Erro ao obter planos para o convênio ${convenioId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Obtém um plano específico pelo ID
   */
  obterPorId(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao obter plano ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Cria um novo plano
   */
  criar(plano: Omit<Plano, 'id'>): Observable<Plano> {
    return this.http.post<Plano>(this.apiUrl, plano).pipe(
      catchError(error => {
        console.error('Erro ao criar plano:', error);
        throw error;
      })
    );
  }

  /**
   * Atualiza um plano existente
   */
  atualizar(id: number, plano: Partial<Plano>): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/${id}`, plano).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar plano ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Altera o status de ativação de um plano
   */
  alterarStatus(id: number, ativo: boolean): Observable<Plano> {
    return this.http.patch<Plano>(`${this.apiUrl}/${id}/status`, { ativo }).pipe(
      catchError(error => {
        console.error(`Erro ao alterar status do plano ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Verifica se um plano está ativo para um determinado convênio
   */
  verificarPlanoAtivo(planoId: number, convenioId: number): Observable<boolean> {
    return this.http.get<{ativo: boolean}>(`${this.apiUrl}/${planoId}/convenio/${convenioId}/status`).pipe(
      map(response => response.ativo),
      catchError(error => {
        console.error(`Erro ao verificar status do plano ${planoId} para convênio ${convenioId}:`, error);
        return of(false);
      })
    );
  }
}