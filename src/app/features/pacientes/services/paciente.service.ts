import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  
  private apiUrl = `${environment.apiUrl}/pacientes`;
  
  constructor(private http: HttpClient) {}
  
  // Obter paciente por ID
  obterPacientePorId(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }
  
  // Buscar pacientes por filtro
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/buscar`, {
      params: { tipo: filtro.tipo, valor: filtro.valor }
    });
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
    
    return this.http.put<Paciente>(`${environment.apiUrl}/pacientes/${id}`, dadosAtualizados, { headers });
  }

  // Excluir paciente
  excluirPaciente(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/pacientes/${id}`);
  }

  // Listar todos os pacientes
  listarTodosPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}`);
  }

  // Buscar convênios
  listarConvenios(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/convenios/listar`);
  }

  // Buscar planos
  listarPlanos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/planos`);
  }

  listarPlanosPorConvenio(convenioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/convenios/${convenioId}/planos`);
  }
}