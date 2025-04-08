import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/usuarios/login/login.component';
import { CadastrarUsuarioComponent } from './features/usuarios/cadastrar-usuario/cadastrar-usuario.component';
import { EditarUsuarioComponent } from './features/usuarios/editar-usuario/editar-usuario.component';
import { VisualizarUsuarioComponent } from './features/usuarios/visualizar-usuario/visualizar-usuario.component';
import { SetoresListComponent } from './features/setores/setores-list/setores-list.component';
import { SetoresFormComponent } from './features/setores/setores-form/setores-form.component';
import { FuncoesListComponent } from './features/funcoes/funcoes-list/funcoes-list.component';
import { FuncoesFormComponent } from './features/funcoes/funcoes-form/funcoes-form.component';

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
    loadComponent: () => import('./features/pacientes/editar-pacientes/editar-pacientes.component').then(m => m.EditarPacientesComponent),
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
    path: 'usuarios',
    loadComponent: () => import('./features/usuarios/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent),
    canActivate: [AuthGuard],
    title: 'Usuários - Cuidar+'
  },
  {
    path: 'usuarios/login',
    loadComponent: () => import('./features/usuarios/login/login.component').then(m => m.LoginComponent),
    canActivate: [AuthGuard],
    title: 'Login - Cuidar+'
  },
  {
    path: 'usuarios/cadastrar',
    loadComponent: () => import('./features/usuarios/cadastrar-usuario/cadastrar-usuario.component').then(m => m.CadastrarUsuarioComponent),
    canActivate: [AuthGuard],
    title: 'Cadastrar Usuário - Cuidar+'
  },
  {
    path: 'usuarios/editar/:id',
    loadComponent: () => import('./features/usuarios/editar-usuario/editar-usuario.component').then(m => m.EditarUsuarioComponent),
    canActivate: [AuthGuard],
    title: 'Editar Usuário - Cuidar+'
  },
  {
    path: 'usuarios/visualizar/:id',
    loadComponent: () => import('./features/usuarios/visualizar-usuario/visualizar-usuario.component').then(m => m.VisualizarUsuarioComponent),
    canActivate: [AuthGuard],
    title: 'Visualizar Usuário - Cuidar+'
  },
  {
    path: 'usuarios/:id',
    component: VisualizarUsuarioComponent
  },
  {
    path: 'setores',
    component: SetoresListComponent
  },
  {
    path: 'setores/novo',
    component: SetoresFormComponent
  },
  {
    path: 'funcoes',
    component: FuncoesListComponent
  },
  {
    path: 'funcoes/novo',
    component: FuncoesFormComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
