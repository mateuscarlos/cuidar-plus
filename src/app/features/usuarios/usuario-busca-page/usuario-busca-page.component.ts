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
    <div class="container-fluid py-4">
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
        [currentPage]="paginaAtual"
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

  mensagem: string = '';
  filtros: any = {};

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
      name: 'id',
      label: 'ID',
      type: 'number',
      placeholder: 'ID do usuário',
      width: 2,
      icon: 'hash'
    },
    {
      name: 'setor',
      label: 'Setor',
      type: 'text',
      placeholder: 'Digite o setor',
      width: 3,
      icon: 'building'
    },
    {
      name: 'funcao',
      label: 'Função',
      type: 'text',
      placeholder: 'Digite a função',
      width: 3,
      icon: 'briefcase'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      width: 2,
      icon: 'tag',
      options: Object.values(UserStatus).map(status => ({
        id: status,
        nome: status
      }))
    }
  ];
  
  colunasUsuario = [
    { header: 'Nome', field: 'nome' },
    { header: 'Email', field: 'email' },
    { header: 'CPF', field: 'cpf', pipe: 'cpf' },
    { header: 'Setor', field: 'setor', formatFn: (value: any) => this.formatarSetor(value) },
    { header: 'Função', field: 'funcao', formatFn: (value: any) => this.formatarFuncao(value) },
    { header: 'Status', field: 'status', type: 'status' }
  ];
  
  usuarios: any[] = [];
  isLoading = false;
  totalUsuarios = 0;
  paginaAtual = 1;
  ultimaConsulta: SearchResult | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialização adicional, se necessário
  }

  buscarUsuarios(filtros: SearchResult): void {
    this.ultimaConsulta = filtros; // Guarda a última consulta
    this.isLoading = true;
    
    // Adicionar paginação
    const filtrosComPaginacao = {
      ...filtros,
      page: this.paginaAtual,
      limit: 10
    };
    
    console.log('Enviando filtros para API:', filtrosComPaginacao);
    
    this.usuarioService.buscarUsuarios(filtrosComPaginacao).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        
        if (Array.isArray(response)) {
          // API retornou um array direto
          this.usuarios = response;
          this.totalUsuarios = response.length;
        } else if (response && response.items) {
          // API retornou formato paginado {items, total, page, etc}
          this.usuarios = response.items;
          this.totalUsuarios = response.total;
          this.paginaAtual = response.page || this.paginaAtual;
        } else {
          // Outro formato
          console.warn('Formato de resposta não esperado:', response);
          this.usuarios = [];
          this.totalUsuarios = 0;
          this.notificacaoService.mostrarErro('Formato de resposta inválido');
        }
        
        console.log('Usuários processados:', this.usuarios);
        console.log('Total de usuários:', this.totalUsuarios);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar usuários', error);
        this.notificacaoService.mostrarErro('Não foi possível realizar a busca de usuários.');
        this.usuarios = [];
        this.totalUsuarios = 0;
        this.isLoading = false;
      }
    });
  }

  limparBusca(): void {
    this.usuarios = [];
    this.totalUsuarios = 0;
    this.paginaAtual = 1;
    this.ultimaConsulta = null;
  }
  
  mudarPagina(pagina: number): void {
    this.paginaAtual = pagina;
    if (this.ultimaConsulta) {
      this.buscarUsuarios(this.ultimaConsulta);
    }
  }

  handleAction(event: {action: string, item: any}): void {
    console.log('Ação:', event.action, 'Item:', event.item);
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
  
  formatarSetor(valor: any): string {
    if (!valor) return 'N/A';
    // Se valor for um ID, aqui você poderia converter para o nome usando um mapeamento
    return typeof valor === 'string' ? valor : valor.toString();
  }
  
  formatarFuncao(valor: any): string {
    if (!valor) return 'N/A';
    // Se valor for um ID, aqui você poderia converter para o nome usando um mapeamento
    return typeof valor === 'string' ? valor : valor.toString();
  }
}