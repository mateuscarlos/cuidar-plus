import { Routes } from '@angular/router';
import { PacientesComponent } from './pacientes.component';
import { PacientesListComponent } from './pacientes-list/pacientes-list.component';
import { CadastrarPacienteComponent } from './cadastrar-paciente/cadastrar-paciente.component';
import { EditarPacientesComponent } from './editar-pacientes/editar-pacientes.component';
import { VisualizarPacienteComponent } from './visualizar-paciente/visualizar-paciente.component';
import { CriarAcompanhamentoPacienteComponent } from './criar-acompanhamento-paciente/criar-acompanhamento-paciente.component';
import { PacienteBuscaPageComponent } from './paciente-busca-page/paciente-busca-page.component';
import { AuthGuard } from '../../core/guards/auth.guard';

/**
 * Rotas para o módulo de Pacientes
 */
export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    component: PacientesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista',
    component: PacientesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'busca',
    component: PacienteBuscaPageComponent, // Usando o novo componente de busca
    canActivate: [AuthGuard]
  },
  {
    path: 'criar',
    component: CadastrarPacienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar/:id',
    component: EditarPacientesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'visualizar/:id',
    component: VisualizarPacienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'acompanhamento',
    component: CriarAcompanhamentoPacienteComponent,
    canActivate: [AuthGuard]
  }
];