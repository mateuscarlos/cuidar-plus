import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';
import { Usuario } from '../models/user.model';
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

export interface ResultadoPaginado<T> {
  items: T[];
  total: number;
  page?: number;
  totalPages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseApiUrl = environment.apiUrl;
  private apiUrl = `${this.baseApiUrl}/usuarios`;
  
  constructor(private http: HttpClient) { }
  
  // MÉTODOS DE CONSULTA
  
  /**
   * Lista usuários com paginação
   */
  listarUsuarios(pagina: number = 1, tamanhoPagina: number = 10): Observable<ResultadoPaginado<Usuario>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanhoPagina.toString());

    return this.http.get<ResultadoPaginado<Usuario>>(`${this.apiUrl}`, { params })
      .pipe(catchError(this.handleError<ResultadoPaginado<Usuario>>('listarUsuarios', { items: [], total: 0 })));
  }

  /**
   * Obtém detalhes de um usuário específico
   */
  obterUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/visualizar/${id}`)
      .pipe(catchError(this.handleError<Usuario>(`obterUsuarioPorId(${id})`)));
  }
  
  /**
   * Lista todos os usuários sem paginação
   */
  listarTodosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/lista`)
      .pipe(
        tap(response => console.log('Resposta da API (listar todos):', response)),
        catchError(this.handleError<Usuario[]>('listarTodosUsuarios', []))
      );
  }

  /**
   * Busca usuários com filtros avançados
   */
  buscarUsuarios(filtros: any): Observable<ResultadoPaginado<Usuario>> {
    // Construir parâmetros da URL com base nos filtros
    let params = new HttpParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    
    console.log('Enviando parâmetros de busca de usuários:', params.toString());
    
    // Tentar o endpoint de busca avançada primeiro
    return this.http.get<any>(`${this.apiUrl}/busca-avancada`, { params })
      .pipe(
        tap(response => console.log('Resposta da API de busca avançada:', response)),
        catchError(error => {
          if (error.status === 404) {
            console.warn('Endpoint de busca avançada não encontrado, tentando endpoint de busca simples');
            
            // Fallback para busca simples
            return this.realizarBuscaSimples(filtros);
          }
          return throwError(() => error);
        }),
        map(this.normalizarResultadoBusca)
      );
  }
  
  // MÉTODOS DE OPERAÇÕES CRUD
  
  /**
   * Cria um novo usuário
   */
  criarUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('Enviando para API (criação):', JSON.stringify(usuario));
    return this.http.post<Usuario>(`${this.apiUrl}/criar`, usuario)
      .pipe(catchError(this.handleError<Usuario>('criarUsuario')));
  }

  /**
   * Atualiza dados de um usuário
   */
  atualizarUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    console.log('Enviando para API (atualização):', JSON.stringify(usuario));
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario)
      .pipe(catchError(this.handleError<Usuario>(`atualizarUsuario(${id})`)));
  }

  /**
   * Exclui um usuário
   */
  excluirUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<any>(`excluirUsuario(${id})`)));
  }
  
  /**
   * Altera o status de um usuário (ativo/inativo)
   */
  alterarStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(catchError(this.handleError<any>(`alterarStatus(${id}, ${status})`)));
  }
  
  /**
   * Alias para alterarStatus para compatibilidade com código existente
   */
  ativarDesativar(id: string, ativo: boolean): Observable<Usuario> {
    const status = ativo ? 'ativo' : 'inativo';
    return this.alterarStatus(id, status);
  }
  
  // DADOS COMPLEMENTARES
  
  /**
   * Lista setores disponíveis
   */
  listarSetores(): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.baseApiUrl}/setores`)
      .pipe(catchError(this.handleError<Setor[]>('listarSetores', [])));
  }

  /**
   * Lista todas as funções
   */
  listarFuncoes(): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes`)
      .pipe(catchError(this.handleError<Funcao[]>('listarFuncoes', [])));
  }
  
  /**
   * Lista funções por setor
   */
  listarFuncoesPorSetor(setorId: number): Observable<Funcao[]> {
    return this.http.get<Funcao[]>(`${this.baseApiUrl}/funcoes/${setorId}`)
      .pipe(catchError(this.handleError<Funcao[]>(`listarFuncoesPorSetor(${setorId})`, [])));
  }
  
  /**
   * Obtém nome do setor a partir do ID
   */
  obterNomeSetor(idSetor: string | number | undefined | null): Observable<string> {
    if (!idSetor) return of('Não informado');
    
    return this.http.get<{id: number, nome: string}>(`${this.baseApiUrl}/setores/dicionario/${idSetor}`).pipe(
      map(setor => setor?.nome || 'Nome não disponível'),
      catchError(() => of('Nome não disponível'))
    );
  }
  
  /**
   * Obtém nome da função a partir do ID
   */
  obterNomeFuncao(idFuncao: string | number | undefined | null): Observable<string> {
    if (!idFuncao) return of('Não informado');
    
    // Verifica primeiro se é uma função mapeada
    const funcaoNumerica = Number(idFuncao);
    if (!isNaN(funcaoNumerica) && funcaoNumerica in FUNCOES_DETALHES) {
      return of(FUNCOES_DETALHES[funcaoNumerica as FuncoesComRegistro].nome);
    }
    
    return this.http.get<{id: number, nome: string, setor_id: number, especializacao_recomendada: string}>(`${this.baseApiUrl}/funcoes/dicionario/${idFuncao}`).pipe(
      map(funcao => funcao?.nome || 'Nome não disponível'),
      catchError(() => of('Nome não disponível'))
    );
  }
  
  // MÉTODOS PRIVADOS
  
  /**
   * Realiza busca simples como fallback
   */
  private realizarBuscaSimples(filtros: any): Observable<any> {
    let tipo = '';
    let valor = '';
    
    if (filtros.nome) {
      tipo = 'nome';
      valor = filtros.nome;
    } else if (filtros.email) {
      tipo = 'email';
      valor = filtros.email;
    } else if (filtros.cpf) {
      tipo = 'cpf';
      valor = filtros.cpf;
    } else if (filtros.id) {
      tipo = 'id';
      valor = filtros.id;
    }
    
    if (tipo && valor) {
      return this.http.get<any>(`${this.apiUrl}/busca`, { 
        params: new HttpParams().append('tipo', tipo).append('valor', valor) 
      });
    }
    
    return of({ items: [], total: 0 });
  }
  
  /**
   * Normaliza resultados de busca em formato padrão
   */
  private normalizarResultadoBusca(response: any): ResultadoPaginado<Usuario> {
    // Se a API retornar um objeto com a estrutura {items, total, page, total_pages}
    if (response && response.items) {
      return {
        items: response.items,
        total: response.total,
        page: response.page,
        totalPages: response.total_pages
      };
    }
    
    // Se a API retornar apenas um array de itens
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        page: 1,
        totalPages: 1
      };
    }
    
    // Padrão para outras estruturas
    return response;
  }
  
  /**
   * Tratamento centralizado de erros HTTP
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);
      
      // Se for necessário notificar o usuário sobre o erro:
      // this.notificationService.showError(`Erro ao ${operation}: ${error.error.message || 'Erro desconhecido'}`);
      
      // Retorna um resultado seguro para a aplicação continuar
      return of(result as T);
    };
  }
}