import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
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