import { Routes } from '@angular/router';
import { HomeComponent } from './components/screen/home/home.component';
import { UsuariosComponent } from './components/screen/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona para a home
  { path: 'home', component: HomeComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'cadastro-usuarios', loadComponent: () => import('./components/screen/cadastro-usuarios/cadastro-usuarios.component').then(m => m.CadastroUsuariosComponent) },
  { path: 'cadastro-pacientes', loadComponent: () => import('./components/screen/cadastro-pacientes/cadastro-pacientes.component').then(m => m.CadastroPacientesComponent) },
  { path: 'pacientes', loadComponent: () => import('./components/screen/pacientes/pacientes.component').then(m => m.PacientesComponent) },
  { path: 'acompanha-paciente', loadComponent: () => import('./components/screen/acompanha-paciente/acompanha-paciente.component').then(m => m.AcompanhaPacienteComponent) },
  { path: 'farmacia', loadComponent: () => import('./components/screen/farmacia/farmacia.component').then(m => m.FarmaciaComponent) },
  { path: 'relatorios', loadComponent: () => import('./components/screen/relatorios/relatorios.component').then(m => m.RelatoriosComponent) },
  {
    path: 'feature',
    loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent)
  },
  { path: '**', redirectTo: '/home' } // Redireciona para a home em caso de rota não encontrada
];