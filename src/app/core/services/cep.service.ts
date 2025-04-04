import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly BASE_URL = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  consultarCep(cep: string): Observable<CepResponse | null> {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    
    if (!cep || cep.length !== 8) {
      return of(null);
    }

    return this.http.get<CepResponse>(`${this.BASE_URL}/${cep}/json`).pipe(
      map(response => response.erro ? null : response),
      catchError(() => of(null))
    );
  }
}