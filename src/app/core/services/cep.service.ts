import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Endereco } from '../../features/pacientes/models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private viaCepUrl = 'https://viacep.com.br/ws';
  private timeoutMs = 10000; // 10 segundos de timeout

  constructor(private http: HttpClient) {}

  /**
   * Consulta um CEP utilizando o serviço ViaCEP e normaliza para o formato do modelo Endereco
   */
  consultarCep(cep: string): Observable<Endereco | null> {
    if (!cep) {
      return of(null);
    }
    
    // Remover caracteres não numéricos e verificar se o CEP tem 8 dígitos
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return of(null);
    }
    
    const url = `${this.viaCepUrl}/${cepLimpo}/json`;
    
    return this.http.get<any>(url).pipe(
      timeout(this.timeoutMs),
      map(response => {
        // Se o ViaCEP retornar erro
        if (response.erro) {
          return null;
        }
        
        // Mapear os campos do ViaCEP para o nosso modelo Endereco
        const endereco: Endereco = {
          cep: response.cep,
          logradouro: response.logradouro,
          complemento: response.complemento,
          bairro: response.bairro,
          localidade: response.localidade,
          uf: response.uf,
          cidade: response.localidade,
          estado: response.uf,
          numero: '', // Campo a ser preenchido pelo usuário
        };
        
        return endereco;
      }),
      catchError(error => {
        console.error('Erro ao consultar CEP:', error);
        
        // Criar um erro mais amigável para o usuário
        let mensagemErro: string;
        
        if (error.name === 'TimeoutError') {
          mensagemErro = 'A consulta do CEP demorou muito para responder. Por favor, tente novamente.';
        } else if (error.status === 404) {
          mensagemErro = 'CEP não encontrado.';
        } else {
          mensagemErro = 'Erro ao consultar o CEP. Verifique sua conexão com a internet.';
        }
        
        return throwError(() => new Error(mensagemErro));
      })
    );
  }
}
