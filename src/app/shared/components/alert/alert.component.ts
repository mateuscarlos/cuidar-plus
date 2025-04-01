import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

type AlertType = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="alert alert-{{ type }} alert-dismissible fade show" role="alert"
         [@fadeInOut]="visible ? 'open' : 'closed'">
      <i class="bi me-2" [ngClass]="{
        'bi-check-circle-fill': type === 'success',
        'bi-info-circle-fill': type === 'info',
        'bi-exclamation-triangle-fill': type === 'warning',
        'bi-exclamation-octagon-fill': type === 'danger'
      }"></i>
      <span>{{ message }}</span>
      <button type="button" class="btn-close" (click)="close()" aria-label="Close"></button>
    </div>
  `,
  styles: [`
    .alert {
      margin-bottom: 1rem;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('closed => open', [animate('300ms ease-in')]),
      transition('open => closed', [animate('300ms ease-out')])
    ])
  ]
})
export class AlertComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: AlertType = 'info';
  @Input() autoClose: boolean = false;
  @Input() duration: number = 5000; // tempo em ms
  
  visible: boolean = true;

  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  close(): void {
    this.visible = false;
  }
}