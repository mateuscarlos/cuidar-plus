import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar class="navbar navbar-dark">
      <div class="nav-buttons">
        <button mat-button (click)="navegarPara('home')">Cuidar+</button>
        <button mat-button (click)="navegarPara('usuarios')">Usuários</button>
        <button mat-button (click)="navegarPara('farmacia')">Farmácia</button>
        <button mat-button (click)="navegarPara('pacientes')">Pacientes</button>
        <button mat-button (click)="navegarPara('relatorios')">Relatórios</button>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navegarPara(pagina: string): void {
    this.router.navigate([pagina]);
  }
}