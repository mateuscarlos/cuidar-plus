import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { LoginComponent } from './login/login.component';
import { UsuarioBuscaPageComponent } from './usuario-busca-page/usuario-busca-page.component';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista',
    component: UsuariosListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'criar',
    component: CadastrarUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar/:id',
    component: EditarUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'visualizar/:id',
    component: VisualizarUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'busca',
    component: UsuarioBuscaPageComponent,
    canActivate: [AuthGuard]
  }
];