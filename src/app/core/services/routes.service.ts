import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Serviço central para gerenciamento e navegação entre rotas da aplicação
 */
@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private readonly router = inject(Router);

  // Definições das rotas principais
  private readonly routes = {
    home: '/home',
    login: '/login',
    
    // Pacientes
    pacientes: {
      base: '/pacientes',
      lista: '/pacientes/lista',
      cadastrar: '/pacientes/criar',
      editar: (id: string | number) => `/pacientes/editar/${id}`,
      visualizar: (id: string | number) => `/pacientes/visualizar/${id}`,
      acompanhamento: '/pacientes/acompanhamento'
    },
    
    // Usuários
    usuarios: {
      base: '/usuarios',
      lista: '/usuarios',
      cadastrar: '/usuarios/cadastrar',
      editar: (id: string | number) => `/usuarios/editar/${id}`,
      visualizar: (id: string | number) => `/usuarios/visualizar/${id}`
    },
    
    // Configurações
    configuracoes: {
      base: '/configuracoes',
      setores: {
        lista: '/configuracoes/setores',
        novo: '/configuracoes/setores/novo',
        editar: (id: string | number) => `/configuracoes/setores/editar/${id}`
      },
      funcoes: {
        lista: '/configuracoes/funcoes',
        novo: '/configuracoes/funcoes/novo',
        editar: (id: string | number) => `/configuracoes/funcoes/editar/${id}`
      }
    },
    
    // Relatórios
    relatorios: '/relatorios',
    
    // Farmácia
    farmacia: '/farmacia'
  };

  /**
   * Retorna a estrutura de rotas para uso em componentes
   */
  getRoutes() {
    return this.routes;
  }

  // Métodos de navegação para Home
  navegarParaHome(): void {
    this.router.navigate([this.routes.home]);
  }
  
  // Métodos de navegação para Login
  navegarParaLogin(): void {
    this.router.navigate([this.routes.login]);
  }
  
  // Métodos de navegação para Pacientes
  navegarParaPacientes(): void {
    this.router.navigate([this.routes.pacientes.base]);
  }
  
  navegarParaListaPacientes(): void {
    this.router.navigate([this.routes.pacientes.lista]);
  }
  
  navegarParaCadastroPaciente(): void {
    this.router.navigate([this.routes.pacientes.cadastrar]);
  }
  
  navegarParaEdicaoPaciente(id: string | number): void {
    this.router.navigate([this.routes.pacientes.editar(id)]);
  }
  
  navegarParaVisualizacaoPaciente(id: string | number): void {
    this.router.navigate([this.routes.pacientes.visualizar(id)]);
  }
  
  navegarParaAcompanhamentoPaciente(): void {
    this.router.navigate([this.routes.pacientes.acompanhamento]);
  }
  
  // Métodos de navegação para Usuários
  navegarParaUsuarios(): void {
    this.router.navigate([this.routes.usuarios.base]);
  }
  
  navegarParaCadastroUsuario(): void {
    this.router.navigate([this.routes.usuarios.cadastrar]);
  }
  
  navegarParaEdicaoUsuario(id: string | number): void {
    this.router.navigate([this.routes.usuarios.editar(id)]);
  }
  
  navegarParaVisualizacaoUsuario(id: string | number): void {
    this.router.navigate([this.routes.usuarios.visualizar(id)]);
  }
  
  // Métodos de navegação para Configurações
  navegarParaConfiguracoes(): void {
    this.router.navigate([this.routes.configuracoes.base]);
  }
  
  navegarParaSetores(): void {
    this.router.navigate([this.routes.configuracoes.setores.lista]);
  }
  
  navegarParaNovoSetor(): void {
    this.router.navigate([this.routes.configuracoes.setores.novo]);
  }
  
  navegarParaEditarSetor(id: string | number): void {
    this.router.navigate([this.routes.configuracoes.setores.editar(id)]);
  }
  
  navegarParaFuncoes(): void {
    this.router.navigate([this.routes.configuracoes.funcoes.lista]);
  }
  
  navegarParaNovaFuncao(): void {
    this.router.navigate([this.routes.configuracoes.funcoes.novo]);
  }
  
  navegarParaEditarFuncao(id: string | number): void {
    this.router.navigate([this.routes.configuracoes.funcoes.editar(id)]);
  }
  
  // Métodos de navegação para Relatórios
  navegarParaRelatorios(): void {
    this.router.navigate([this.routes.relatorios]);
  }
  
  // Métodos de navegação para Farmácia
  navegarParaFarmacia(): void {
    this.router.navigate([this.routes.farmacia]);
  }
}