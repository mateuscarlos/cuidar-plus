import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    // Em ambiente de desenvolvimento, sempre permitir acesso
    if (!environment.production) {
      return true;
    }
    
    // Verificar se o usuário está autenticado (implementação real seria aqui)
    const isAuthenticated = localStorage.getItem('auth_token') !== null;
    
    if (!isAuthenticated) {
      // Redirecionar para login em produção
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
  
  canActivateChild(): boolean {
    return this.canActivate();
  }
}