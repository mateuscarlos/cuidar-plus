import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - Cuidar+'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Home - Cuidar+'
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./features/pacientes/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/cadastrar',
    loadComponent: () => import('./features/pacientes/cadastrar-paciente/cadastrar-paciente.component').then(m => m.CadastrarPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/editar',
    loadComponent: () => import('./features/pacientes/editar-paciente/editar-paciente.component').then(m => m.EditarPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/visualizar',
    loadComponent: () => import('./features/pacientes/visualizar-paciente/visualizar-paciente.component').then(m => m.VisualizarPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes/acompanhamento',
    loadComponent: () => import('./features/pacientes/criar-acompanhamento-paciente/criar-acompanhamento-paciente.component').then(m => m.CriarAcompanhamentoPacienteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    loadComponent: () => import('./features/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'farmacia',
    loadComponent: () => import('./features/farmacia/farmacia.component').then(m => m.FarmaciaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./features/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
