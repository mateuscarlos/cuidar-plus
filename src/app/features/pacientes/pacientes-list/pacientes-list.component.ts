import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { PacienteAvatarComponent } from '../../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FormsModule } from '@angular/forms';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificacaoService } from '../../../shared/services/notificacao.service';
import { PacienteBuscaComponent } from '../paciente-busca/paciente-busca.component';
import { StatusStyleService } from '../../../../styles/status-style.service';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PacienteAvatarComponent, 
    StatusBadgeComponent,
    FormsModule,
    PacienteBuscaComponent
  ],
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.scss']
})
export class PacientesListComponent implements OnInit {
  pacientes: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = '';
  statusFiltro: string = '';
  sortBy: string = 'nome_completo';
  sortDirection: 'asc' | 'desc' = 'asc';
  totalPacientes: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  
  // Adicionar a referência ao enum StatusPaciente
  statusPaciente = Object.values(StatusPaciente);

  constructor(
    private router: Router, 
    private pacienteService: PacienteService,
    private dateFormatter: DateFormatterService,
    private notificacaoService: NotificacaoService,
    public statusStyleService: StatusStyleService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  /**
   * Carrega a lista de pacientes do serviço
   */
  carregarPacientes(): void {
    this.isLoading = true;
    this.pacienteService.listarTodosPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.aplicarFiltros(); // Processa os pacientes
        this.isLoading = false;
      },
      error: () => {
        this.notificacaoService.mostrarErro('Erro ao carregar pacientes. Tente novamente.');
        this.isLoading = false;
        this.error = 'Erro ao carregar pacientes. Por favor, tente novamente mais tarde.';
      }
    });
  }

  /**
   * Aplica os filtros recebidos do componente de busca
   */
  aplicarFiltros(filtros: any = {}): void {
    // Primeiro filtra por termo de busca
    let pacientesFiltrados = this.pacientes;
    
    if (filtros) {
      // Filtra por nome
      if (filtros.nome) {
        const termo = filtros.nome.toLowerCase();
        pacientesFiltrados = pacientesFiltrados.filter(p => 
          p.nome_completo?.toLowerCase().includes(termo)
        );
      }
      
      // Filtra por CPF
      if (filtros.cpf) {
        const termo = filtros.cpf.toLowerCase().replace(/\D/g, ''); // Remove não dígitos
        pacientesFiltrados = pacientesFiltrados.filter(p => 
          p.cpf?.toLowerCase().replace(/\D/g, '').includes(termo)
        );
      }
      
      // Filtra por status
      if (filtros.status) {
        pacientesFiltrados = pacientesFiltrados.filter(p => 
          p.status === filtros.status
        );
      }
    }
    
    // Aplica ordenação
    pacientesFiltrados = this.ordenarPacientes(pacientesFiltrados);
    
    // Atualiza contadores
    this.totalPacientes = pacientesFiltrados.length;
    this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
    
    // Aplica paginação
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredPacientes = pacientesFiltrados.slice(startIndex, startIndex + this.pageSize);
  }
  
  /**
   * Ordena a lista de pacientes com base nos critérios atuais
   */
  ordenarPacientes(pacientes: Paciente[]): Paciente[] {
    return [...pacientes].sort((a, b) => {
      let valorA: any;
      let valorB: any;
      
      // Determina os valores a serem comparados com base no critério de ordenação
      switch(this.sortBy) {
        case 'nome_completo':
          valorA = a.nome_completo?.toLowerCase() || '';
          valorB = b.nome_completo?.toLowerCase() || '';
          break;
        case 'data_nascimento':
          valorA = new Date(a.data_nascimento || '');
          valorB = new Date(b.data_nascimento || '');
          break;
        case 'updated_at':
          valorA = new Date(a.updated_at || '');
          valorB = new Date(b.updated_at || '');
          break;
        default:
          valorA = a[this.sortBy as keyof Paciente];
          valorB = b[this.sortBy as keyof Paciente];
      }
      
      // Aplica a direção de ordenação
      if (valorA < valorB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  /**
   * Manipula mudança na ordenação da tabela
   */
  toggleSort(coluna: string): void {
    if (this.sortBy === coluna) {
      // Se já estamos ordenando por esta coluna, mude a direção
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Caso contrário, mude a coluna e volte para a ordenação padrão
      this.sortBy = coluna;
      this.sortDirection = 'asc';
    }
    
    this.aplicarFiltros();
  }
  
  /**
   * Limpar todos os filtros
   */
  limparFiltros(): void {
    this.searchTerm = '';
    this.statusFiltro = '';
    this.currentPage = 1;
    this.sortBy = 'nome_completo';
    this.sortDirection = 'asc';
    this.aplicarFiltros();
  }
  
  /**
   * Navega para o próximo conjunto de resultados
   */
  proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.aplicarFiltros();
    }
  }
  
  /**
   * Navega para o conjunto anterior de resultados
   */
  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.aplicarFiltros();
    }
  }
  
  /**
   * Visualizar detalhes do paciente selecionado
   */
  visualizarPaciente(pacienteId: number | string): void {
    this.router.navigate(['/pacientes/visualizar', pacienteId]);
  }

  /**
   * Navegar para tela de cadastro de paciente
   */
  cadastrarNovoPaciente(): void {
    this.router.navigate(['/pacientes/criar']);
  }
  
  /**
   * Navegar para tela de edição de paciente
   */
  editarPaciente(pacienteId: number | string, event: Event): void {
    event.stopPropagation(); // Evita que o evento propague para o clique da linha
    this.router.navigate(['/pacientes/editar/', pacienteId]);
  }
  
  /**
   * Formata a data para exibição
   */
  formatarData(data?: string): string {
    if (!data) return 'N/A';
    return this.dateFormatter.formatarDataParaFormulario(data, 'data_nascimento');
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
}