import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormattedDateComponent } from '../../../shared/components/formatted-date/formatted-date.component';
import { UsuarioBuscaComponent } from '../usuario-busca/usuario-busca.component';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UsuarioAvatarComponent } from '../../../shared/components/usuario-avatar/usuario-avatar.component';
import { Usuario } from '../models/user.model';
import { Permissao } from '../models/permissao.model';
import { Atividade } from '../models/atividade.model';
import { ResultadoBusca } from '../models/busca-usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { ApiUsuarioService } from '../services/api-usuario.service';
import { PermissaoService } from '../services/permissao.service';
import { AtividadeService } from '../services/atividade.service';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { finalize, catchError, tap, of, Subject, takeUntil } from 'rxjs';

/**
 * Componente responsável pela visualização detalhada de usuários
 */
@Component({
  selector: 'app-visualizar-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UsuarioBuscaComponent,
    InfoCardComponent,
    StatusBadgeComponent,
    UsuarioAvatarComponent,
    FormattedDateComponent
  ],
  templateUrl: './visualizar-usuario.component.html',
  styleUrls: ['./visualizar-usuario.component.scss']
})
export class VisualizarUsuarioComponent implements OnInit, OnDestroy {
  // Dados principais
  usuario: Usuario | null = null;
  permissoes: Permissao[] = [];
  atividades: Atividade[] = [];
  
  // Estados da UI
  isLoading: boolean = false;
  error: string | null = null;
  modoVisualizacao: boolean = false;
  resultadosBusca: Usuario[] = [];
  possuiPermissaoEditar: boolean = true; // Por padrão, todos podem editar já que não há perfis de acesso
  temMaisAtividades: boolean = false;
  paginaAtual: number = 1;
  tamanhoPagina: number = 10;
  
  // Para gerenciar subscriptions
  private destroy$ = new Subject<void>();
  
  constructor(
    private usuarioService: UsuarioService,
    private apiUsuarioService: ApiUsuarioService,
    private permissaoService: PermissaoService,
    private atividadeService: AtividadeService,
    private notificacaoService: NotificacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Resetamos o estado inicial
    this.resetComponent();
    
    // Verificar os parâmetros de rota
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.carregarUsuarioPorId(params['id']);
      } else {
        // Verificar parâmetros de consulta
        this.route.queryParams.pipe(
          takeUntil(this.destroy$)
        ).subscribe(queryParams => {
          if (queryParams['usuarioId']) {
            this.carregarUsuarioPorId(queryParams['usuarioId']);
          } else {
            // Se não há parâmetros, mostramos a tela de busca
            this.isLoading = false;
            this.modoVisualizacao = false;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Reseta o componente para o estado inicial
   */
  resetComponent(): void {
    this.usuario = null;
    this.permissoes = [];
    this.atividades = [];
    this.error = null;
    this.resultadosBusca = [];
    this.modoVisualizacao = false;
    this.paginaAtual = 1;
    this.temMaisAtividades = false;
  }
  
  /**
   * Carrega os dados de um usuário pelo ID
   */
  carregarUsuarioPorId(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    // Usando o serviço ApiUsuarioService que usa o modelo de user.model.ts
    this.apiUsuarioService.obterUsuarioPorId(id)
      .pipe(
        tap(usuario => {
          if (usuario) {
            this.usuario = usuario;
            this.modoVisualizacao = true;
            
            // Carregar permissões e atividades
            this.carregarPermissoes(id);
            this.carregarAtividades(id);
          } else {
            this.error = 'Usuário não encontrado';
            this.notificacaoService.mostrarAviso('Usuário não encontrado.');
            this.modoVisualizacao = false;
          }
        }),
        catchError(erro => {
          this.error = 'Erro ao carregar dados do usuário';
          this.modoVisualizacao = false;
          this.notificacaoService.mostrarErro('Erro ao carregar dados do usuário.');
          console.error('Erro ao carregar usuário:', erro);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
  
  /**
   * Carrega as permissões do usuário
   */
  carregarPermissoes(usuarioId: string): void {
    this.permissaoService.listarPermissoesPorUsuario(usuarioId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (permissoes) => {
        this.permissoes = permissoes;
      },
      error: (err) => {
        console.error('Erro ao carregar permissões:', err);
        this.notificacaoService.mostrarErro('Erro ao carregar permissões do usuário.');
      }
    });
  }
  
  /**
   * Carrega o histórico de atividades do usuário
   */
  carregarAtividades(usuarioId: string): void {
    this.atividadeService.listarAtividadesPorUsuario(usuarioId, this.paginaAtual, this.tamanhoPagina).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resultado) => {
        this.atividades = resultado.items;
        this.temMaisAtividades = resultado.total > (this.paginaAtual * this.tamanhoPagina);
      },
      error: (err) => {
        console.error('Erro ao carregar atividades:', err);
        this.notificacaoService.mostrarErro('Erro ao carregar histórico de atividades.');
      }
    });
  }
  
  /**
   * Carrega mais atividades (paginação)
   */
  carregarMaisAtividades(): void {
    if (!this.usuario || !this.temMaisAtividades) return;
    
    this.paginaAtual++;
    
    this.atividadeService.listarAtividadesPorUsuario(String(this.usuario.id), this.paginaAtual, this.tamanhoPagina).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (resultado) => {
        this.atividades = [...this.atividades, ...resultado.items];
        this.temMaisAtividades = resultado.total > (this.paginaAtual * this.tamanhoPagina);
      },
      error: (err) => {
        console.error('Erro ao carregar mais atividades:', err);
        this.notificacaoService.mostrarErro('Erro ao carregar mais atividades.');
        this.paginaAtual--; // Reverter o incremento da página em caso de erro
      }
    });
  }
  
  /**
   * Processa o resultado da busca de usuários
   */
  buscarUsuario(resultado: ResultadoBusca): void {
    this.isLoading = true;
    this.error = null;
    this.modoVisualizacao = false;
    
    this.usuarioService.buscarUsuarios(resultado)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (usuarios) => {
          this.resultadosBusca = usuarios;
          
          if (usuarios.length === 0) {
            this.error = 'Nenhum usuário encontrado com os critérios informados.';
          } else if (usuarios.length === 1) {
            // Selecionar automaticamente se houver apenas um resultado
            this.selecionarUsuario(usuarios[0]);
          }
        },
        error: (err) => {
          this.error = 'Erro ao buscar usuários';
          this.resultadosBusca = [];
          this.notificacaoService.mostrarErro('Erro ao buscar usuários.');
          console.error('Erro na busca:', err);
        }
      });
  }
  
