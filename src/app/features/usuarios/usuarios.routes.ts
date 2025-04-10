import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { LoginComponent } from './login/login.component';

/**
 * Rotas para o módulo de Usuários
 */
export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    title: 'Usuários - Cuidar+'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Cuidar+'
  },
  {
    path: 'cadastrar',
    component: CadastrarUsuarioComponent,
    title: 'Cadastrar Usuário - Cuidar+'
  },
  {
    path: 'editar/:id',
    component: EditarUsuarioComponent,
    title: 'Editar Usuário - Cuidar+'
  },
  {
    path: 'visualizar/:id',
    component: VisualizarUsuarioComponent,
    title: 'Visualizar Usuário - Cuidar+'
  }
];