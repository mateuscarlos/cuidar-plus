import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusStyleService } from '../../../../styles/status-style.service';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      <i [class]="getStatusIcon()"></i>
      {{ getDisplayText() }}
    </span>
  `,
  styles: [`
    .badge {
      padding: 0.35em 0.65em;
      font-weight: 500;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
    }
    
    .badge i {
      margin-right: 0.25rem;
      font-size: 0.9em;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string | undefined;
  @Input() useLabel: boolean = true;
  
  constructor(private statusStyleService: StatusStyleService) {}
  
  getBadgeClasses(): string {
    if (!this.status) return 'badge bg-secondary';
    return `badge ${this.statusStyleService.getStatusClasses(this.status).badgeClass}`;
  }
  
  getStatusIcon(): string {
    if (!this.status) return 'bi bi-question-circle';
    return `bi bi-${this.statusStyleService.getStatusClasses(this.status).icon}`;
  }
  
  getDisplayText(): string {
    if (!this.status) return 'N/A';
    
    if (this.useLabel) {
      const label = this.statusStyleService.getStatusClasses(this.status).label;
      return label || this.status;
    }
    
    return this.status;
  }
}