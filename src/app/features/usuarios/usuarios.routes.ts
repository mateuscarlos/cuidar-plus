import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../../core/guards/auth.guard';

/**
 * Rotas para o módulo de Usuários
 */
export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
    title: 'Cadastrar Usuário - Cuidar+'
  },
  {
    path: 'editar/:id',
    component: EditarUsuarioComponent,
    canActivate: [AuthGuard],
    title: 'Editar Usuário - Cuidar+'
  },
  {
    path: 'visualizar',
    component: VisualizarUsuarioComponent,
    canActivate: [AuthGuard],
    title: 'Visualizar Usuário - Cuidar+'
  }
];