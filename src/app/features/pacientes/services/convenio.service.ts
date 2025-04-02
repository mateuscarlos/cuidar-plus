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
  private conveniosMock = [...CONVENIOS_MOCK];
  private planosMock = [...PLANOS_MOCK];
  
  constructor(private http: HttpClient) {}
  
  // Obter todos os convênios
  obterConvenios(): Observable<Convenio[]> {
    if (environment.production) {
      return this.http.get<Convenio[]>(`/convenios`);
    }
    
    return of(this.conveniosMock).pipe(delay(300));
  }
  
  // Obter planos por convênio
  obterPlanosPorConvenio(convenioId: number): Observable<Plano[]> {
    if (environment.production) {
      return this.http.get<Plano[]>(`/convenios/${convenioId}/planos`);
    }
    
    const planos = this.planosMock.filter(p => p.convenio_id === convenioId);
    return of(planos).pipe(delay(300));
  }
  
  // Obter detalhes de um convênio
  obterConvenio(id: number): Observable<Convenio> {
    if (environment.production) {
      return this.http.get<Convenio>(`/convenios/${id}`);
    }
    
    const convenio = this.conveniosMock.find(c => c.id === id);
    return of(convenio as Convenio).pipe(delay(200));
  }
  
  // Obter detalhes de um plano
  obterPlano(id: number): Observable<Plano> {
    if (environment.production) {
      return this.http.get<Plano>(`/planos/${id}`);
    }
    
    const plano = this.planosMock.find(p => p.id === id);
    return of(plano as Plano).pipe(delay(200));
  }
}