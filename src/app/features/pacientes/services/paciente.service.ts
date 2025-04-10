import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
      catchError(this.handleError)
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
      catchError(this.handleError)
    );
  }

  /**
   * Realiza a busca de pacientes com base nos critérios fornecidos
   */
  buscarPacientes(criterios: ResultadoBusca): Observable<Paciente[]> {
    // Corresponde a: @pacientes_routes.route('/pacientes/buscar', methods=['GET'])
    let params = new HttpParams();
    
    // Adaptar para o formato esperado pelo backend (tipo e valor)
    if (criterios.nome) {
      params = params.append('tipo', 'nome');
      params = params.append('valor', criterios.nome);
    } else if (criterios.cpf) {
      params = params.append('tipo', 'cpf');
      params = params.append('valor', criterios.cpf);
    } else if (criterios.id) {
      params = params.append('tipo', 'id');
      params = params.append('valor', criterios.id.toString());
    }

    return this.http.get<Paciente[]>(`${this.apiUrl}/buscar`, { params }).pipe(
      retry(1),
      map(pacientes => this.normalizarPacientes(pacientes)),
      catchError(this.handleError)
    );
  }

  /**
   * Cria um novo paciente
   */
  criarPaciente(paciente: Paciente): Observable<Paciente> {
    // Corresponde a: @pacientes_routes.route('/pacientes/criar', methods=['POST'])
    console.log('PacienteService - Payload:', paciente);
    
    return this.http.post<Paciente>(`${this.apiUrl}/criar`, paciente)
      .pipe(
        tap(response => console.log('Paciente criado:', response)),
        catchError(this.handleError)
      );
  }

  /**
   * Atualiza dados de um paciente existente
   */
  atualizarPaciente(id: string | number, paciente: Paciente): Observable<Paciente> {
    // Corresponde a: @pacientes_routes.route('/pacientes/atualizar/<int:id>', methods=['PUT'])
    const url = `${this.apiUrl}/atualizar/${id}`;
    return this.http.put<Paciente>(url, paciente).pipe(
      map(paciente => this.normalizarPaciente(paciente)),
      catchError(this.handleError)
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
      catchError(this.handleError)
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