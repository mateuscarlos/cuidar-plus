import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-pacientes.component.html',
  styleUrls: ['./cadastro-pacientes.component.scss']
})
export class CadastroPacientesComponent {
  paciente: Paciente = {
    id: 0, // Inicialize com um valor padrão
    nome_completo: '',
    cpf: '',
    operadora: '',
    cid_primario: '',
    cep: '',
    rua: '',
    numero: 0, // Inicialize com um valor padrão do tipo number
    complemento: '',
    cidade: '',
    estado: '',
    updated_at: '' // Inicialize com um valor padrão
  };

  constructor(public pacienteService: PacienteService, public router: Router) {}

  buscarEndereco(): void {
    if (this.paciente.cep.length === 8) {
      this.pacienteService.buscarEndereco(this.paciente.cep).subscribe(
        (data) => {
          this.paciente.rua = data.logradouro;
          this.paciente.cidade = data.localidade;
          this.paciente.estado = data.uf;
        },
        (error) => {
          console.error('Erro ao buscar endereço:', error);
        }
      );
    }
  }

  cadastrarPaciente(): void {
    this.pacienteService.criarPaciente(this.paciente).subscribe(
      () => {
        alert('Paciente cadastrado com sucesso!');
        this.router.navigate(['/pacientes']);
      },
      (error) => {
        console.error('Erro ao cadastrar paciente:', error);
      }
    );
  }
}