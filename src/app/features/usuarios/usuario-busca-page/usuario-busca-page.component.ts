import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { UserStatus } from '../models/user.model';
import { AdvancedSearchComponent, SearchField, SearchResult } from '../../../shared/components/advanced-search/advanced-search.component';
import { DynamicPipePipe } from '../../../shared/pipes/dynamic-pipe.pipe';

@Component({
  selector: 'app-usuario-busca-page',
  standalone: true,
  imports: [
    CommonModule,
    AdvancedSearchComponent,
    DynamicPipePipe
  ],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="mb-0">
          <i class="bi bi-search me-2 text-primary"></i>Busca Avançada de Usuários
        </h3>
        <button class="btn btn-primary" (click)="navegarParaCadastro()">
          <i class="bi bi-plus-circle me-2"></i>Novo Usuário
        </button>
      </div>
      
      <app-advanced-search
        [title]="'Filtros de Busca'"
        [fields]="camposBusca"
        [isLoading]="isLoading"
        [resultados]="usuarios"
        [colunas]="colunasUsuario"
        [totalItems]="totalUsuarios"
        [pageSize]="10"
        (search)="buscarUsuarios($event)"
        (clear)="limparBusca()"
        (action)="handleAction($event)"
        (select)="selecionarUsuario($event)"
        (pageChange)="mudarPagina($event)">
      </app-advanced-search>
    </div>
  `
})
export class UsuarioBuscaPageComponent implements OnInit {
  camposBusca: SearchField[] = [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Buscar por nome',
      width: 3,
      icon: 'person'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Buscar por email',
      width: 3,
      icon: 'envelope'
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text',
      placeholder: 'Digite o CPF',
      width: 2,
      icon: 'card-text',
      pipe: 'cpf'
    },
    {
      name: 'funcao',
      label: 'Função',
      type: 'text',
      placeholder: 'Digite a função',
      width: 2,
      icon: 'briefcase'
    },
    {
      name: 'setor',
      label: 'Setor',
      type: 'text',
      placeholder: 'Digite o setor',
      width: 2,
      icon: 'building'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      width: 2,
      icon: 'tag',
      options: Object.values(UserStatus)
    }
  ];
  
  colunasUsuario = [
    { header: 'Nome', field: 'nome' },
    { header: 'Email', field: 'email' },
    { header: 'CPF', field: 'cpf', pipe: 'cpf' },
    { header: 'Função', field: 'funcaoNome' },
    { header: 'Status', field: 'status', type: 'status' }
  ];
  
  usuarios: any[] = [];
  isLoading = false;
  totalUsuarios = 0;
  paginaAtual = 1;

  constructor(
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialização adicional, se necessário
  }

  buscarUsuarios(filtros: SearchResult): void {
    this.isLoading = true;
    
    // Adicionar paginação
    const filtrosComPaginacao = {
      ...filtros,
      page: this.paginaAtual,
      limit: 10
    };
    
    this.usuarioService.buscarUsuarios(filtrosComPaginacao).subscribe({
      next: (response) => {
        this.usuarios = response;
        this.totalUsuarios = response.length; // Idealmente seria response.totalItems de uma API paginada
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários', error);
        this.notificacaoService.mostrarErro('Não foi possível realizar a busca de usuários.');
        this.isLoading = false;
      }
    });
  }

  limparBusca(): void {
    this.usuarios = [];
    this.totalUsuarios = 0;
    this.paginaAtual = 1;
  }
  
  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
  }

  handleAction(event: {action: string, item: any}): void {
    if (event.action === 'view') {
      this.visualizarUsuario(event.item);
    } else if (event.action === 'edit') {
      this.editarUsuario(event.item);
    }
  }

  visualizarUsuario(usuario: any): void {
    if (usuario?.id) {
      this.router.navigate(['/usuarios/visualizar', usuario.id]);
    }
  }

  editarUsuario(usuario: any): void {
    if (usuario?.id) {
      this.router.navigate(['/usuarios/editar', usuario.id]);
    }
  }

  selecionarUsuario(usuario: any): void {
    this.visualizarUsuario(usuario);
  }
  
  navegarParaCadastro(): void {
    this.router.navigate(['/usuarios/cadastrar']);
  }
}