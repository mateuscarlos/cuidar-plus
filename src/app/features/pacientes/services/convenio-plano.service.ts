import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Convenio } from '../models/convenio.model';
import { Plano } from '../models/plano.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConvenioPlanoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('API URL configurada:', this.apiUrl);
  }

  // CONVÊNIOS
  
  /**
   * Listar todos os convênios ativos
   */
  listarConvenios(): Observable<Convenio[]> {
    const url = `${this.apiUrl}/convenios/listar`;
    console.log('Solicitando convênios de:', url);
    return this.http.get<Convenio[]>(url).pipe(
      map(response => {
        console.log('Resposta da API (convênios):', response);
        return response;
      }),
      catchError(error => {
        console.error(`Erro ao obter convênios (${url}):`, error);
        
        // Se for erro 404, verificar os blueprints no backend
        if (error.status === 404) {
          console.error('Rota não encontrada. Verifique se o blueprint convenio_plano_routes está registrado no backend.');
        }
        
        return of([]);
      })
    );
  }

  /**
   * Obter um convênio pelo ID
   */
  obterConvenioPorId(id: number): Observable<Convenio> {
    console.log(`Solicitando convênio ID ${id} da API`);
    return this.http.get<Convenio>(`${this.apiUrl}/convenios/${id}`).pipe(
      map(response => {
        console.log(`Resposta da API (convênio ${id}):`, response);
        return response;
      }),
      catchError(error => {
        console.error(`Erro ao obter convênio ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Criar um novo convênio
   */
  criarConvenio(convenio: Omit<Convenio, 'id'>): Observable<Convenio> {
    return this.http.post<Convenio>(`${this.apiUrl}/convenios/criar`, convenio).pipe(
      catchError(error => {
        console.error('Erro ao criar convênio:', error);
        throw error;
      })
    );
  }

  /**
   * Atualizar um convênio existente
   */
  atualizarConvenio(id: number, convenio: Partial<Convenio>): Observable<Convenio> {
    return this.http.put<Convenio>(`${this.apiUrl}/convenios/${id}`, convenio).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar convênio ${id}:`, error);
        throw error;
      })
    );
  }

  // PLANOS

  /**
   * Listar todos os planos
   */
  listarPlanos(): Observable<Plano[]> {
    console.log('Solicitando lista de planos da API');
    return this.http.get<Plano[]>(`${this.apiUrl}/planos/listar`).pipe(
      map(response => {
        console.log('Resposta da API (planos):', response);
        return response;
      }),
      catchError(error => {
        console.error('Erro ao obter planos:', error);
        return of([]);
      })
    );
  }

  /**
   * Listar planos por convênio
   */
  listarPlanosPorConvenio(convenioId: number): Observable<Plano[]> {
    const url = `${this.apiUrl}/planos/convenio/${convenioId}`;
    console.log(`Solicitando planos do convênio ID ${convenioId} de:`, url);
    return this.http.get<Plano[]>(url).pipe(
      map(response => {
        console.log(`Resposta da API (planos do convênio ${convenioId}):`, response);
        return response;
      }),
      catchError(error => {
        console.error(`Erro ao obter planos para convênio ${convenioId} (${url}):`, error);
        
        // Se for erro 404, verificar os blueprints no backend
        if (error.status === 404) {
          console.error('Rota não encontrada. Verifique se o blueprint convenio_plano_routes está registrado no backend.');
        }
        
        return of([]);
      })
    );
  }

  /**
   * Obter um plano pelo ID
   */
  obterPlanoPorId(id: number): Observable<Plano> {
    return this.http.get<Plano>(`${this.apiUrl}/planos/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao obter plano ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Criar um novo plano
   */
  criarPlano(plano: Omit<Plano, 'id'>): Observable<Plano> {
    return this.http.post<Plano>(`${this.apiUrl}/planos/criar`, plano).pipe(
      catchError(error => {
        console.error('Erro ao criar plano:', error);
        throw error;
      })
    );
  }

  /**
   * Atualizar um plano existente
   */
  atualizarPlano(id: number, plano: Partial<Plano>): Observable<Plano> {
    return this.http.put<Plano>(`${this.apiUrl}/planos/${id}`, plano).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar plano ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Alterar status de um plano (ativar/desativar)
   */
  alterarStatusPlano(id: number, ativo: boolean): Observable<Plano> {
    return this.http.patch<Plano>(`${this.apiUrl}/planos/${id}/status`, { ativo }).pipe(
      catchError(error => {
        console.error(`Erro ao alterar status do plano ${id}:`, error);
        throw error;
      })
    );
  }
}