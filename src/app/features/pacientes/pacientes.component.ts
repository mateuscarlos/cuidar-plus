import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteAvatarComponent } from '../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PacienteService } from './services/paciente.service';
import { Paciente } from './models/paciente.model';
import { BuscaPacienteComponent } from './busca-paciente/busca-paciente.component';
import { ResultadoBusca } from './models/busca-paciente.model';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, PacienteAvatarComponent, StatusBadgeComponent, BuscaPacienteComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = true;
  error: string | null = null;
  buscaRealizada = false;

  constructor(private router: Router, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.isLoading = true;
    this.pacienteService.listarTodosPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar pacientes.';
        this.isLoading = false;
      }
    });
  }
  
  // Método para lidar com o resultado da busca
  buscarPaciente(resultado: ResultadoBusca): void {
    this.isLoading = true;
    this.buscaRealizada = true;
    
    this.pacienteService.buscarPacientes(resultado).subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar pacientes.';
        this.isLoading = false;
      }
    });
  }
  
  // Método para resetar a busca e mostrar todos os pacientes
  resetarBusca(): void {
    this.buscaRealizada = false;
    this.carregarPacientes();
  }
  
  // Métodos para navegação
  cadastrarNovoPaciente(): void {
    this.router.navigate(['/pacientes/cadastrar']);
  }
  
  editarPaciente(pacienteId: string): void {
    this.router.navigate(['/pacientes/editar'], { 
      queryParams: { pacienteId }
    });
  }
  
  acompanharPaciente(pacienteId: string): void {
    this.router.navigate(['/pacientes/acompanhamento'], { 
      queryParams: { pacienteId }
    });
  }
  
  visualizarPaciente(pacienteId: string): void {
    this.router.navigate(['/pacientes/visualizar'], {
      queryParams: { pacienteId }
    });
  }
}