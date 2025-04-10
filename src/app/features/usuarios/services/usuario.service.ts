import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';
import { Usuario } from '../models/user.model';
import { ResultadoBusca } from '../models/busca-usuario.model';

export interface Endereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  estado?: string;
  uf?: string;
  cep?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseApiUrl = environment.apiUrl;
  private apiUrl = `${this.baseApiUrl}/usuarios`;
  
  constructor(private http: HttpClient) { }
    
  listarUsuarios(pagina: number = 1, tamanhoPagina: number = 10): Observable<{ items: Usuario[], total: number }> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanhoPagina.toString());

    return this.http.get<{ items: Usuario[], total: number }>(`${this.apiUrl}`, { params });
  }

  obterUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  buscarUsuarios(params: ResultadoBusca): Observable<Usuario[]> {
    let httpParams = new HttpParams();
    
    // Adicionar parâmetros de busca
    Object.keys(params).forEach(key => {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<Usuario[]>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  atualizarUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  excluirUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  alterarStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  listarSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.baseApiUrl}/setores`);
  }

  listarFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes`);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: string, usuario: Usuario): Observable<any> {
    console.log('Enviando para API (atualização):', JSON.stringify(usuario)); // Adicione este log
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  ativarDesativar(id: string, ativo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/status`, { ativo });
  }
}
