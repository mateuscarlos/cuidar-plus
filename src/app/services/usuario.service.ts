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
  registroCategoria?: string; // Atualizado para incluir registroCategoria
}

@Injectable({
  providedIn: 'root', // Serviço standalone
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5001/api'; // URL base da API

  constructor(private http: HttpClient) {}

  // Obter todos os usuários
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/exibe_usuarios`);
  }

  // Criar um novo usuário
  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/criar_usuario`, usuario);
  }

  // Atualizar um usuário existente
  atualizarUsuario(cpf: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/atualizar_usuario/${cpf}`, usuario);
  }

  // Deletar um usuário
  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir_usuario/${cpf}`);
  }
}