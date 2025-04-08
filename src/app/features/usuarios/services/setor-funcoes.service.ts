import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5001'; // URL base da API

  constructor(private http: HttpClient) {}

  getSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.apiUrl}/setores`);
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

  getFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.apiUrl}/funcoes`);
  }

  getFuncoesPorSetor(setorId: number): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.apiUrl}/funcoes/${setorId}`);
  }

  createFuncao(funcao: Funcao): Observable<Funcao> {
    return this.http.post<Funcao>(`${this.apiUrl}/funcoes`, funcao);
  }

  updateFuncao(id: number, funcao: Funcao): Observable<Funcao> {
    return this.http.put<Funcao>(`${this.apiUrl}/funcoes/${id}`, funcao);
  }

  deleteFuncao(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/funcoes/${id}`);
  }
}
