import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Endereco } from '../../features/pacientes/models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient) {}
  public consultarCep(cep: string): Observable<Endereco | null> {
    return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).pipe(
      map(response => {
        if (response && !response.erro) {
          console.log('CEP encontrado via API direta:', response);
          return response as Endereco;
        }
        return null;
      }),
      catchError(error => {
        console.error('Erro ao consultar API direta de CEP:', error);
        return of(null);
      })
    );
  }}
