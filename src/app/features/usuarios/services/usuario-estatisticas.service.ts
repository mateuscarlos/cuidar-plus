import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../models/user.model';

export interface UsuarioEstatisticas {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalAdmins: number;
  usuariosInativos: number;
  ultimaAtualizacao?: Date;
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioEstatisticasService {
  private apiUrl = environment.apiUrl;
  private cachedEstatisticas: UsuarioEstatisticas | null = null;
  private lastUpdated: Date | null = null;
  private cacheTimeMs = 5 * 60 * 1000; // Cache por 5 minutos

  constructor(private http: HttpClient) { }

  /**
   * Obtém estatísticas de usuários, usando cache se disponível e válido
   */
  getEstatisticas(forceRefresh = false): Observable<UsuarioEstatisticas> {
    // Se temos cache válido e não é forçada a atualização
    if (!forceRefresh && this.cachedEstatisticas && this.lastUpdated && 
        (new Date().getTime() - this.lastUpdated.getTime() < this.cacheTimeMs)) {
      return of(this.cachedEstatisticas);
    }
    
    // Se houver um endpoint específico:
    // return this.http.get<UsuarioEstatisticas>(`${this.apiUrl}/usuarios/estatisticas`);
    
    // Usando a rota de lista de usuários para calcular as estatísticas
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/lista`)
      .pipe(
        map(usuarios => {
          const estatisticas = this.calcularEstatisticas(usuarios);
          // Atualiza o cache
          this.cachedEstatisticas = estatisticas;
          this.lastUpdated = new Date();
          estatisticas.ultimaAtualizacao = this.lastUpdated;
          return estatisticas;
        }),
        catchError(error => {
          console.error('Erro ao buscar estatísticas de usuários', error);
          // Retorna cache se disponível, mesmo expirado, em caso de erro
          if (this.cachedEstatisticas) {
            return of(this.cachedEstatisticas);
          }
          // Retorna estatísticas vazias em caso de erro sem cache
          return of({
            totalUsuarios: 0,
            usuariosAtivos: 0,
            totalAdmins: 0,
            usuariosInativos: 0,
            ultimaAtualizacao: new Date()
          });
        })
      );
  }

  /**
   * Força atualização dos dados de estatísticas
   */
  refreshEstatisticas(): Observable<UsuarioEstatisticas> {
    return this.getEstatisticas(true);
  }

  /**
   * Calcula estatísticas a partir da lista de usuários
   */
  private calcularEstatisticas(usuarios: Usuario[]): UsuarioEstatisticas {
    const totalUsuarios = usuarios.length;
    // Verifica se o status existe e corresponde a "Ativo"/"Inativo" ou se é um booleano
    const usuariosAtivos = usuarios.filter(u => 
      (u.status === 'Ativo' || u.ativo === true)
    ).length;
    
    const usuariosInativos = usuarios.filter(u => 
      u.status === 'Inativo' || u.ativo === false
    ).length;
    
    const totalAdmins = usuarios.filter(u => 
      u.tipo_acesso === 'Admin' || 
      u.tipo_acesso === 'Administrador' 
    ).length;
    
    return {
      totalUsuarios,
      usuariosAtivos,
      totalAdmins,
      usuariosInativos,
      ultimaAtualizacao: new Date()
    };
  }
}