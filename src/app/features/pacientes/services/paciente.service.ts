import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Paciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Mock de dados para desenvolvimento
  private pacientesMock: Paciente[] = [
    // Seus dados mockados aqui
  ];

  constructor(private http: HttpClient) {}

  // Buscar pacientes com diferentes critérios
  buscarPacientes(filtro: { tipo: 'cpf' | 'id' | 'nome', valor: string }): Observable<Paciente[]> {
    // Em produção, substituir por chamada real à API
    if (environment.production) {
      return this.http.get<Paciente[]>(`${environment.apiUrl}/pacientes/buscar`, {
        params: { tipo: filtro.tipo, valor: filtro.valor }
      });
    }

    // Versão mockada para desenvolvimento
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
    
    return of(resultados).pipe(delay(500)); // Simular latência de rede
  }

  // Obter um paciente pelo ID
  getPaciente(id: string): Observable<Paciente | null> {
    if (environment.production) {
      return this.http.get<Paciente>(`${environment.apiUrl}/pacientes/${id}`);
    }
    
    // Versão mockada
    const paciente = this.pacientesMock.find(p => p.id === id) || null;
    return of(paciente).pipe(delay(800));
  }

  // Criar um novo paciente
  criarPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Observable<Paciente> {
    if (environment.production) {
      return this.http.post<Paciente>(`${environment.apiUrl}/pacientes`, paciente);
    }
    
    // Versão mockada
    const novoPaciente: Paciente = {
      ...paciente as any,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return of(novoPaciente).pipe(delay(1000));
  }

  // Atualizar um paciente existente
  atualizarPaciente(id: string, paciente: Partial<Paciente>): Observable<Paciente> {
    if (environment.production) {
      return this.http.put<Paciente>(`${environment.apiUrl}/pacientes/${id}`, paciente);
    }
    
    // Versão mockada
    const pacienteAtualizado: Paciente = {
      ...(this.pacientesMock.find(p => p.id === id) as Paciente),
      ...paciente,
      updated_at: new Date().toISOString()
    };
    
    return of(pacienteAtualizado).pipe(delay(1000));
  }
}