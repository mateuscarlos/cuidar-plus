import { Routes } from '@angular/router';
import { PacientesComponent } from './pacientes.component';
import { CadastrarPacienteComponent } from './cadastrar-paciente/cadastrar-paciente.component';
import { EditarPacientesComponent } from './editar-pacientes/editar-pacientes.component';
import { CriarAcompanhamentoPacienteComponent } from './criar-acompanhamento-paciente/criar-acompanhamento-paciente.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';


export const PACIENTES_ROUTES: Routes = [
  { 
    path: 'pacientes', 
    component: PacientesComponent,
    title: 'Pacientes - Cuidar+'
  },
  { 
    path: 'cadastrar', 
    component: CadastrarPacienteComponent,
    title: 'Cadastrar Paciente - Cuidar+'
  },
  { 
    path: 'editar', 
    component: EditarPacientesComponent,
    title: 'Editar Paciente - Cuidar+'
  },
  { 
    path: 'acompanhamento', 
    component: CriarAcompanhamentoPacienteComponent,
    title: 'Acompanhamento de Paciente - Cuidar+'
  },
  { 
    path: 'visualizar', 
    component: VisualizarPacienteComponent,
    title: 'Visualizar Paciente - Cuidar+'
  },
  {
    path: 'visualizar/:id',
    component: VisualizarPacienteComponent,
    title: 'Visualizar Paciente - Cuidar+'
  },
  { path: 'pacientes/editar/:id', 
    component: EditarPacientesComponent, 
    title: 'Editar Paciente - Cuidar+'
  }

];