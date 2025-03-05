import { Component, OnInit } from '@angular/core';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalBuscaPacienteComponent } from '../../modal/modal-busca-paciente/modal-busca-paciente.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];

  constructor(private pacienteService: PacienteService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (data: Paciente[]) => {
        this.pacientes = data;
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/cadastro-pacientes']);
  }

  acompanharPaciente(id: number): void {
    // Implementar lógica de acompanhamento de paciente
    console.log('Acompanhando paciente com ID:', id);
  }

  excluirPaciente(cpf: string): void {
    this.pacienteService.deletarPaciente(cpf).subscribe(
      () => {
        this.pacientes = this.pacientes.filter(paciente => paciente.cpf !== cpf);
        console.log('Paciente excluído com sucesso');
      },
      (error) => {
        console.error('Erro ao excluir paciente:', error);
      }
    );
  }

  abrirModalBusca(): void {
    const dialogRef = this.dialog.open(ModalBuscaPacienteComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal de busca foi fechado');
      // Implementar lógica de busca aqui
    });
  }
}