  /**
   * Seleciona um usuário da lista de resultados
   */
  selecionarUsuario(usuario: Usuario): void {
    this.carregarUsuarioPorId(String(usuario.id));
  }
  
  /**
   * Navega para a página de edição do usuário
   */
  irParaEdicao(): void {
    if (this.usuario && this.usuario.id) {
      this.router.navigate(['/usuarios/editar', this.usuario.id]);
    } else {
      this.notificacaoService.mostrarErro('Não é possível editar: usuário não encontrado ou sem ID.');
    }
  }
  
  /**
   * Navega de volta para a tela de busca
   */
  voltarParaBusca(): void {
    this.modoVisualizacao = false;
    this.usuario = null;
    this.resultadosBusca = [];
    this.permissoes = [];
    this.atividades = [];
  }

  /**
   * Navega de volta para a lista de usuários
   */
  voltarParaLista(): void {
    this.router.navigate(['/usuarios']);
  }
  
  /**
   * Retorna a classe de estilo para o badge de atividade baseado no tipo
   */
  getBadgeClassForAtividade(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'login':
        return 'bg-success';
      case 'logout':
        return 'bg-secondary';
      case 'erro':
      case 'falha':
        return 'bg-danger';
      case 'alteração':
      case 'alteracao':
        return 'bg-warning';
      case 'acesso':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
  
  /**
   * Método adaptador para lidar com o evento resultadoBusca do componente app-busca-usuario
   * @param resultado O resultado emitido pelo componente de busca
   */
  buscarUsuarioPorResultado(resultado: any): void {
    if (resultado) {
      this.buscarUsuario(resultado);
    }
  }

  /**
   * Retorna o tipo de acesso do usuário formatado para exibição
   */
  getTipoAcessoFormatado(): string {
    const tipoAcesso = this.usuario?.tipoAcesso || this.usuario?.tipo_acesso;
    
    switch (tipoAcesso?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'gestor':
        return 'Gestor';
      case 'padrao':
        return 'Padrão';
      case 'restrito':
        return 'Restrito';
      default:
        return tipoAcesso || 'Não definido';
    }
  }
}