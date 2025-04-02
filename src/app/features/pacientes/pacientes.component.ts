import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteAvatarComponent } from '../../shared/components/paciente-avatar/paciente-avatar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, PacienteAvatarComponent, StatusBadgeComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  constructor(private router: Router) {}
  
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