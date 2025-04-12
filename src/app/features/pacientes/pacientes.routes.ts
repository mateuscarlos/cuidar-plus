import { Routes } from '@angular/router';
import { PacientesComponent } from './pacientes.component';
import { PacientesListComponent } from './pacientes-list/pacientes-list.component';
import { CadastrarPacienteComponent } from './cadastrar-paciente/cadastrar-paciente.component';
import { EditarPacientesComponent } from './editar-pacientes/editar-pacientes.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';
import { CriarAcompanhamentoPacienteComponent } from './criar-acompanhamento-paciente/criar-acompanhamento-paciente.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PacienteBuscaAvancadaComponent } from './paciente-busca-avancada/paciente-busca-avancada.component';
import { BuscaPacienteComponent } from './busca-paciente/busca-paciente.component';

/**
 * Rotas para o módulo de Pacientes
 */
export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    component: PacientesComponent,
    title: 'Pacientes - Página Inicial'
  },
  {
    path: 'lista',
    component: PacientesListComponent,
    title: 'Lista de Pacientes'
  },
  {
    path: 'criar',
    component: CadastrarPacienteComponent,
    title: 'Cadastrar Novo Paciente'
  },
  {
    path: 'editar',
    component: EditarPacientesComponent,
    title: 'Selecionar Paciente para Edição'
  },
  {
    path: 'editar/:id',
    component: EditarPacientesComponent,
    title: 'Editar Paciente'
  },
  {
    path: 'visualizar',
    component: VisualizarPacienteComponent,
    title: 'Visualizar Paciente'
  },
  {
    path: 'visualizar/:id',
    component: VisualizarPacienteComponent,
    title: 'Detalhes do Paciente'
  },
  {
    path: 'acompanhamento',
    component: CriarAcompanhamentoPacienteComponent,
    title: 'Acompanhamento de Paciente'
  },
  {
    path: 'busca',
    component: PacienteBuscaAvancadaComponent,
    title: 'Busca de Pacientes - Cuidar+'
  }
];