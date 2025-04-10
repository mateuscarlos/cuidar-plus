import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-header bg-light d-flex align-items-center">
        <i class="bi bi-{{ icon }} me-2"></i>
        <h6 class="card-title mb-0">{{ title }}</h6>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .card-header {
      border-bottom: none;
      background-color: rgba(0, 0, 0, 0.03);
      padding: 0.75rem 1rem;
    }
    
    .card-title {
      font-weight: 500;
      font-size: 1rem;
    }
    
    .card-body {
      padding: 1.25rem;
    }
  `]
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() icon: string = 'info-circle';
}