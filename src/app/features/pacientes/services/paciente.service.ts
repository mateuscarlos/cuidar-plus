import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';
import { PACIENTES_MOCK } from '../../../core/mocks/pacientes.mock';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private pacientesMock = [...PACIENTES_MOCK];
  
  constructor(private http: HttpClient) {}
  
  // Obter paciente por ID
  obterPacientePorId(id: string): Observable<Paciente> {
    if (environment.production) {
      return this.http.get<Paciente>(`/pacientes/${id}`);
    }
    
    // Versão mock para desenvolvimento
    const paciente = this.pacientesMock.find(p => p.id === id);
    return of(paciente as Paciente).pipe(delay(300));
  }
  
  // Buscar pacientes por filtro
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }): Observable<Paciente[]> {
    if (environment.production) {
      return this.http.get<Paciente[]>(`/pacientes/buscar`, {
        params: { tipo: filtro.tipo, valor: filtro.valor }
      });
    }
    
    // Versão mock para desenvolvimento
    let resultados: Paciente[] = [];
    
    if (filtro.tipo === 'nome') {
      resultados = this.pacientesMock.filter(p => 
        p.nome_completo.toLowerCase().includes(filtro.valor.toLowerCase()));
    } else if (filtro.tipo === 'cpf') {
      resultados = this.pacientesMock.filter(p => 
        p.cpf.includes(filtro.valor));
    } else if (filtro.tipo === 'id') {
      resultados = this.pacientesMock.filter(p => 
        p.id.includes(filtro.valor));
    }
    
    return of(resultados).pipe(delay(300));
  }
  
  // Criar um novo paciente
  criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Observable<Paciente> {
    if (environment.production) {
      return this.http.post<Paciente>(`/pacientes`, paciente);
    }
    
    const novoPaciente: Paciente = {
      ...paciente as any,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.pacientesMock.push(novoPaciente);
    return of(novoPaciente).pipe(delay(800));
  }
  
  // Atualizar paciente
  atualizarPaciente(id: string, dadosAtualizados: Partial<Paciente>): Observable<Paciente> {
    if (environment.production) {
      return this.http.put<Paciente>(`/pacientes/${id}`, dadosAtualizados);
    }
    
    const index = this.pacientesMock.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pacientesMock[index] = {
        ...this.pacientesMock[index],
        ...dadosAtualizados,
        updated_at: new Date().toISOString()
      };
      return of(this.pacientesMock[index]).pipe(delay(500));
    }
    
    return of(null as any);
  }
}