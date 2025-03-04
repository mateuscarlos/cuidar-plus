// header.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="header-card">
      <mat-card-header>
        <mat-card-title>Cuidar+</mat-card-title>
        <mat-card-subtitle>Simplificando a Gestão da Saúde</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {}