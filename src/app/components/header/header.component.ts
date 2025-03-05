import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="header-card">
      <mat-card-header>
        <mat-card-title>
          <span class="logo">Cuidar+</span>
          <span class="subtitle">Simplificando a Gestão da Saúde</span>
        </mat-card-title>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {}