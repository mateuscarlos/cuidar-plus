import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PACIENTES_ROUTES } from './features/pacientes/pacientes.routes';
import { USUARIOS_ROUTES } from './features/usuarios/usuarios.routes';
import { CONFIGURACOES_ROUTES } from './features/configuracoes/configuracoes.routes';

/**
 * Rotas principais da aplicação
 * Cada módulo de feature possui seu próprio arquivo de rotas
 */
export const routes: Routes = [
  // Rota padrão
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  // Dashboard principal
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Home - Cuidar+'
  },
  
  // Rotas do módulo de Pacientes
  {
    path: 'pacientes',
    canActivate: [AuthGuard],
    children: PACIENTES_ROUTES
  },
  
  // Rotas do módulo de Usuários
  {
    path: 'usuarios',
    children: USUARIOS_ROUTES
  },
  
  // Relatórios
  {
    path: 'relatorios',
    loadComponent: () => import('./features/relatorios/relatorios.component').then(m => m.RelatoriosComponent),
    canActivate: [AuthGuard],
    title: 'Relatórios - Cuidar+'
  },
  
  // Farmácia
  {
    path: 'farmacia',
    loadComponent: () => import('./features/farmacia/farmacia.component').then(m => m.FarmaciaComponent),
    canActivate: [AuthGuard],
    title: 'Farmácia - Cuidar+'
  },
  
  // Configurações e suas subrotas
  {
    path: 'configuracoes',
    canActivate: [AuthGuard],
    children: CONFIGURACOES_ROUTES
  },
  
  // Rota de fallback para página não encontrada
  {
    path: '**',
    redirectTo: 'home'
  }
];
