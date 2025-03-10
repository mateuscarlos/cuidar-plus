import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id: number;
  nome_completo: string;
  cpf: string;
  operadora: string;
  identificador_prestadora: string;
  acomodacao: string;
  telefone: string;
  alergias: string;
  cid_primario: string;
  cid_secundario: string;
  data_nascimento: string;
  rua: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  created_at: string;
  updated_at: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<{ pacientes: Paciente[] }> {
    return this.http.get<{ pacientes: Paciente[] }>(`${this.apiUrl}/exibe_pacientes`);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/paciente/${id}`);
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

  adicionarAcompanhamento(acompanhamento: { pacienteId: number, descricao: string, data: Date }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/adicionar_acompanhamento`, acompanhamento);
  }

  buscarPaciente(campo: string, valor: string): Observable<Paciente> {
    const params = new HttpParams().set('campo', campo).set('valor', valor);
    return this.http.get<Paciente>(`${this.apiUrl}/buscar_paciente`, { params });
  }

  buscarEndereco(cep: string): Observable<any> {
    return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}