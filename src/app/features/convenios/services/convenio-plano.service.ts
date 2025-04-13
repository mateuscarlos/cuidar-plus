import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface Convenio {
  id: number;
  nome: string;
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Plano {
  id: number;
  convenio_id: number;
  nome: string;
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConvenioPlanoService {
  private apiUrl = environment.apiUrl;
  
  // Cache para convenios e planos para evitar requisições repetidas
  private conveniosCache: Map<number, Convenio> = new Map();
  private planosCache: Map<number, Plano> = new Map();
  
  constructor(private http: HttpClient) {}
  
  /**
   * Obtém todos os convênios
   */
  obterConvenios(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(`${this.apiUrl}/convenios`).pipe(
      retry(1),
      tap(convenios => {
        // Armazenar no cache
        convenios.forEach(convenio => {
          this.conveniosCache.set(convenio.id, convenio);
        });
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Obtém um convênio específico por ID
   */
  obterConvenio(id: number): Observable<Convenio> {
    // Verificar se o convênio já está no cache
    if (this.conveniosCache.has(id)) {
      return of(this.conveniosCache.get(id) as Convenio);
    }
    
    // Se não estiver no cache, fazer a requisição
    return this.http.get<Convenio>(`${this.apiUrl}/convenios/${id}`).pipe(
      retry(1),
      tap(convenio => {
        // Armazenar no cache
        this.conveniosCache.set(convenio.id, convenio);
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Obtém todos os planos de um convênio específico
   */
  obterPlanosPorConvenio(convenioId: number): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}/convenios/${convenioId}/planos`).pipe(
      retry(1),
      tap(planos => {
        // Armazenar no cache
        planos.forEach(plano => {
          this.planosCache.set(plano.id, plano);
        });
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Obtém detalhes de um plano específico
   */
  obterPlano(planoId: number): Observable<Plano> {
    // Verificar se o plano já está no cache
    if (this.planosCache.has(planoId)) {
      return of(this.planosCache.get(planoId) as Plano);
    }
    
    return this.http.get<Plano>(`${this.apiUrl}/planos/${planoId}`).pipe(
      retry(1),
      tap(plano => {
        // Armazenar no cache
        this.planosCache.set(plano.id, plano);
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Retorna o nome do convênio com base no seu ID
   * Busca primeiro no cache e, se não encontrar, faz a requisição ao servidor
   */
  getConvenioNome(convenioId?: number): string {
    if (!convenioId) return 'Sem convênio';
    
    // Verificar se está no cache
    const convenioCache = this.conveniosCache.get(convenioId);
    if (convenioCache) {
      return convenioCache.nome;
    }
    
    // Se não estiver no cache, iniciar busca e retornar valor temporário
    this.obterConvenio(convenioId).subscribe();
    return 'Carregando...';
  }
  
  /**
   * Retorna o nome do plano com base no seu ID
   */
  getPlanoNome(planoId?: number): string {
    if (!planoId) return 'Sem plano';
    
    // Verificar se está no cache
    const planoCache = this.planosCache.get(planoId);
    if (planoCache) {
      return planoCache.nome;
    }
    
    // Se não estiver no cache, iniciar busca e retornar valor temporário
    this.obterPlano(planoId).subscribe();
    return 'Carregando...';
  }
  
  /**
   * Tratamento de erros
   */
  private handleError(error: any) {
    let errorMessage = 'Erro desconhecido ao processar a requisição';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    
    console.error('Erro ao acessar API de convênios:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}