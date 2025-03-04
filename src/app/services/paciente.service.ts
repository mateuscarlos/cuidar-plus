import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root' // Serviço standalone
})
export class PacienteService {
  private apiUrl = 'http://localhost:8000/pacientes'; // URL da API

  constructor(private http: HttpClient) {}

  // Obter todos os Pacientes
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  // Obter um Paciente por ID
  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  // Criar um novo Paciente
  criarPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  // Atualizar um Paciente existente
  atualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  // Deletar um Paciente
  deletarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}