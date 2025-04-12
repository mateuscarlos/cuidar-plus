import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

// Serviços
import { UsuarioService} from '../services/usuario.service';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

// Modelos
import { Usuario, UserStatus } from '../models/user.model';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';

// Componentes
import { UsuarioBuscaComponent } from '../usuario-busca/usuario-busca.component';
import { UsuarioBuscaPageComponent } from '../usuario-busca-page/usuario-busca-page.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    NgxMaskDirective, 
    NgxMaskPipe,
    FormsModule,
    UsuarioBuscaComponent,
    UsuarioBuscaPageComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit, OnDestroy {

  userStatusOptions: { value: UserStatus; label: string }[] = [
    { value: UserStatus.ATIVO, label: 'Ativo' },
    { value: UserStatus.INATIVO, label: 'Inativo' },
    { value: UserStatus.FERIAS, label: 'Férias' },
    { value: UserStatus.LICENCA_MEDICA, label: 'Licença Médica' },
    { value: UserStatus.LICENCA_MATERNIDADE, label: 'Licença Maternidade' },
    { value: UserStatus.LICENCA_PATERNIDADE, label: 'Licença Paternidade' },
    { value: UserStatus.AFASTADO_ACIDENTE_DE_TRABALHO, label: 'Afastado por Acidente de Trabalho' },
    { value: UserStatus.AFASTAMENTO_NAO_REMUNERADO, label: 'Afastamento Não Remunerado' },
    { value: UserStatus.SUSPENSAO_CONTRTATUAL, label: 'Suspensão Contratual' },
    { value: UserStatus.APOSENTADO, label: 'Aposentado' },
    { value: UserStatus.AFASTADO_OUTROS, label: 'Afastado por Outros Motivos' }
  ];
  
  // Dados da tabela
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  totalItems: number = 0;
  
  // Filtros
  searchTerm: string = '';
  statusFiltro: string = '';
  
  // Mapas para armazenar relações ID -> Nome
  setoresMap: Map<string, string> = new Map<string, string>();
  funcoesMap: Map<string, string> = new Map<string, string>();
  
  // Listagem de setores e funções para filtros
  setores: Setor[] = [];
  funcoes: Funcao[] = [];

  // Controle para destruir Observables na saída do componente
  private destroy$ = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    private userStatusStyle: UserStatusStyleService,
    private router: Router,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit() {
    // Carregar dados auxiliares primeiro (setores, funções)
    forkJoin({
      setores: this.usuarioService.listarSetores(),
      funcoes: this.usuarioService.listarFuncoes()
    }).subscribe({
      next: (result) => {
        // Armazenar setores e funções
        this.setores = result.setores;
        this.funcoes = result.funcoes;
        
        // Criar mapas para consulta rápida
        this.setoresMap = new Map(this.setores.map(setor => [setor.id.toString(), setor.nome]));
        this.funcoesMap = new Map(this.funcoes.map(funcao => [funcao.id.toString(), funcao.nome]));
        
        // Agora podemos carregar os usuários
        this.carregarUsuarios();
      },
      error: (erro) => {
        console.error('Erro ao carregar dados auxiliares:', erro);
        this.error = 'Não foi possível carregar configurações necessárias.';
        // Ainda assim, tentar carregar usuários
        this.carregarUsuarios();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Carrega a lista de usuários
   */
  carregarUsuarios() {
    this.isLoading = true;
    this.error = null;
    
    this.usuarioService.listarTodosUsuarios()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          setTimeout(() => this.initializeTooltips(), 100);
        })
      )
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios.map(user => {
            // Adicionar propriedades calculadas para exibição
            return {
              ...user,
              setorNome: this.getNomeSetor(user.setor),
              funcaoNome: this.getNomeFuncao(user.funcao)
            };
          });
          this.usuariosFiltrados = [...this.usuarios];
          this.totalItems = this.usuarios.length;
          console.log('Usuários carregados:', this.usuarios);
        },
        error: (erro) => {
          console.error('Erro ao carregar usuários:', erro);
          this.error = 'Não foi possível carregar a lista de usuários. Tente novamente mais tarde.';
        }
      });
  }

  /**
   * Inicializa os tooltips do Bootstrap
   */
  initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if ((window as any).bootstrap) {
      tooltipTriggerList.forEach(el => new (window as any).bootstrap.Tooltip(el));
    }
  }
  
  /**
   * Aplica os filtros de busca aos usuários
   */
  aplicarFiltros() {
    if (!this.usuarios.length) return;
    
    let usuariosFiltrados = [...this.usuarios];
    
    // Filtrar por texto (nome, email, CPF ou ID)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const termoBusca = this.searchTerm.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        (usuario.nome?.toLowerCase().includes(termoBusca)) || 
        (usuario.email?.toLowerCase().includes(termoBusca)) ||
        (usuario.cpf?.toLowerCase().includes(termoBusca)) ||
        (usuario.id?.toString().includes(termoBusca))
      );
    }
    
    // Filtrar por status
    if (this.statusFiltro) {
      const statusValue = this.statusFiltro;
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.status === statusValue
      );
    }
    
    this.usuariosFiltrados = usuariosFiltrados;
  }
  
  /**
   * Limpa os filtros e restaura a lista completa
   */
  limparFiltros() {
    this.searchTerm = '';
    this.statusFiltro = '';
    this.aplicarFiltros();
  }
  
  /**
   * Verifica se o usuário está ativo
   */
  isUsuarioAtivo(usuario: Usuario): boolean {
    return usuario.status === UserStatus.ATIVO;
  }
  
  /**
   * Métodos para visualização e estilização do status
   */
  getStatusClass(usuario: Usuario): string {
    return this.userStatusStyle.getBadgeClass(usuario.status || 'Inativo');
  }
  
  getStatusIcon(usuario: Usuario): string {
    return this.userStatusStyle.getIcon(usuario.status || 'Inativo');
  }
  
  getStatusTextClass(usuario: Usuario): string {
    return this.userStatusStyle.getTextClass(usuario.status || 'Inativo');
  }
  
  /**
   * Obter texto para tooltip com detalhes do status
   */
  getStatusTooltip(usuario: Usuario): string {
    switch(usuario.status) {
      case UserStatus.ATIVO:
        return 'Usuário em atividade normal';
      case UserStatus.INATIVO:
        return 'Usuário temporariamente inativo';
      case UserStatus.FERIAS:
        return 'Usuário em período de férias';
      case UserStatus.LICENCA_MEDICA:
        return 'Usuário em licença médica';
      case UserStatus.LICENCA_MATERNIDADE:
        return 'Usuário em licença maternidade';
      case UserStatus.LICENCA_PATERNIDADE:
        return 'Usuário em licença paternidade';
      case UserStatus.AFASTADO_ACIDENTE_DE_TRABALHO:
        return 'Usuário afastado por acidente de trabalho';
      case UserStatus.AFASTAMENTO_NAO_REMUNERADO:
        return 'Usuário em afastamento não remunerado';
      case UserStatus.SUSPENSAO_CONTRTATUAL:
        return 'Contrato temporariamente suspenso';
      case UserStatus.APOSENTADO:
        return 'Usuário aposentado';
      default:
        return 'Status desconhecido';
    }
  }
  
  /**
   * Métodos para navegação
   */
  navegarParaVisualizacao(usuario: Usuario): void {
    this.router.navigate(['/usuarios/visualizar'], {
      queryParams: { usuarioId: usuario.id }
    });
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/usuarios/criar']).then(success => {
      if (!success) {
        console.error('Navegação para cadastro de usuário falhou');
        this.notificacaoService.mostrarErro('Não foi possível acessar a página de cadastro de usuários');
      }
    });
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
  
  /**
   * Retorna as funções disponíveis para um setor específico
   */
  getFuncoesPorSetor(setorId: string | number): Funcao[] {
    if (!setorId) return [];
    return this.funcoes.filter(funcao => funcao.setor_id?.toString() === setorId.toString());
  }

  excluirUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluirUsuario(id.toString()).subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Usuário excluído com sucesso!');
          this.carregarUsuarios();
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao excluir usuário. Tente novamente.');
        }
      });
    }
  }
}