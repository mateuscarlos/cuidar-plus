import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Setor {
  id: number;
  nome: string;
}

export interface Funcao {
  id: number;
  nome: string;
  setor_id: number;
  conselho_profissional?: string;
  especializacao_recomendada?: string;
  tipo_contratacao: string;
}

@Injectable({
  providedIn: 'root',
})
export class SetoresFuncoesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.apiUrl}/setores`).pipe(
      catchError(error => {
        console.error('Erro ao buscar setores:', error);
        return of([]);
      })
    );
  }

  createSetor(setor: Setor): Observable<Setor> {
    return this.http.post<Setor>(`${this.apiUrl}/setores`, setor);
  }

  updateSetor(id: number, setor: Setor): Observable<Setor> {
    return this.http.put<Setor>(`${this.apiUrl}/setores/${id}`, setor);
  }

  deleteSetor(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/setores/${id}`);
  }

  getSetorPorId(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/setores/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Erro ao buscar setor ${id}:`, error);
          return of({ nome: 'Não disponível' });
        })
      );
  }

  // Método para obter o dicionário de setores
  getSetoresDicionario(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.apiUrl}/setores/dicionario`).pipe(
      catchError(error => {
        console.error('Erro ao buscar dicionário de setores:', error);
        return of({});
      })
    );
  }

  getFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.apiUrl}/funcoes`);
  }

  getFuncoesPorSetor(setorId: number): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.apiUrl}/funcoes/${setorId}`);
  }

  createFuncao(funcao: Funcao): Observable<Funcao> {
    return this.http.post<Funcao>(`${this.apiUrl}/create-funcoes`, funcao);
  }

  updateFuncao(id: number, funcao: Funcao): Observable<Funcao> {
    return this.http.put<Funcao>(`${this.apiUrl}/funcoes/${id}`, funcao);
  }

  deleteFuncao(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/funcoes/${id}`);
  }

  getFuncaoPorId(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/funcoes/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Erro ao buscar função ${id}:`, error);
          return of({ nome: 'Não disponível' });
        })
      );
  }

  // Método para obter o dicionário de funções
  getFuncoesDicionario(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.apiUrl}/funcoes/dicionario`)
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar dicionário de funções:', error);
          return of({});
        })
      );
  }
}
