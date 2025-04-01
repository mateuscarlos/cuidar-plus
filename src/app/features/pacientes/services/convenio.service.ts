import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Convenio, Plano } from '../models/convenio.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {
  // Mock de dados para desenvolvimento
  private conveniosMock: Convenio[] = [
    { id: 1, nome: 'Amil' },
    { id: 2, nome: 'Bradesco Saúde' },
    { id: 3, nome: 'SulAmérica' },
    { id: 4, nome: 'Unimed' }
  ];
  
  private planosMock: Plano[] = [
    { id: 1, nome: 'Básico', convenio_id: 1 },
    { id: 2, nome: 'Intermediário', convenio_id: 1 },
    { id: 3, nome: 'Premium', convenio_id: 1 },
    { id: 4, nome: 'Essencial', convenio_id: 2 },
    { id: 5, nome: 'Exclusivo', convenio_id: 2 },
    { id: 6, nome: 'Total', convenio_id: 3 },
    { id: 7, nome: 'Nacional', convenio_id: 4 }
  ];

  constructor(private http: HttpClient) {}

  // Obter todos os convênios
  getConvenios(): Observable<Convenio[]> {
    if (environment.production) {
      return this.http.get<Convenio[]>(`${environment.apiUrl}/convenios`);
    }
    
    return of(this.conveniosMock).pipe(delay(300));
  }

  // Obter planos de um convênio específico
  getPlanosDoConvenio(convenioId: number): Observable<Plano[]> {
    if (environment.production) {
      return this.http.get<Plano[]>(`${environment.apiUrl}/convenios/${convenioId}/planos`);
    }
    
    const planos = this.planosMock.filter(p => p.convenio_id === convenioId);
    return of(planos).pipe(delay(300));
  }

  // Obter todos os planos
  getTodosPlanos(): Observable<Plano[]> {
    if (environment.production) {
      return this.http.get<Plano[]>(`${environment.apiUrl}/planos`);
    }
    
    return of(this.planosMock).pipe(delay(300));
  }
}