import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRoutesService {
  private readonly router = inject(Router);
  
  /**
   * Navega para a lista de usuários
   */
  navegarParaLista(): void {
    this.router.navigate(['/usuarios']);
  }
  
  /**
   * Navega para o formulário de cadastro de usuário
   */
  navegarParaCadastro(): void {
    this.router.navigate(['/usuarios/cadastrar']);
  }
  
  /**
   * Navega para a página de edição do usuário
   * @param id ID do usuário a ser editado
   */
  navegarParaEdicao(id: string | number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }
  
  /**
   * Navega para a página de visualização do usuário
   * @param id ID do usuário a ser visualizado
   */
  navegarParaVisualizacao(id: string | number): void {
    this.router.navigate(['/usuarios/visualizar', id]);
  }
}