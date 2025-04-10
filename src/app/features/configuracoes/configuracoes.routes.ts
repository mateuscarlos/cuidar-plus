import { Routes } from '@angular/router';
import { ConfiguracoesComponent } from './configuracoes.component';
import { SetoresListComponent } from '../setores/setores-list/setores-list.component';
import { SetoresFormComponent } from '../setores/setores-form/setores-form.component';
import { FuncoesListComponent } from '../funcoes/funcoes-list/funcoes-list.component';
import { FuncoesFormComponent } from '../funcoes/funcoes-form/funcoes-form.component';

/**
 * Rotas para o módulo de Configurações
 */
export const CONFIGURACOES_ROUTES: Routes = [
  {
    path: '',
    component: ConfiguracoesComponent,
    title: 'Configurações - Cuidar+'
  },
  {
    path: 'setores',
    component: SetoresListComponent,
    title: 'Setores - Cuidar+'
  },
  {
    path: 'setores/novo',
    component: SetoresFormComponent,
    title: 'Novo Setor - Cuidar+'
  },
  {
    path: 'setores/editar/:id',
    component: SetoresFormComponent,
    title: 'Editar Setor - Cuidar+'
  },
  {
    path: 'funcoes',
    component: FuncoesListComponent,
    title: 'Funções - Cuidar+'
  },
  {
    path: 'funcoes/novo',
    component: FuncoesFormComponent,
    title: 'Nova Função - Cuidar+'
  },
  {
    path: 'funcoes/editar/:id',
    component: FuncoesFormComponent,
    title: 'Editar Função - Cuidar+'
  },
  /* {
    path: 'convenios',
    loadComponent: () => import('../convenios/convenios-list/convenios-list.component')
      .then(m => m.ConveniosListComponent),
    title: 'Convênios e Planos - Cuidar+'
  } */
];