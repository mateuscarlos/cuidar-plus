import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { Paciente, StatusPaciente } from '../models/paciente.model';
import { PacienteAvatarComponent } from '../../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
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
    FormsModule,
    PacienteAvatarComponent, 
    StatusBadgeComponent
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
    private pacienteService: PacienteService,
    private router: Router,
    private dateFormatter: DateFormatterService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.error = null;
    
    this.pacienteService.listarTodosPacientes()
      .pipe(
        tap(pacientes => {
          this.pacientes = pacientes;
          this.totalPacientes = pacientes.length;
          this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
          this.aplicarFiltrosLocais();
        }),
        catchError(error => {
          console.error('Erro ao carregar pacientes:', error);
          this.error = 'Não foi possível carregar a lista de pacientes. Por favor, tente novamente mais tarde.';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  aplicarFiltrosLocais(): void {
    let filtered = [...this.pacientes];
    
    // Aplicar filtro de texto (nome, CPF ou ID)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.nome_completo?.toLowerCase().includes(term)) || 
        (p.cpf?.toLowerCase().includes(term)) ||
        (p.id?.toString().includes(term))
      );
    }
    
    // Aplicar filtro de status
    if (this.statusFiltro) {
      filtered = filtered.filter(p => p.status === this.statusFiltro);
    }
    
    // Ordenar
    filtered = this.ordenarPacientes(filtered);
    
    // Aplicar paginação
    this.totalPacientes = filtered.length;
    this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
    
    // Atualizar resultados
    this.filteredPacientes = this.aplicarPaginacao(filtered);
  }
  
  aplicarPaginacao(lista: Paciente[]): Paciente[] {
    const inicio = (this.currentPage - 1) * this.pageSize;
    const fim = inicio + this.pageSize;
    return lista.slice(inicio, fim);
  }

  ordenarPacientes(pacientes: Paciente[]): Paciente[] {
    return [...pacientes].sort((a, b) => {
      let valueA = a[this.sortBy as keyof Paciente];
      let valueB = b[this.sortBy as keyof Paciente];
      
      // Tratamento especial para datas
      if (this.sortBy === 'data_nascimento' || this.sortBy === 'created_at' || this.sortBy === 'updated_at') {
        valueA = new Date(valueA as string).getTime();
        valueB = new Date(valueB as string).getTime();
      }
      
      if (valueA === valueB) return 0;
      
      // Ordenar em ordem ascendente ou descendente
      const comparison = (valueA ?? '') < (valueB ?? '') ? -1 : 1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  toggleSort(campo: string): void {
    if (this.sortBy === campo) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = campo;
      this.sortDirection = 'asc';
    }
    this.aplicarFiltrosLocais();
  }

  limparFiltros(): void {
    this.searchTerm = '';
    this.statusFiltro = '';
    this.currentPage = 1;
    this.aplicarFiltrosLocais();
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.aplicarFiltrosLocais();
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.aplicarFiltrosLocais();
    }
  }

  visualizarPaciente(id: number): void {
    if (id) {
      this.router.navigate(['/pacientes/visualizar', id]);
    }
  }

  editarPaciente(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (id) {
      this.router.navigate(['/pacientes/editar', id]);
    }
  }

  cadastrarNovoPaciente(): void {
    this.router.navigate(['/pacientes/criar']);
  }

  formatarData(data: string | Date | undefined): string {
    if (!data) return 'N/A';
    return this.dateFormatter.toBackendFormat(data);
  }
  
  getStatusOptions(): string[] {
    return Object.values(StatusPaciente);
  }
}