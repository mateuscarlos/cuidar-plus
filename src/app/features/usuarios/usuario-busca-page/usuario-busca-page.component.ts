import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Adicionando RouterModule para routerLink
import { UsuarioService } from '../services/usuario.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { UserStatus, Usuario } from '../models/user.model';
import { AdvancedSearchComponent, SearchField, SearchResult } from '../../../shared/components/advanced-search/advanced-search.component';
import { DynamicPipePipe } from '../../../shared/pipes/dynamic-pipe.pipe';
import { SetoresFuncoesService, Setor, Funcao } from '../services/setor-funcoes.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-usuario-busca-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Adicionando RouterModule para suportar routerLink
    AdvancedSearchComponent,
    DynamicPipePipe
  ],
  template: `
    <div class="container-fluid py-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/dashboard">Home</a></li>
          <li class="breadcrumb-item"><a routerLink="/usuarios">Usuários</a></li>
          <li class="breadcrumb-item active" aria-current="page">Busca Avançada</li>
        </ol>
      </nav>
      
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
export class UsuarioBuscaPageComponent implements OnInit, OnDestroy {

  mensagem: string = '';
  filtros: any = {};

  // Mapas para armazenar relações ID -> Nome
  setoresMap: Map<string, string> = new Map<string, string>();
  funcoesMap: Map<string, string> = new Map<string, string>();
  
  // Listas de setores e funções
  setores: Setor[] = [];
  funcoes: Funcao[] = [];
  
  // Controle para destruir Observables na saída do componente
  private destroy$ = new Subject<void>();

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
    private setoresFuncoesService: SetoresFuncoesService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carregar dados de setores e funções para mapeamento
    this.carregarDadosAuxiliares();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Carrega os dados de setores e funções para mapeamento
   */
  carregarDadosAuxiliares(): void {
    this.isLoading = true;
    
    // Obter dicionário de setores
    this.setoresFuncoesService.getSetoresDicionario()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (setores) => {
          // Converter o objeto de dicionário em um Map
          Object.entries(setores).forEach(([id, nome]) => {
            this.setoresMap.set(id, nome);
          });
          
          // Após carregar setores, carregar funções
          this.carregarFuncoes();
        },
        error: (erro) => {
          console.error('Erro ao carregar setores:', erro);
          this.notificacaoService.mostrarErro('Não foi possível carregar informações dos setores.');
          // Ainda assim, tentar carregar funções
          this.carregarFuncoes();
        }
      });
  }
  
  /**
   * Carrega o dicionário de funções
   */
  carregarFuncoes(): void {
    this.setoresFuncoesService.getFuncoesDicionario()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (funcoes) => {
          // Converter o objeto de dicionário em um Map
          Object.entries(funcoes).forEach(([id, nome]) => {
            this.funcoesMap.set(id, nome);
          });
        },
        error: (erro) => {
          console.error('Erro ao carregar funções:', erro);
          this.notificacaoService.mostrarErro('Não foi possível carregar informações das funções.');
        }
      });
  }

  buscarUsuarios(filtros: SearchResult): void {
    this.ultimaConsulta = filtros;
    this.isLoading = true;
    
    // Adicionar paginação
    const filtrosComPaginacao = {
      ...filtros,
      page: this.paginaAtual,
      limit: 10
    };
    
    this.usuarioService.buscarUsuarios(filtrosComPaginacao).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          // Enriquecer os dados com nomes de setor e função
          this.usuarios = this.enriquecerDadosUsuarios(response);
          this.totalUsuarios = response.length;
        } else if (response && response.items) {
          // API retornou formato paginado
          this.usuarios = this.enriquecerDadosUsuarios(response.items);
          this.totalUsuarios = response.total;
          this.paginaAtual = response.page || this.paginaAtual;
        } else {
          this.usuarios = [];
          this.totalUsuarios = 0;
          this.notificacaoService.mostrarErro('Formato de resposta inválido');
        }
        
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
  
  /**
   * Adiciona os nomes de setor e função aos usuários
   */
  enriquecerDadosUsuarios(usuarios: any[]): any[] {
    return usuarios.map(usuario => {
      return {
        ...usuario,
        setorNome: this.getNomeSetor(usuario.setor),
        funcaoNome: this.getNomeFuncao(usuario.funcao)
      };
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
    if (event.action === 'view') {
      this.visualizarUsuario(event.item);
    } else if (event.action === 'edit') {
      this.editarUsuario(event.item);
    }
  }

  /**
   * Navega para a visualização detalhada do usuário
   */
  visualizarUsuario(usuario: Usuario) {
    if (!usuario || !usuario.id) {
      this.notificacaoService.mostrarErro('ID de usuário inválido');
      return;
    }
    
    // Usar o parâmetro de rota (:id) em vez de queryParams
    this.router.navigate(['/usuarios/visualizar', usuario.id])
      .then(success => {
        if (!success) {
          console.error('Navegação para visualização de usuário falhou');
          this.notificacaoService.mostrarErro('Não foi possível acessar os detalhes do usuário');
        }
      });
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
    this.router.navigate(['/usuarios/criar']);
  }
  
  /**
   * Métodos para obter nomes a partir de IDs
   */
  getNomeFuncao(funcaoId: string | number | undefined): string {
    if (!funcaoId) return 'Não definido';
    const id = funcaoId.toString();
    return this.funcoesMap.get(id) || 'N/A';
  }
  
  getNomeSetor(setorId: string | number | undefined): string {
    if (!setorId) return 'Não definido';
    const id = setorId.toString();
    return this.setoresMap.get(id) || 'Não encontrado';
  }
  
  formatarSetor(valor: any): string {
    if (!valor) return 'N/A';
    // Usar o mapa para obter o nome do setor a partir do ID
    return this.getNomeSetor(valor);
  }
  
  formatarFuncao(valor: any): string {
    if (!valor) return 'N/A';
    // Usar o mapa para obter o nome da função a partir do ID
    return this.getNomeFuncao(valor);
  }
}