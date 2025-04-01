import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Acompanhamento } from '../models/acompanhamento.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcompanhamentoService {
  constructor(private http: HttpClient) {}

  // Criar um novo acompanhamento
  criarAcompanhamento(acompanhamento: Acompanhamento): Observable<Acompanhamento> {
    if (environment.production) {
      return this.http.post<Acompanhamento>(`${environment.apiUrl}/acompanhamentos`, acompanhamento);
    }
    
    // Versão mockada
    return of({
      ...acompanhamento,
      id: Math.random().toString(36).substring(2, 10),
      created_at: new Date().toISOString()
    } as any).pipe(delay(1000));
  }

  // Buscar acompanhamentos de um paciente
  getAcompanhamentosPorPaciente(pacienteId: string): Observable<Acompanhamento[]> {
    if (environment.production) {
      return this.http.get<Acompanhamento[]>(`${environment.apiUrl}/pacientes/${pacienteId}/acompanhamentos`);
    }
    
    // Para desenvolvimento, retornar uma lista vazia
    return of([]).pipe(delay(500));
  }
}