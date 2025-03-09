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
    id: 0,
    nome_completo: '',
    cpf: '',
    operadora: '',
    identificador_prestadora: '',
    acomodacao: '',
    telefone: '',
    alergias: '',
    cid_primario: '',
    cid_secundario: '',
    data_nascimento: '',
    rua: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
    created_at: '',
    updated_at: '',
    status: 'em-avaliacao' // Adiciona o campo de status
  };

  constructor(public pacienteService: PacienteService, public router: Router) {}

  buscarEndereco(): void {
    if (this.paciente.cep.length === 8) {
      this.pacienteService.buscarEndereco(this.paciente.cep).subscribe({
        next: (data) => {
          this.paciente.rua = data.logradouro;
          this.paciente.bairro = data.bairro;
          this.paciente.cidade = data.localidade;
          this.paciente.estado = data.uf;
        },
        error: (error) => {
          console.error('Erro ao buscar endereço:', error);
        }
      });
    }
  }

  cadastrarPaciente(): void {
    console.log('Paciente:', this.paciente); // Adiciona este log para verificar o objeto paciente

    if (this.validarCamposObrigatorios()) {
      this.pacienteService.criarPaciente(this.paciente).subscribe({
        next: () => {
          alert('Paciente cadastrado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar paciente:', error);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  validarCamposObrigatorios(): boolean {
    return this.paciente.nome_completo !== '' &&
           this.paciente.cpf !== '' &&
           this.paciente.operadora !== '' &&
           this.paciente.identificador_prestadora !== '' &&
           this.paciente.acomodacao !== '' &&
           this.paciente.telefone !== '' &&
           this.paciente.cid_primario !== '' &&
           this.paciente.data_nascimento !== '' &&
           this.paciente.cep !== '' &&
           this.paciente.bairro !== '' &&
           this.paciente.cidade !== '' &&
           this.paciente.estado !== '';
  }

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}



