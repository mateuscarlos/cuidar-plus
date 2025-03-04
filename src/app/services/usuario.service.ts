import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  nome: string;
  cpf: string;
  endereco: string;
  setor: string;
  funcao: string;
  especialidade?: string;
  registro_categoria?: string;
}

@Injectable({
  providedIn: 'root' // Serviço standalone
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5001/usuarios'; // URL da API

  constructor(private http: HttpClient) {}

  // Obter todos os usuários
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obter um usuário por ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Criar um novo usuário
  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Atualizar um usuário existente
  atualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // Deletar um usuário
  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cpf}`);
  }
}