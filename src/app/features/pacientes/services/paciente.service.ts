import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { DateFormatterService } from '../../../core/services/date-formatter.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  
  private apiUrl = `${environment.apiUrl}/pacientes`;
  
  constructor(
    private http: HttpClient,
    private dateFormatter: DateFormatterService
  ) {}
  
  // Obter paciente por ID
  obterPacientePorId(id: string): Observable<Paciente> {
    console.log(`Buscando paciente com ID: ${id}`);
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`).pipe(
      tap(paciente => console.log('Resposta da API (dados do paciente):', paciente)),
      catchError(this.handleError)
    );
  }
  
  // Buscar pacientes por filtro
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }): Observable<Paciente[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, {
      params: { tipo: filtro.tipo, valor: filtro.valor }
    }).pipe(
      map(pacientes => pacientes.map(p => this.normalizarDadosPaciente(p)))
    );
  }
  
  // Criar um novo paciente
  criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Observable<Paciente> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Paciente>(`${this.apiUrl}/criar`, paciente, { headers });
  }
  
  // Atualizar paciente
  atualizarPaciente(id: string, dadosAtualizados: Partial<Paciente>): Observable<Paciente> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, dadosAtualizados, { headers });
  }

  // Excluir paciente
  excluirPaciente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Listar todos os pacientes
  listarTodosPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}`);
  }

  // Adicionar este método ao serviço
  private normalizarDadosPaciente(paciente: any): Paciente {
    // Criar uma cópia para não modificar os dados originais
    const pacienteNormalizado: Paciente = {...paciente};
    
    // Normalizar o campo nome
    if (!pacienteNormalizado.nome && paciente.nome_completo) {
      pacienteNormalizado.nome = paciente.nome_completo;
    } else if (!pacienteNormalizado.nome && paciente.name) {
      pacienteNormalizado.nome = paciente.name;
    }
    
    // Garantir que outros campos obrigatórios existam
    // Se houver outros campos com nomes inconsistentes, normalizar aqui
    
    return pacienteNormalizado as Paciente;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Ocorreu um erro ao processar a solicitação.'));
  }
}