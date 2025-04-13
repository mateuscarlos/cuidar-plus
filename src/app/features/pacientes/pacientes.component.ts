import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from './services/paciente.service';
import { NotificacaoService } from '../../shared/services/notificacao.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  totalPacientes: number = 0;
  totalAtivos: number = 0;
  totalEmAvaliacao: number = 0;
  totalInativos: number = 0;
  isLoading: boolean = true;

  constructor(
    private router: Router, 
    private pacienteService: PacienteService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.isLoading = true;
    
    this.pacienteService.listarTodosPacientes()
      .pipe(
        map(pacientes => {
          this.totalPacientes = pacientes.length;
          this.totalAtivos = pacientes.filter(p => p.status === 'Ativo').length;
          this.totalEmAvaliacao = pacientes.filter(p => p.status === 'Em Avaliação').length;
          this.totalInativos = pacientes.filter(p => p.status === 'Inativo').length;
          this.isLoading = false;
        }),
        catchError(error => {
          console.error('Erro ao carregar estatísticas:', error);
          this.notificacaoService.mostrarErro('Erro ao carregar estatísticas de pacientes.');
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe();
  }

  navegarParaLista(): void {
    this.router.navigate(['/pacientes/lista']);
  }
  
  navegarParaCadastro(): void {
    this.router.navigate(['/pacientes/criar']);
  }
  
  navegarParaBusca(): void {
    this.router.navigate(['/pacientes/busca']);
  }
  
  navegarParaAcompanhamento(): void {
    this.router.navigate(['/pacientes/acompanhamento']);
  }
}