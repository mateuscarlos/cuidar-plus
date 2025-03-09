import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService, Paciente } from '../../../services/paciente.service';

@Component({
  selector: 'app-modal-busca-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './modal-busca-paciente.component.html',
  styleUrls: ['./modal-busca-paciente.component.scss']
})
export class ModalBuscaPacienteComponent {
  campoBusca: string = 'id';
  valorBusca: string = '';
  labelValorBusca: string = 'Matrícula do Paciente';

  constructor(
    public dialogRef: MatDialogRef<ModalBuscaPacienteComponent>,
    private pacienteService: PacienteService
  ) {}

  onCampoBuscaChange() {
    switch (this.campoBusca) {
      case 'id':
        this.labelValorBusca = 'Digite a matrícula do Paciente';
        break;
      case 'nome_completo':
        this.labelValorBusca = 'Digite o nome do Paciente';
        break;
      case 'cpf':
        this.labelValorBusca = 'Digite o CPF do Paciente';
        break;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  buscarPaciente(): void {
    this.pacienteService.buscarPaciente(this.campoBusca, this.valorBusca).subscribe(
      (response: Paciente) => {
        console.log('Paciente encontrado:', response);
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Erro ao buscar paciente:', error);
        this.dialogRef.close(null);
      }
    );
  }
}