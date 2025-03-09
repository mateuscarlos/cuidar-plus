import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Usuario {
  nome: string;
  cpf: string;
  endereco: string;
  setor: string;
  funcao: string;
  especialidade?: string;
  registroCategoria?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<{ usuarios: Usuario[] }>(`${this.apiUrl}/exibe_usuarios`).pipe(
      map(response => response.usuarios)
    );
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/criar_usuario`, usuario);
  }

  atualizarUsuario(cpf: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/atualizar_usuario/${cpf}`, usuario);
  }

  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir_usuario/${cpf}`);
  }
}