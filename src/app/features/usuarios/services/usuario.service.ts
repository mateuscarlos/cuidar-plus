import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';
import { Usuario, UsuarioAdapter } from '../models/user.model';
import { ResultadoBusca } from '../models/busca-usuario.model';
import { FUNCOES_DETALHES, FuncoesComRegistro } from '../models/conselhos-profissionais.model';

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

    return this.http.get<{ items: Usuario[], total: number }>(`${this.apiUrl}`, { params }).pipe(
      catchError(error => {
        console.error('Erro ao listar usuários:', error);
        return of({ items: [], total: 0 }); // Retorna valores padrão
      })
    );
  }

  obterUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/visualizar/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao obter usuário com ID ${id}:`, error);
        return of({} as Usuario); // Retorna um valor padrão
      })
    );
  }
  
  // Métodos auxiliares para obter nomes de setor e função caso não venham no objeto original
  obterNomeSetor(idSetor: string | number | undefined | null): Observable<string> {
    if (!idSetor) return of('Não informado');
    
    return this.http.get<{id: number, nome: string}>(`${this.baseApiUrl}/setores/dicionario/${idSetor}`).pipe(
      map(setor => setor?.nome || 'Nome não disponível'),
      catchError(erro => {
        console.error(`Erro ao obter nome do setor ${idSetor}:`, erro);
        return of('Nome não disponível');
      })
    );
  }
  
  obterNomeFuncao(idFuncao: string | number | undefined | null): Observable<string> {
    if (!idFuncao) return of('Não informado');
    
    // Verifica primeiro se é uma função mapeada
    const funcaoNumerica = Number(idFuncao);
    if (!isNaN(funcaoNumerica) && funcaoNumerica in FUNCOES_DETALHES) {
      return of(FUNCOES_DETALHES[funcaoNumerica as FuncoesComRegistro].nome);
    }
    
    return this.http.get<{id: number, nome: string, setor_id: number, especializacao_recomendada: string}>(`${this.baseApiUrl}/funcoes/dicionario/${idFuncao}`).pipe(
      map(funcao => funcao?.nome || 'Nome não disponível'),
      catchError(erro => {
        console.error(`Erro ao obter nome da função ${idFuncao}:`, erro);
        return of('Nome não disponível');
      })
    );
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
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario).pipe(
      catchError(error => {
        console.error('Erro ao criar usuário:', error);
        return throwError(() => error);
      })
    );
  }

  atualizarUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  excluirUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao excluir usuário com ID ${id}:`, error);
        return throwError(() => error);
      })
    );
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
