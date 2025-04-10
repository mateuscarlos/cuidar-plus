import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permissao } from '../models/permissao.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {
  private apiUrl = `${environment.apiUrl}/permissoes`;

  constructor(private http: HttpClient) { }

  listarPermissoesPorUsuario(usuarioId: string): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  atualizarPermissoes(usuarioId: string, permissoes: Permissao[]): Observable<Permissao[]> {
    return this.http.put<Permissao[]>(`${this.apiUrl}/usuario/${usuarioId}`, { permissoes });
  }
}