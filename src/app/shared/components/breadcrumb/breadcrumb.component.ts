import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RoutesService } from '../../../core/services/routes.service';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a [routerLink]="routesService.getRoutes().home">
            <i class="bi bi-house-door"></i> Home
          </a>
        </li>
        <ng-container *ngFor="let item of items; let last = last">
          <li class="breadcrumb-item" [class.active]="last || item.isActive">
            <ng-container *ngIf="last || item.isActive; else linkTemplate">
              {{ item.label }}
            </ng-container>
            <ng-template #linkTemplate>
              <a [routerLink]="item.path">{{ item.label }}</a>
            </ng-template>
          </li>
        </ng-container>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      background-color: rgba(0,0,0,.03);
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      margin-bottom: 1rem;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  @Input() items: BreadcrumbItem[] = [];
  
  constructor(public routesService: RoutesService) {}
  
  ngOnInit(): void {
    // Marca o último item como ativo se nenhum item estiver marcado explicitamente
    if (this.items.length > 0 && !this.items.some(item => item.isActive)) {
      this.items[this.items.length - 1].isActive = true;
    }
  }
}