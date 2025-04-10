import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from '../models/atividade.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {
  private apiUrl = `${environment.apiUrl}/atividades`;

  constructor(private http: HttpClient) { }

  listarAtividadesPorUsuario(
    usuarioId: string, 
    pagina: number = 1, 
    tamanhoPagina: number = 10
  ): Observable<{ items: Atividade[], total: number }> {
    
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanhoPagina.toString());

    return this.http.get<{ items: Atividade[], total: number }>(
      `${this.apiUrl}/usuario/${usuarioId}`, 
      { params }
    );
  }
}