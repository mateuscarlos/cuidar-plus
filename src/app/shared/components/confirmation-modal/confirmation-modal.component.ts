import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="modal fade show" [ngClass]="{'d-block': isOpen}" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header" [ngClass]="headerClass">
            <h5 class="modal-title" id="confirmationModalLabel">{{ title }}</h5>
            <button type="button" class="btn-close" [ngClass]="{'btn-close-white': isLight}" aria-label="Close" (click)="onCancel()"></button>
          </div>
          <div class="modal-body">
            <div [innerHTML]="message"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">{{ cancelText }}</button>
            <button type="button" class="btn" [ngClass]="btnClass" (click)="onConfirm()">{{ confirmText }}</button>
          </div>
        </div>
      </div>
      
      <div class="modal-backdrop fade show" *ngIf="isOpen"></div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirmação';
  @Input() message: SafeHtml = '';
  
  ngOnChanges(): void {
    if (!this.message) {
      this.message = '' as SafeHtml;
    }
  }
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() type: 'primary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  get headerClass(): string {
    switch (this.type) {
      case 'success': return 'bg-success text-white';
      case 'danger': return 'bg-danger text-white';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-primary text-white';
    }
  }
  
  get btnClass(): string {
    return `btn-${this.type}`;
  }
  
  get isLight(): boolean {
    return this.type === 'success' || this.type === 'danger' || this.type === 'primary';
  }
  
  onConfirm(): void {
    this.confirm.emit();
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}