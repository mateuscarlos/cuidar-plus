import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: number;
  complemento: string;
  operadora: string;
  cid_primario: string;
}

@Injectable({
  providedIn: 'root' // Serviço standalone
})
export class PacienteService {
  private apiUrl = 'http://localhost:5001/api/'; // Endpoint correto

  constructor(private http: HttpClient) {}

  // Obter todos os Pacientes
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/exibe_pacientes`);
  }

  // Criar um novo Paciente
  criarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/criar_paciente`, paciente);
  }

  // Atualizar um Paciente existente
  atualizarPaciente(cpf: string, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/atualizar_paciente/${cpf}`, paciente);
  }

  // Deletar um Paciente
  deletarPaciente(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir_paciente/${cpf}`);
  }
}