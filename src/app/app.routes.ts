import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
  { 
    path: 'pacientes', 
    loadChildren: () => import('./features/pacientes/pacientes.routes')
      .then(m => m.PACIENTES_ROUTES) 
  },
  { 
    path: 'farmacia', 
    loadChildren: () => import('./features/farmacia/farmacia.routes')
      .then(m => m.FARMACIA_ROUTES) 
  },
  { 
    path: 'relatorios', 
    loadChildren: () => import('./features/relatorios/relatorios.routes')
      .then(m => m.RELATORIOS_ROUTES) 
  },
  { 
    path: 'configuracoes', 
    loadChildren: () => import('./features/configuracoes/configuracoes.routes')
      .then(m => m.CONFIGURACOES_ROUTES) 
  },
  { path: '**', redirectTo: 'pacientes' }
];
