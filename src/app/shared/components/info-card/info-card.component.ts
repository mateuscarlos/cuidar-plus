import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card border-0 shadow-sm h-100">
      <div class="card-header bg-light">
        <h5 class="card-title mb-0">
          <i *ngIf="icon" class="bi bi-{{icon}} me-2"></i>
          {{title}}
        </h5>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() icon?: string;
}