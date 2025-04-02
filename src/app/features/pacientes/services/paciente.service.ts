import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';
import { PACIENTES_MOCK } from '../../../core/mocks/pacientes.mock';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Usando os mocks centralizados
  private pacientesMock = [...PACIENTES_MOCK]; // Criar uma cópia para evitar mutações

  constructor(private http: HttpClient) {}

  // Buscar pacientes com diferentes critérios
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }): Observable<Paciente[]> {
    if (environment.production) {
      return this.http.get<Paciente[]>(`${environment.apiUrl}/pacientes/buscar`, {
        params: { tipo: filtro.tipo, valor: filtro.valor }
      });
    }

    let resultados: Paciente[] = [];
    
    if (filtro.tipo === 'cpf') {
      resultados = this.pacientesMock.filter(p => p.cpf.includes(filtro.valor));
    } else if (filtro.tipo === 'id') {
      resultados = this.pacientesMock.filter(p => p.id.includes(filtro.valor));
    } else if (filtro.tipo === 'nome') {
      resultados = this.pacientesMock.filter(p => 
        p.nome_completo.toLowerCase().includes(filtro.valor.toLowerCase())
      );
    }
    
    return of(resultados).pipe(delay(500));
  }

  // Obter um paciente pelo ID
  getPaciente(id: string): Observable<Paciente | null> {
    if (environment.production) {
      return this.http.get<Paciente>(`${environment.apiUrl}/pacientes/${id}`);
    }
    
    const paciente = this.pacientesMock.find(p => p.id === id) || null;
    return of(paciente).pipe(delay(500));
  }

  // Criar um novo paciente
  criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Observable<Paciente> {
    if (environment.production) {
      return this.http.post<Paciente>(`${environment.apiUrl}/pacientes`, paciente);
    }
    
    const novoPaciente: Paciente = {
      ...paciente as any,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Adicionar ao mock local
    this.pacientesMock.push(novoPaciente);
    
    return of(novoPaciente).pipe(delay(800));
  }

  // Atualizar um paciente existente
  atualizarPaciente(id: string, paciente: Partial<Paciente>): Observable<Paciente> {
    if (environment.production) {
      return this.http.put<Paciente>(`${environment.apiUrl}/pacientes/${id}`, paciente);
    }
    
    // Encontrar o índice do paciente no array
    const index = this.pacientesMock.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const pacienteAtualizado: Paciente = {
        ...this.pacientesMock[index],
        ...paciente,
        updated_at: new Date().toISOString()
      };
      
      // Atualizar o mock local
      this.pacientesMock[index] = pacienteAtualizado;
      
      return of(pacienteAtualizado).pipe(delay(800));
    }
    
    return of(null as any).pipe(delay(800));
  }
}