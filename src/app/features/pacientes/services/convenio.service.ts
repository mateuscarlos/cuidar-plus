import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Convenio, Plano } from '../models/convenio.model';
import { environment } from '../../../../environments/environment';
import { CONVENIOS_MOCK, PLANOS_MOCK } from '../../../core/mocks/convenios.mock';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {
  // Usando os mocks centralizados
  private conveniosMock = CONVENIOS_MOCK;
  private planosMock = PLANOS_MOCK;

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