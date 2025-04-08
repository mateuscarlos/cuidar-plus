import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';
import { Usuario, UserStatus } from '../models/user.model';
import { UserStatusStyleService } from '../services/user-status-style.service';
import { SetoresFuncoesService } from '../services/setor-funcoes.service';
import { Setor } from '../models/setor.model';
import { Funcao } from '../models/funcao.model';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  // Mapas para armazenar relações ID -> Nome
  setoresMap: Map<string, string> = new Map<string, string>();
  funcoesMap: Map<string, string> = new Map<string, string>();
  
  // Disponibilizamos o enum para o template
  userStatusEnum = UserStatus;

  constructor(
    private usuarioService: UsuarioService,
    private userStatusStyle: UserStatusStyleService,
    private setoresFuncoesService: SetoresFuncoesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDados();
  }
  
  ngAfterViewInit() {
    // Inicializa os tooltips Bootstrap
    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }, 500);
  }
  
  carregarDados() {
    this.isLoading = true;
    
    // Usar forkJoin para carregar setores, funções e usuários em paralelo
    forkJoin({
      setores: this.setoresFuncoesService.getSetores(),
      funcoes: this.setoresFuncoesService.getFuncoes(),
      usuarios: this.usuarioService.listarTodos()
    }).subscribe({
      next: (resultado) => {
        // Armazenar setores em um mapa para acesso rápido
        resultado.setores.forEach(setor => {
          this.setoresMap.set(setor.id.toString(), setor.nome);
        });
        
        // Armazenar funções em um mapa para acesso rápido
        resultado.funcoes.forEach(funcao => {
          this.funcoesMap.set(funcao.id.toString(), funcao.nome);
        });
        
        // Processar dados dos usuários
        this.usuarios = resultado.usuarios.map(user => ({
          ...user,
          cpf: user.cpf || '',
          status: user.status || 'Inativo', // Garantir que o status definido no backend seja usado
          setorNome: this.getNomeSetor(user.setor),
          funcaoNome: this.getNomeFuncao(user.funcao)
        }));
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.error = 'Erro ao carregar dados. Por favor, tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }
  
  // Método para obter a classe da badge de status
  getStatusClass(usuario: Usuario): string {
    return this.userStatusStyle.getBadgeClass(usuario.status || 'Inativo');
  }
  
  // Método para obter o ícone do status
  getStatusIcon(usuario: Usuario): string {
    return this.userStatusStyle.getIcon(usuario.status || 'Inativo');
  }
  
  // Método para obter a classe de texto do status
  getStatusTextClass(usuario: Usuario): string {
    return this.userStatusStyle.getTextClass(usuario.status || 'Inativo');
  }
  
  // Método para obter a classe de fundo do status
  getStatusBgClass(usuario: Usuario): string {
    return this.userStatusStyle.getBgClass(usuario.status || 'Inativo');
  }
  
  // Verifica se o usuário está ativo
  isUsuarioAtivo(usuario: Usuario): boolean {
    return usuario.status === UserStatus.ATIVO;
  }
  
  // Obter texto para tooltip com detalhes do status
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
  
  // Métodos para navegação
  navegarParaVisualizacao(id: string) {
    this.router.navigate([`/usuarios/${id}`]);
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/usuarios/cadastro']);
  }
  
  // Métodos para obter nomes a partir de IDs, agora usando os mapas
  getNomeFuncao(funcaoId: string | undefined): string {
    if (!funcaoId) return 'Não definido';
    return this.funcoesMap.get(funcaoId) || 'Não encontrado';
  }
  
  getNomeSetor(setorId: string | undefined): string {
    if (!setorId) return 'Não definido';
    return this.setoresMap.get(setorId) || 'Não encontrado';
  }
}