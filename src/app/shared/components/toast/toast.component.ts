import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, ToastInfo } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Array<ToastInfo & { id: number }> = [];
  private subscription: Subscription | null = null;
  private counter = 0;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.getToasts().subscribe(toast => {
      this.showToast(toast);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private showToast(toast: ToastInfo): void {
    const id = ++this.counter;
    this.toasts.push({ ...toast, id });

    // Fechar automaticamente após o tempo definido
    if (toast.autoClose) {
      setTimeout(() => {
        this.removeToast(id);
      }, toast.delay || 5000);
    }
  }

  removeToast(id: number): void {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex !== -1) {
      const toastElement = document.querySelector(`.toast:nth-child(${toastIndex + 1})`);
      if (toastElement) {
        toastElement.classList.add('fade-out');
        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== id);
        }, 300); // Tempo da animação
      }
    }
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success text-white';
      case 'error': return 'bg-danger text-white';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-dark';
      default: return 'bg-light text-dark';
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-bell-fill';
    }
  }
}