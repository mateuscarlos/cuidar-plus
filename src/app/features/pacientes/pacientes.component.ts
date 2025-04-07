import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteAvatarComponent } from '../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PacienteService } from './services/paciente.service';
import { Paciente } from './models/paciente.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, PacienteAvatarComponent, StatusBadgeComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private router: Router, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.pacienteService.listarTodosPacientes()
      .pipe(
        map(pacientes => {
          // Garantir que nome está disponível para os componentes que o usam
          return pacientes.map(p => ({
            ...p,
            nome: p.nome_completo // Adiciona nome como alias para nome_completo
          }));
        })
      )
      .subscribe({
        next: (pacientes) => {
          this.pacientes = pacientes;
          console.log('Pacientes carregados:', this.pacientes);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar pacientes:', err);
          this.error = 'Erro ao carregar pacientes.';
          this.isLoading = false;
        }
      });
  }
  
  // Métodos para navegação
  cadastrarNovoPaciente(): void {
    this.router.navigate(['/pacientes/cadastrar']);
  }
  
  // Novo método para navegar ao clicar no paciente
  selecionarPaciente(pacienteId: string): void {
    this.router.navigate(['/pacientes/visualizar'], {
      queryParams: { pacienteId }
    });
  }
}