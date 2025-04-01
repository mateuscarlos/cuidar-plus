import { Routes } from '@angular/router';
import { PacientesComponent } from './pacientes.component';
import { CadastrarPacienteComponent } from './cadastrar-paciente/cadastrar-paciente.component';
import { EditarPacienteComponent } from './editar-paciente/editar-paciente.component';
import { AcompanhamentoPacienteComponent } from './criar-acompanhamento-paciente/criar-acompanhamento-paciente.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';

export const PACIENTES_ROUTES: Routes = [
  { 
    path: '', 
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
    component: EditarPacienteComponent,
    title: 'Editar Paciente - Cuidar+'
  },
  { 
    path: 'acompanhamento', 
    component: AcompanhamentoPacienteComponent,
    title: 'Acompanhamento de Paciente - Cuidar+'
  },
  { 
    path: 'visualizar', 
    component: VisualizarPacienteComponent,
    title: 'Visualizar Paciente - Cuidar+'
  }
];