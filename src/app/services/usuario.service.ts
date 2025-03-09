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
    return this.http.get<{ usuarios: any[] }>(`${this.apiUrl}/exibe_usuarios`).pipe(
      map(response => response.usuarios.map(usuario => ({
        ...usuario,
        registroCategoria: usuario.registro_categoria // Ajuste para o campo registroCategoria
      })))
    );
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    const payload = {
      ...usuario,
      registro_categoria: usuario.registroCategoria // Ajuste para o campo registroCategoria
    };
    return this.http.post<Usuario>(`${this.apiUrl}/criar_usuario`, payload);
  }

  atualizarUsuario(cpf: string, usuario: Usuario): Observable<Usuario> {
    const payload = {
      ...usuario,
      registro_categoria: usuario.registroCategoria // Ajuste para o campo registroCategoria
    };
    return this.http.put<Usuario>(`${this.apiUrl}/atualizar_usuario/${cpf}`, payload);
  }

  deletarUsuario(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir_usuario/${cpf}`);
  }
}