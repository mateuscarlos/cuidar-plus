import { Injectable, inject } from '@angular/core';
import { RoutesService } from '../../../core/services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRoutesService {
  private readonly routesService = inject(RoutesService);
  
  /**
   * Navega para a lista de usuários
   */
  navegarParaLista(): void {
    this.routesService.navegarParaUsuarios();
  }
  
  /**
   * Navega para o formulário de cadastro de usuário
   */
  navegarParaCadastro(): void {
    this.routesService.navegarParaCadastroUsuario();
  }
  
  /**
   * Navega para a página de edição do usuário
   * @param id ID do usuário a ser editado
   */
  navegarParaEdicao(id: string | number): void {
    this.routesService.navegarParaEdicaoUsuario(id);
  }
  
  /**
   * Navega para a página de visualização do usuário
   * @param id ID do usuário a ser visualizado
   */
  navegarParaVisualizacao(id: string | number): void {
    this.routesService.navegarParaVisualizacaoUsuario(id);
  }
}