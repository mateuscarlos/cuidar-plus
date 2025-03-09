import { Routes } from '@angular/router';
import { HomeComponent } from './components/screen/home/home.component';
import { UsuariosComponent } from './components/screen/usuarios/usuarios.component';
import { CadastroUsuariosComponent } from './components/screen/cadastro-usuarios/cadastro-usuarios.component';
import { PacientesComponent } from './components/screen/pacientes/pacientes.component';
import { FarmaciaComponent } from './components/screen/farmacia/farmacia.component';
import { RelatoriosComponent } from './components/screen/relatorios/relatorios.component';
import { CadastroPacientesComponent } from './components/screen/cadastro-pacientes/cadastro-pacientes.component';
import { AcompanhaPacienteComponent } from './components/screen/acompanha-paciente/acompanha-paciente.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona para a home
  { path: 'home', component: HomeComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'cadastro-usuarios', component: CadastroUsuariosComponent },
  { path: 'cadastro-pacientes', component: CadastroPacientesComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'acompanha-paciente', component: AcompanhaPacienteComponent },
  { path: 'farmacia', component: FarmaciaComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: '**', redirectTo: '/home' } // Redireciona para a home em caso de rota não encontrada
];