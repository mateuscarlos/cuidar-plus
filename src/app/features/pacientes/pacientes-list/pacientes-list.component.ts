import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { PacienteAvatarComponent } from '../../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FormsModule } from '@angular/forms';
import { DateFormatterService } from '../../../core/services/date-formatter.service';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PacienteAvatarComponent, 
    StatusBadgeComponent,
    FormsModule
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

  constructor(
    private router: Router, 
    private pacienteService: PacienteService,
    private dateFormatter: DateFormatterService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  /**
   * Carrega a lista de pacientes do serviço
   */
  carregarPacientes(): void {
    this.pacienteService.listarTodosPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
      },
      error: () => {
        this.notificacaoService.mostrarErro('Erro ao carregar pacientes. Tente novamente.');
      }
    });
  }

  /**
   * Aplica os filtros de busca e status à lista de pacientes
   */
  aplicarFiltros(): void {
    // Primeiro filtra por termo de busca
    let pacientesFiltrados = this.pacientes;
    
    if (this.searchTerm) {
      const termo = this.searchTerm.toLowerCase();
      pacientesFiltrados = pacientesFiltrados.filter(p => 
        p.nome_completo?.toLowerCase().includes(termo) || 
        p.cpf?.toLowerCase().includes(termo)
      );
    }
    
    // Depois filtra por status, se aplicável
    if (this.statusFiltro) {
      pacientesFiltrados = pacientesFiltrados.filter(p => 
        p.status === this.statusFiltro
      );
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
   * Manipula a busca de pacientes
   */
  onSearch(): void {
    this.currentPage = 1; // Volta para a primeira página ao realizar uma busca
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
    this.router.navigate(['/pacientes/cadastrar']);
  }
  
  /**
   * Navegar para tela de edição de paciente
   */
  editarPaciente(pacienteId: number | string, event: Event): void {
    event.stopPropagation(); // Evita que o evento propague para o clique da linha
    this.router.navigate(['/pacientes/editar', pacienteId]);
  }
  
  /**
   * Formata a data para exibição
   */
  formatarData(data?: string): string {
    if (!data) return 'N/A';
  return this.dateFormatter.formatarDataParaFormulario(data, 'data_nascimento');
}

  /**
   * Excluir paciente
   */
  excluirPaciente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      this.pacienteService.excluirPaciente(id).subscribe({
        next: () => {
          this.notificacaoService.mostrarSucesso('Paciente excluído com sucesso!');
          this.carregarPacientes();
        },
        error: () => {
          this.notificacaoService.mostrarErro('Erro ao excluir paciente. Tente novamente.');
        }
      });
    }
  }
}