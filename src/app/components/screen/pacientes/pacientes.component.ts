import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-center mb-4">Bem-vindo à Gestão de Pacientes</h2>
    <section class="row justify-content-center text-center">
      <article class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <header class="card-header">
            <h2 class="card-title text-danger">Cadastro de Pacientes</h2>
          </header>
          <div class="card-body">
            <p class="card-text">Realize o cadastro de novos pacientes no sistema.</p>
            <button class="btn btn-danger">Acessar</button>
          </div>
        </div>
      </article>
    </section>
  `,
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: any[] = [];

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (data) => {
        this.pacientes = data;
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );
  }
}