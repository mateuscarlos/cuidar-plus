import { Routes } from '@angular/router';
import { PacientesComponent } from './pacientes.component';
import { CadastrarPacienteComponent } from './cadastrar-paciente/cadastrar-paciente.component';

export const PACIENTES_ROUTES: Routes = [
  { path: '', component: PacientesComponent },
  { path: 'cadastrar', component: CadastrarPacienteComponent }
];