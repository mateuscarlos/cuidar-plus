import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface EnderecoViaCep {
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
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly API_URL = 'http://localhost:5001/api/cep';

  constructor(private http: HttpClient) { }

  /**
   * Consulta um CEP na API ViaCEP
   * @param cep CEP a ser consultado (apenas números)
   * @returns Observable com dados do endereço ou null em caso de erro
   */
  consultarCep(cep: string): Observable<EnderecoViaCep | null> {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    
    // Verifica se o CEP tem o formato válido
    if (cep.length !== 8) {
      return of(null);
    }
    
    return this.http.get<EnderecoViaCep>(`${this.API_URL}/${cep}`);
  }
}