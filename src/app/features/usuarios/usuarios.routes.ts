import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
/* import { adminGuard } from '../../core/guards/admin.guard'; */
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { VisualizarUsuarioComponent } from './visualizar-usuario/visualizar-usuario.component';
import { LoginComponent } from './login/login.component';
import { UsuarioBuscaPageComponent } from './usuario-busca-page/usuario-busca-page.component';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastrar',
    component: CadastrarUsuarioComponent,
    canActivate: [AuthGuard, /* adminGuard */]
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
    component: UsuarioBuscaPageComponent, // Novo componente de busca
    canActivate: [AuthGuard]
  }
];