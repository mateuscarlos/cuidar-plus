import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

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

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    NgxMaskDirective, 
    NgxMaskPipe,
    UsuarioBuscaComponent
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
    this.carregarDados();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Carrega todos os dados necessários para a listagem
   */
  carregarDados() {
    this.isLoading = true;
    this.error = null;
    
    // Carregar setores
    this.usuarioService.listarSetores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (setores) => {
          this.setores = setores;
          
          // Armazenar setores em um mapa para acesso rápido
          setores.forEach(setor => {
            this.setoresMap.set(setor.id.toString(), setor.nome);
          });
          
          // Carregar usuários após setores
          this.carregarUsuarios();
        },
        error: (error) => {
          this.error = 'Erro ao carregar setores';
          this.isLoading = false;
          this.notificacaoService.mostrarErro('Não foi possível carregar a lista de setores');
          console.error('Erro ao carregar setores:', error);
        }
      });
      
    // Carregar funções (mesmo que não precisemos carregar todos)
    this.usuarioService.listarFuncoes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (funcoes) => {
          this.funcoes = funcoes;
          
          // Armazenar funções em um mapa para acesso rápido
          funcoes.forEach(funcao => {
            this.funcoesMap.set(funcao.id.toString(), funcao.nome);
          });
        },
        error: (error) => {
          console.error('Erro ao carregar funções:', error);
          // Não exibimos erro porque os nomes das funções serão obtidos na API de usuários
        }
      });
  }

  /**
   * Carrega a lista de usuários
   */
  carregarUsuarios() {
    this.usuarioService.listarUsuarios()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (usuarios) => {
          // Garantir que todos os IDs sejam tratados como strings para facilitar comparações
            this.usuarios = usuarios.items.map((usuario: Usuario): Usuario & { setorNome: string; funcaoNome: string } => {
            // Converter todos os IDs para string para consistência
            if (usuario.setor) usuario.setor = usuario.setor.toString();
            if (usuario.funcao) usuario.funcao = usuario.funcao.toString();
            
            return {
              ...usuario,
              setorNome: this.getNomeSetor(usuario.setor),
              funcaoNome: this.getNomeFuncao(usuario.funcao)
            };
            });
          
          // Log para debug
          console.log('Usuários carregados:', this.usuarios.length);
          this.usuarios.forEach(u => {
            console.log(`Usuário: ${u.nome}, Setor ID: ${u.setor}, Função ID: ${u.funcao}`);
          });
          
          this.usuariosFiltrados = [...this.usuarios];
          
          setTimeout(() => this.initializeTooltips(), 300);
        },
        error: (error) => {
          this.error = 'Erro ao carregar usuários';
          this.notificacaoService.mostrarErro('Não foi possível carregar a lista de usuários');
          console.error('Erro ao carregar usuários:', error);
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
  aplicarFiltros(filtros: any) {
    if (!this.usuarios.length) return;
    
    console.log('Aplicando filtros:', filtros); // Debug
    
    let usuariosFiltrados = [...this.usuarios];
    
    // Filtrar por nome
    if (filtros.nome && filtros.nome.trim() !== '') {
      const termoBusca = filtros.nome.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.nome?.toLowerCase().includes(termoBusca)
      );
      console.log('Após filtro de nome:', usuariosFiltrados.length);
    }
    
    // Filtrar por email
    if (filtros.email && filtros.email.trim() !== '') {
      const termoBusca = filtros.email.toLowerCase().trim();
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.email?.toLowerCase().includes(termoBusca)
      );
      console.log('Após filtro de email:', usuariosFiltrados.length);
    }
    
    // Filtrar por status
    if (filtros.status) {
      const statusValue = filtros.status;
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.status === statusValue
      );
      console.log('Após filtro de status:', usuariosFiltrados.length);
    }
    
    // Filtrar por setor
    if (filtros.setor) {
      const setorId = filtros.setor.toString();
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.setor?.toString() === setorId
      );
      console.log('Após filtro de setor:', usuariosFiltrados.length, 'ID Setor:', setorId);
    }
    
    // Filtrar por função (se um setor estiver selecionado)
    if (filtros.funcao) {
      const funcaoId = filtros.funcao.toString();
      
      console.log('Filtrando por função ID:', funcaoId);
      console.log('Usuários antes do filtro:', usuariosFiltrados.length);
      
      // Mostrar IDs de função dos usuários para debug
      usuariosFiltrados.forEach(u => console.log(`Usuário ${u.nome}: função ID = ${u.funcao?.toString()}`));
      
      usuariosFiltrados = usuariosFiltrados.filter(usuario => {
        const match = usuario.funcao?.toString() === funcaoId;
        console.log(`Comparando ${usuario.funcao?.toString()} com ${funcaoId}: ${match}`);
        return match;
      });
      
      console.log('Após filtro de função:', usuariosFiltrados.length);
    }
    
    this.usuariosFiltrados = usuariosFiltrados;
  }
  
  /**
   * Limpa os filtros e restaura a lista completa
   */
  limparFiltros() {
    this.usuariosFiltrados = [...this.usuarios];
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

  // Removed duplicate carregarUsuarios method to resolve the error.

  excluirUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluirUsuario(id).subscribe({
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