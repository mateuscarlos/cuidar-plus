import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Paciente, ResultadoBusca, StatusPaciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiUrl}/pacientes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém todos os pacientes cadastrados
   */
  listarTodosPacientes(): Observable<Paciente[]> {
    // Corresponde a: @pacientes_routes.route('/pacientes', methods=['GET'])
    return this.http.get<Paciente[]>(this.apiUrl).pipe(
      retry(1),
      map(pacientes => this.normalizarPacientes(pacientes)),
      catchError(error => {
        console.error('Erro ao listar pacientes:', error);
        return of([]); // Retorna uma lista vazia
      })
    );
  }

  /**
   * Obtém um paciente específico pelo ID
   */
  obterPacientePorId(id: string | number): Observable<Paciente | null> {
    // Corresponde a: @pacientes_routes.route('/pacientes/buscar/<int:id>', methods=['GET'])
    const url = `${this.apiUrl}/buscar/${id}`;
    return this.http.get<Paciente>(url).pipe(
      retry(1),
      map(paciente => this.normalizarPaciente(paciente)),
      catchError(error => {
        console.error(`Erro ao obter paciente com ID ${id}:`, error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  /**
   * Busca pacientes com filtros avançados
   * @param filtros Objeto com os filtros a serem aplicados
   * @returns Observable de lista de pacientes
   */
  buscarPacientes(filtros: any): Observable<any> {
    // Construir parâmetros da URL com base nos filtros
    let params = new HttpParams();
    
    // Adicionar os filtros como parâmetros se tiverem valores
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    
    // Log para debug
    console.log('Enviando parâmetros de busca:', params.toString());
    
    // Verificar qual endpoint usar - tentar primeiro busca avançada, com fallback para busca simples
    return this.http.get<any>(`${this.apiUrl}/busca-avancada`, { params })
      .pipe(
        tap(response => console.log('Resposta bruta da API:', response)),
        catchError(error => {
          if (error.status === 404) {
            console.warn('Endpoint de busca avançada não encontrado, tentando endpoint de busca simples');
            
            // Fallback: usar o endpoint de busca simples se o avançado não existir
            // Simplificar para buscar apenas por um critério principal (nome ou cpf ou id)
            let tipo = 'nome';
            let valor = '';
            
            if (filtros.cpf) {
              tipo = 'cpf';
              valor = filtros.cpf;
            } else if (filtros.id) {
              tipo = 'id';
              valor = filtros.id;
            } else if (filtros.nome) {
              tipo = 'nome';
              valor = filtros.nome;
            }
            
            if (valor) {
              return this.http.get<any>(`${this.apiUrl}/buscar`, { 
                params: new HttpParams().append('tipo', tipo).append('valor', valor) 
              });
            }
            
            // Se não houver critério válido, retornar array vazio
            return of([]);
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Cria um novo paciente
   */
  criarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/criar`, paciente).pipe(
      tap(response => console.log('Paciente criado:', response)),
      catchError(error => {
        console.error('Erro ao criar paciente:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Atualiza dados de um paciente existente
   */
  atualizarPaciente(id: string | number, paciente: Paciente): Observable<Paciente> {
    const url = `${this.apiUrl}/atualizar/${id}`;
    return this.http.put<Paciente>(url, paciente).pipe(
      map(paciente => this.normalizarPaciente(paciente)),
      catchError(error => {
        console.error(`Erro ao atualizar paciente com ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Remove um paciente pelo ID
   */
  excluirPaciente(id: string | number): Observable<any> {
    // Corresponde a: @pacientes_routes.route('/pacientes/delete/<int:id>', methods=['DELETE'])
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url).pipe(
      retry(1),
      catchError(error => {
        console.error(`Erro ao excluir paciente com ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Normaliza um único paciente para garantir compatibilidade com a UI
   */
  private normalizarPaciente(paciente: any): Paciente {
    if (!paciente) return {} as Paciente;
    
    // Garantir que nome_completo e nome estejam preenchidos (alguns endpoints podem retornar apenas um deles)
    if (paciente.nome_completo && !paciente.nome) {
      paciente.nome = paciente.nome_completo;
    } else if (paciente.nome && !paciente.nome_completo) {
      paciente.nome_completo = paciente.nome;
    }

    // Garantir que o endereço seja um objeto (API pode retornar string ou objeto)
    if (paciente.endereco && typeof paciente.endereco === 'string') {
      try {
        paciente.endereco = JSON.parse(paciente.endereco);
      } catch (e) {
        console.error('Erro ao processar endereço do paciente', e);
        paciente.endereco = {};
      }
    } else if (!paciente.endereco) {
      paciente.endereco = {};
    }

    // Garantir que as datas estejam em formato consistente
    // (A API pode retornar datas em diferentes formatos)
    
    return paciente;
  }

  /**
   * Normaliza um array de pacientes
   */
  private normalizarPacientes(pacientes: any[]): Paciente[] {
    if (!pacientes || !Array.isArray(pacientes)) return [];
    return pacientes.map(p => this.normalizarPaciente(p));
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido ao processar a solicitação';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente (rede, etc)
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      if (error.status === 0) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua conexão de internet.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 401) {
        errorMessage = 'Você não está autorizado a realizar esta operação. Por favor, faça login novamente.';
      } else if (error.status === 403) {
        errorMessage = 'Você não tem permissão para realizar esta operação.';
      } else if (error.status === 422 || error.status === 400) {
        // Erros de validação ou bad request
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        } else {
          errorMessage = 'Dados inválidos. Por favor, verifique os campos preenchidos.';
        }
      } else {
        errorMessage = `Erro ${error.status}: ${error.message || 'Erro desconhecido'}`;
      }
    }
    
    console.error('Erro na requisição:', error);
    return throwError(() => new Error(errorMessage));
  }
}