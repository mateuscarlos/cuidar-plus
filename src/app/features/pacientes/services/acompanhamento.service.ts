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
  // Usando os mocks centralizados
  private acompanhamentosMock = ACOMPANHAMENTOS_MOCK;

  constructor(private http: HttpClient) {}

  // Criar um novo acompanhamento
  criarAcompanhamento(acompanhamento: Acompanhamento): Observable<Acompanhamento> {
    if (environment.production) {
      return this.http.post<Acompanhamento>(`${environment.apiUrl}/acompanhamentos`, acompanhamento);
    }
    
    const novoAcompanhamento = {
      ...acompanhamento,
      id: `acomp-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    };
    
    // Adicionar ao mock local
    this.acompanhamentosMock.push(novoAcompanhamento as any);
    
    return of(novoAcompanhamento as any).pipe(delay(800));
  }

  // Buscar acompanhamentos de um paciente
  getAcompanhamentosPorPaciente(pacienteId: string): Observable<Acompanhamento[]> {
    if (environment.production) {
      return this.http.get<Acompanhamento[]>(`${environment.apiUrl}/pacientes/${pacienteId}/acompanhamentos`);
    }
    
    const acompanhamentos = this.acompanhamentosMock.filter(a => 
      a.paciente_id.toString() === pacienteId
    );
    return of(acompanhamentos).pipe(delay(500));
  }

  // Obter um acompanhamento específico
  getAcompanhamento(id: string): Observable<Acompanhamento | null> {
    if (environment.production) {
      return this.http.get<Acompanhamento>(`${environment.apiUrl}/acompanhamentos/${id}`);
    }
    
    const acompanhamento = this.acompanhamentosMock.find(a => a.id === id) || null;
    return of(acompanhamento).pipe(delay(500));
  }
}