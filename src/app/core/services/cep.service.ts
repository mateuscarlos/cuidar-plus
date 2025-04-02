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
  private readonly API_URL = 'https://viacep.com.br/ws';

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
    
    const url = `${this.API_URL}/${cep}/json`;
    
    return this.http.get<EnderecoViaCep>(url).pipe(
      map(endereco => {
        // A API do ViaCEP retorna um objeto com propriedade erro quando o CEP não existe
        if (endereco && !('erro' in endereco)) {
          return endereco;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}