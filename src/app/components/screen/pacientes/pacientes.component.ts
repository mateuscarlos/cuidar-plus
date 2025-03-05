import { Component, OnInit } from '@angular/core';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalBuscaPacienteComponent } from '../../modal/modal-busca-paciente/modal-busca-paciente.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, MatDialogModule, HttpClientModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  mensagemBusca: string = '';

  constructor(private pacienteService: PacienteService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (data: { pacientes: Paciente[] }) => { // Ajuste o tipo da resposta aqui
        this.pacientes = data.pacientes; // Acesse a chave 'pacientes' corretamente
        this.mensagemBusca = '';
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
    this.router.navigate(['/acompanha-paciente', id]);
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
      width: '50%' // Ajuste o tamanho do modal conforme necessário
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Paciente encontrado:', result);
        // Atualizar a lista de pacientes com o resultado da busca
        this.pacientes = [result];
        this.mensagemBusca = '';
      } else {
        console.log('O modal de busca foi fechado sem resultado');
        this.pacientes = [];
        this.mensagemBusca = 'Nenhum paciente foi encontrado com esse critério, tente novamente';
      }
    });
  }

  listarPacientes(): void {
    this.carregarPacientes();
  }
}