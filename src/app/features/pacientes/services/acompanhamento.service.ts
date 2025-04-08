import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Acompanhamento } from '../models/acompanhamento.model';
import { environment } from '../../../../environments/environment';
import { ACOMPANHAMENTOS_MOCK } from '../../../core/mocks/acompanhamentos.mock';

@Injectable({
  providedIn: 'root'
})
export class AcompanhamentoService {
  private acompanhamentosMock = [...ACOMPANHAMENTOS_MOCK];
  
  constructor(private http: HttpClient) {}

  // Criar um novo acompanhamento
  criarAcompanhamento(acompanhamento: Acompanhamento): Observable<Acompanhamento> {
    if (environment.production) {
      return this.http.post<Acompanhamento>(`/acompanhamentos`, acompanhamento);
    }
    
    const novoAcompanhamento = {
      ...acompanhamento,
      id: `acomp-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    };
    
    this.acompanhamentosMock.push(novoAcompanhamento as any);
    return of(novoAcompanhamento as any).pipe(delay(800));
  }
  
  // Obter acompanhamentos de um paciente
  obterAcompanhamentosPorPaciente(pacienteId: string | number): Observable<Acompanhamento[]> {
    if (environment.production) {
      return this.http.get<Acompanhamento[]>(`/acompanhamentos/paciente/${pacienteId}`);
    }
    
    const acompanhamentos = this.acompanhamentosMock
      .filter(a => a.paciente_id === Number(pacienteId))
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      
    return of(acompanhamentos).pipe(delay(500));
  }
  
  // Obter um acompanhamento específico
  obterAcompanhamento(id: string): Observable<Acompanhamento> {
    if (environment.production) {
      return this.http.get<Acompanhamento>(`/acompanhamentos/${id}`);
    }
    
    const acompanhamento = this.acompanhamentosMock.find(a => a.id === id);
    return of(acompanhamento as Acompanhamento).pipe(delay(300));
  }
}