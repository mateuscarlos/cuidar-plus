import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Usuario } from '../models/user.model';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';

@Injectable({
  providedIn: 'root'
})
export class ApiUsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseApiUrl = environment.apiUrl;
  private readonly apiUrl = `${this.baseApiUrl}/usuarios`; // Ajustado para refletir a rota do backend

  // Métodos de usuários
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  obterUsuarioPorId(id: string | number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    const usuarioNormalizado = this.normalizarTipoContratacao(usuario);
    return this.http.post<Usuario>(`${this.apiUrl}/criar`, usuarioNormalizado);
  }

  atualizarUsuario(id: string | number, usuario: Usuario): Observable<Usuario> {
    const usuarioNormalizado = this.normalizarTipoContratacao(usuario);
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuarioNormalizado);
  }

  excluirUsuario(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  alterarStatusUsuario(id: string | number, ativo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/status`, { ativo });
  }

  // Métodos de setores
  listarSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.baseApiUrl}/setores`);
  }

  obterSetorPorId(id: string | number): Observable<Setor> {
    return this.http.get<Setor>(`${this.baseApiUrl}/setores/${id}`);
  }

  criarSetor(setor: Setor): Observable<Setor> {
    return this.http.post<Setor>(`${this.baseApiUrl}/setores`, setor);
  }

  atualizarSetor(id: number, setor: Setor): Observable<Setor> {
    return this.http.put<Setor>(`${this.baseApiUrl}/setores/${id}`, setor);
  }

  excluirSetor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/setores/${id}`);
  }

  obterSetoresDicionario(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.baseApiUrl}/setores/dicionario`);
  }

  // Métodos de funções
  listarFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes`);
  }

  listarFuncoesPorSetor(setorId: number): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes/${setorId}`);
  }

  obterFuncaoPorId(id: string | number): Observable<Funcao> {
    return this.http.get<Funcao>(`${this.baseApiUrl}/funcoes/${id}`);
  }

  criarFuncao(funcao: Funcao): Observable<Funcao> {
    return this.http.post<Funcao>(`${this.baseApiUrl}/funcoes`, funcao);
  }

  atualizarFuncao(id: number, funcao: Funcao): Observable<Funcao> {
    return this.http.put<Funcao>(`${this.baseApiUrl}/funcoes/${id}`, funcao);
  }

  excluirFuncao(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/funcoes/${id}`);
  }

  obterFuncoesDicionario(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.baseApiUrl}/funcoes/dicionario`);
  }

  // Métodos de utilidade
  private normalizarTipoContratacao(usuario: Usuario): Usuario {
    const clone = { ...usuario };
    const tipoContratacaoMap: Record<string, string> = {
      'Contratada': 'c',
      'contratada': 'c',
      'Terceirizada': 't',
      'terceirizada': 't',
      'Pessoa Jurídica': 'p',
      'pj': 'p'
    };

    if (clone.tipoContratacao && tipoContratacaoMap[clone.tipoContratacao]) {
      clone.tipoContratacao = tipoContratacaoMap[clone.tipoContratacao];
    }

    return clone;
  }
}