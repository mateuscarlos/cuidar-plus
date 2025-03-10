import { Component, OnInit } from '@angular/core';
import { PacienteService, Paciente } from '../../../services/paciente.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common';
import { ModalBuscaPacienteComponent } from '../../modal/modal-busca-paciente/modal-busca-paciente.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicionar FormsModule aqui
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  filtroNome: string = '';

  constructor(private pacienteService: PacienteService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (data: { pacientes: Paciente[] }) => {
        this.pacientes = data.pacientes;
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );
  }

  abrirModalBusca(): void {
    const dialogRef = this.dialog.open(ModalBuscaPacienteComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Paciente encontrado:', result);
        this.pacientes = result.pacientes;
      } else {
        console.log('O modal de busca foi fechado sem resultado');
        this.pacientes = [];
      }
    });
  }

  acompanharPaciente(id: number): void {
    this.pacienteService.getPacienteById(id).subscribe(
      (data: { paciente: Paciente }) => {
        const paciente = data.paciente;
        this.router.navigate(['/acompanha-paciente', id], { state: { paciente } });
      },
      (error) => {
        console.error('Erro ao carregar paciente:', error);
      }
    );
  }

  navegarPara(destino: string): void {
    this.router.navigate([`/${destino}`]);
  }
}