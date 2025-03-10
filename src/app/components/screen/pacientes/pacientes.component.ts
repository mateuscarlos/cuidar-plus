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
  pacientesFiltrados: Paciente[] = [];
  filtroNome: string = '';
  ordenacao: string = 'nome';
  ordemAscendente: boolean = true;

  constructor(private pacienteService: PacienteService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (data: { pacientes: Paciente[] }) => {
        this.pacientes = data.pacientes;
        this.filtrarPacientes();
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );
  }

  filtrarPacientes(): void {
    this.pacientesFiltrados = this.pacientes.filter(paciente =>
      paciente.nome_completo.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
    this.ordenarPacientes(this.ordenacao);
  }

  ordenarPacientes(coluna: string): void {
    if (this.ordenacao === coluna) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.ordenacao = coluna;
      this.ordemAscendente = true;
    }

    if (this.ordenacao === 'nome') {
      this.pacientesFiltrados.sort((a, b) => this.ordemAscendente ? a.nome_completo.localeCompare(b.nome_completo) : b.nome_completo.localeCompare(a.nome_completo));
    } else if (this.ordenacao === 'atualizacao') {
      this.pacientesFiltrados.sort((a, b) => this.ordemAscendente ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime() : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  }

  abrirModalBusca(): void {
    const dialogRef = this.dialog.open(ModalBuscaPacienteComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Paciente encontrado:', result);
        this.pacientes = [result];
        this.filtrarPacientes();
      } else {
        console.log('O modal de busca foi fechado sem resultado');
        this.pacientes = [];
      }
    });
  }

  acompanharPaciente(id: number): void {
    this.router.navigate(['/acompanha-paciente', id]);
  }

  navegarPara(destino: string): void {
    this.router.navigate([`/${destino}`]);
  }
}