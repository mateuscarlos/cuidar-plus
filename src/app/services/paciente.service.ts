import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  cidade: string;
  estado: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<{ pacientes: Paciente[] }>(`${this.apiUrl}/exibe_pacientes`).pipe(
      map(response => response.pacientes)
    );
  }

  criarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/criar_paciente`, paciente);
  }

  atualizarPaciente(cpf: string, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/atualizar_paciente/${cpf}`, paciente);
  }

  deletarPaciente(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/excluir_paciente/${cpf}`);
  }

  buscarEndereco(cep: string): Observable<any> {
    return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}