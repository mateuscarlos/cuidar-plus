import { Component, Input } from '@angular/core';
import { AppStyleService } from './style.service';

@Component({
  selector: 'app-button',
  template: `
    <button 
      [type]="type" 
      [class]="styleService.getButtonClasses(variant, size, outline)"
      [disabled]="disabled">
      <i *ngIf="icon" [class]="'bi bi-' + icon + ' me-2'"></i>
      <ng-content></ng-content>
    </button>
  `
})
export class AppButtonComponent {
  @Input() variant: string = 'primary';
  @Input() size?: string;
  @Input() outline: boolean = false;
  @Input() icon?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;

  constructor(public styleService: AppStyleService) {}
}