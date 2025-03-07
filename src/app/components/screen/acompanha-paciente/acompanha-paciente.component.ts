import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acompanha-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acompanha-paciente.component.html',
  styleUrls: ['./acompanha-paciente.component.scss']
})
export class AcompanhaPacienteComponent implements OnInit {
  pacienteId?: number; 
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
    status: '',
  };

  constructor(private route: ActivatedRoute, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId = +id;
      this.buscarPaciente();
    }
  }

  buscarPaciente(): void {
    if (this.pacienteId) {
      this.pacienteService.buscarPaciente('id', this.pacienteId.toString()).subscribe(
        (data) => {
          this.paciente = data;
        },
        (error) => {
          console.error('Erro ao buscar paciente:', error);
        }
      );
    }
  }
}